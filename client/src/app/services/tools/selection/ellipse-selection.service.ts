import { Injectable } from '@angular/core';
import { InteractionSelectionEllipse } from '@app/classes/action/interaction-selection-ellipse';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Vec2 } from '@app/classes/vec2';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { SelectionToolService } from '@app/services/tools/selection/selection-tool.service';
// tslint:disable:max-file-line-count
@Injectable({
    providedIn: 'root',
})
export class EllipseSelectionService extends SelectionToolService {
    protected oldImage: HTMLImageElement;
    pathLastCoord: Vec2;

    constructor(
        drawingService: DrawingService,
        private drawingStateTrackingService: DrawingStateTrackerService,
        private ellipseService: EllipseService,
        private tracingService: TracingService,
        private colorService: ColorService,
        private widthService: WidthService,
    ) {
        super(drawingService, colorService, new Description('selection ellipse', 's', 'ellipse-selection.png'));
        this.image = new Image();
        this.oldImage = new Image();
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.mouseDown) {
            // if there is a tool change the selection won't reapply
            this.onEscapeDown();
        }
        this.arrowPress = [false, false, false, false];
        this.arrowDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.localMouseDown = event.button === MouseButton.Left;
        this.mouseDown = true;
        this.resetTransform();
        // resizing
        if (this.selectionCreated && this.checkHit(this.mouseDownCoord)) {
            this.getAnchorHit(this.drawingService.previewCtx, this.mouseDownCoord, 1);
            this.pathLastCoord = this.getBottomRightCorner(); // besoin pour le clearCanvas
            this.clearCanvasEllipse();
            // for undo redo
            this.pathData.push(this.firstSelectionCoord);
            this.startSelectionPoint = this.offsetAnchors(this.startDownCoord);
            // translate
        } else if (this.selectionCreated && this.hitSelection(this.mouseDownCoord.x, this.mouseDownCoord.y)) {
            this.pathLastCoord = this.getBottomRightCorner(); // pour le showSelection
            this.draggingImage = true;
            this.showSelection(this.drawingService.previewCtx, this.image, this.firstSelectionCoord, this.selectionSize);
            // creation
        } else {
            // FAIRE QUE UNDO REDO METTE SELECTIONCREATED A FALSE
            if (this.selectionCreated) {
                this.drawOnBaseCanvas();
                this.selectionCreated = false;
                this.addActionTracking(this.startDownCoord);
            }
            this.ellipseService.onMouseDown(event);
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.angle = 0;
            this.startDownCoord = this.getPositionFromMouse(event);
            this.firstSelectionCoord = this.startDownCoord;
            this.startSelectionPoint = this.startDownCoord;
        }
    }

    onMouseMove(event: MouseEvent): void {
        const MOUSE_POSITION = this.getPositionFromMouse(event);
        // translate
        if (this.draggingImage && this.localMouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.startDownCoord = this.evenImageStartCoord(MOUSE_POSITION);
            this.pathLastCoord = this.getBottomRightCorner(); // besoin pour le showSelection
            this.showSelection(this.drawingService.previewCtx, this.image, this.firstSelectionCoord, this.selectionSize);
            // resizing
        } else if (this.clickOnAnchor && this.localMouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.getAnchorHit(this.drawingService.previewCtx, MOUSE_POSITION, 1);
            // creation
        } else if (this.isInCanvas(MOUSE_POSITION) && this.localMouseDown) {
            this.ellipseService.onMouseMove(event);
            if (this.startDownCoord.x !== MOUSE_POSITION.x && this.startDownCoord.y !== MOUSE_POSITION.y && this.shiftDown) {
                const SQUARE = this.getSquaredSize(MOUSE_POSITION); // pk square est un vec2
                this.selectionSize = { x: SQUARE.x, y: SQUARE.y };
            } else if (this.startDownCoord.x !== MOUSE_POSITION.x && this.startDownCoord.y !== MOUSE_POSITION.y && !this.shiftDown) {
                this.selectionSize = { x: Math.abs(this.startDownCoord.x - MOUSE_POSITION.x), y: Math.abs(this.startDownCoord.y - MOUSE_POSITION.y) };
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        const MOUSE_POSITION = this.getPositionFromMouse(event);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        // translate
        if (this.draggingImage) {
            // put selection on previewCanvas
            this.startDownCoord = this.evenImageStartCoord(MOUSE_POSITION);
            this.showSelection(this.drawingService.previewCtx, this.image, this.firstSelectionCoord, this.selectionSize);
            // draw selection surround
            this.ellipseService.mouseDownCoord = this.startDownCoord;
            this.pathLastCoord = this.getBottomRightCorner();
            this.pathData.push(this.pathLastCoord);
            this.drawSelectionSurround(); // draw selection box and anchor
            // set values
            this.draggingImage = false;
            this.hasDoneFirstTranslation = true;
            // resizing
        } else if (this.clickOnAnchor) {
            this.getAnchorHit(this.drawingService.previewCtx, MOUSE_POSITION, 1); // draw new image on preview
            this.getAnchorHit(this.drawingService.baseCtx, MOUSE_POSITION, 1); // draw new image on base for saving image.src
            this.pathData.push({ x: this.resizeStartCoords.x + this.resizeWidth, y: this.resizeStartCoords.y + this.resizeHeight });
            this.startDownCoord = this.offsetAnchors(this.resizeStartCoords); // set new startCoords with the resize
            this.selectionSize = { x: Math.abs(this.resizeWidth), y: Math.abs(this.resizeHeight) };
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL(); // save new image with resized selection
            this.pathLastCoord = this.getBottomRightCorner();
            this.addActionTracking(this.pathLastCoord); // Undo redo
            this.clearCanvasEllipse(); // remove the ellipse from base after the new image saved
            this.firstSelectionCoord = this.startDownCoord; // reset firstSelectionCoord to new place on new image
            // draw selection surround
            this.ellipseService.mouseDownCoord = this.startDownCoord;
            this.pathData.push(this.pathLastCoord);
            this.drawSelectionSurround(); // draw selection box and anchor
            // set values
            this.clickOnAnchor = false;
            this.hasDoneResizing = true;
            // creation
        } else if (this.localMouseDown) {
            // set up pathData last coords, depending on shift down or not for offsetAnchor
            if (this.shiftDown) {
                const SQUARE = this.getSquaredSize(MOUSE_POSITION);
                this.pathData.push({ x: SQUARE.x + this.startDownCoord.x, y: SQUARE.y + this.startDownCoord.y });
            } else {
                this.pathData.push(MOUSE_POSITION);
            }
            // Puts startDownCoord at the top left of the selection
            this.startDownCoord = this.offsetAnchors(this.startDownCoord);
            this.firstSelectionCoord = this.startDownCoord;
            this.addActionTracking(MOUSE_POSITION);
            // put selection on previewCanvas
            this.pathLastCoord = this.getBottomRightCorner();
            this.showSelection(this.drawingService.previewCtx, this.image, this.firstSelectionCoord, this.selectionSize);
            this.clearCanvasEllipse(); // remove original ellipse from base
            // draw selection surround
            this.drawSelectionSurround(); // draw selection box and anchor
            // set up values
            this.selectionCreated = true;
            this.hasDoneFirstRotation = false;
            this.hasDoneFirstTranslation = false;
        }
        this.localMouseDown = false;
        this.clearPath();
    }

    // tslint:disable:no-magic-numbers
    onMouseWheel(event: WheelEvent): void {
        if (!this.mouseDown) {
            // if there is a tool change the rotation won't reapply
            this.onEscapeDown();
        }
        if (this.selectionCreated) {
            // Setting up the constants
            const MEMORY_COORDS = this.startDownCoord;
            const TRANSLATION = { x: this.startDownCoord.x + this.selectionSize.x / 2, y: this.startDownCoord.y + this.selectionSize.y / 2 };
            const MAX_SIDE = Math.max(this.selectionSize.x, this.selectionSize.y);
            // calculate desire angle for canvas rotation
            this.calculateRotation(event.altKey, event.deltaY / 100);
            // clearing canvas for rotation
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            // does translation and rotation of the canvas
            this.rotateCanvas();
            this.showSelection(this.drawingService.previewCtx, this.image, this.firstSelectionCoord, this.selectionSize);
            // reset canvas transform after rotation
            this.resetCanvasRotation();
            // draw selection surround
            this.startDownCoord = { x: TRANSLATION.x - MAX_SIDE / 2, y: TRANSLATION.y - MAX_SIDE / 2 };
            this.pathLastCoord = { x: this.startDownCoord.x + MAX_SIDE, y: this.startDownCoord.y + MAX_SIDE };
            this.pathData.push(this.pathLastCoord);
            this.ellipseService.mouseDownCoord = this.startDownCoord;
            this.drawSelectionSurround();
            this.clearPath();
            this.hasDoneFirstRotation = true;
            // reset startDownCoord to original value
            this.startDownCoord = MEMORY_COORDS;
        }
    }

    private showSelection(canvas: CanvasRenderingContext2D, image: HTMLImageElement, imageStart: Vec2, size: Vec2): void {
        canvas.save();
        const ELLIPSE_PATH = this.getPath(this.startDownCoord);
        canvas.clip(ELLIPSE_PATH);
        this.drawImage(canvas, image, imageStart, this.selectionSize, this.startDownCoord, size);
        canvas.restore();
    }

    private clearCanvasEllipse(): void {
        const PATH = this.getPath(this.startDownCoord);
        PATH.closePath();
        this.drawingService.baseCtx.fillStyle = 'white';
        this.drawingService.baseCtx.fill(PATH, 'evenodd');
    }

    private drawSelectionSurround(): void {
        this.ellipseService.drawEllipse(this.drawingService.previewCtx, this.pathData);
        this.ellipseService.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
        this.drawnAnchor(this.drawingService.previewCtx);
    }

    private resetTransform(): void {
        this.widthService.setWidth(1);
        this.colorService.setPrimaryColor('#000000');
        this.colorService.setSecondaryColor('#000000');
        this.tracingService.setHasFill(false);
        this.tracingService.setHasContour(true);
    }

    private addActionTracking(position: Vec2): void {
        const TRACKING_INFO = this.getActionTrackingInfo(position);
        const IMAGE_DATA_SELECTION = this.drawingService.baseCtx.getImageData(
            TRACKING_INFO[0].x,
            TRACKING_INFO[0].y,
            TRACKING_INFO[1].x - TRACKING_INFO[0].x,
            TRACKING_INFO[1].y - TRACKING_INFO[0].y,
        );
        this.drawingStateTrackingService.addAction(
            this,
            new InteractionSelectionEllipse({ x: TRACKING_INFO[0].x, y: TRACKING_INFO[0].y }, IMAGE_DATA_SELECTION),
        );
    }

    // puts selection on baseCanvas
    drawOnBaseCanvas(): void {
        if (this.selectionCreated) {
            this.showSelection(this.drawingService.baseCtx, this.image, this.firstSelectionCoord, this.selectionSize);
        }
    }

    onEscapeDown(): void {
        if (this.selectionCreated) {
            this.drawOnBaseCanvas();
            this.addActionTracking(this.startDownCoord);
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selectionCreated = false;
        this.arrowDown = true;
    }

    onShiftDown(event: KeyboardEvent): void {
        if (!event.ctrlKey) {
            this.shiftDown = true;
            if (this.clickOnAnchor) {
                this.ratio = this.getRatio(this.selectionSize.x, this.selectionSize.y);
            } else {
                this.ellipseService.shiftDown = true;
                if (this.localMouseDown) {
                    const MOUSE_EVENT = this.createOnMouseMoveEvent();
                    this.onMouseMove(MOUSE_EVENT);
                }
            }
        }
    }

    onShiftUp(event: KeyboardEvent): void {
        if (!event.ctrlKey) {
            this.shiftDown = false;
            if (!this.clickOnAnchor) {
                this.ellipseService.shiftDown = false;
                if (this.localMouseDown) {
                    const MOUSE_EVENT = this.createOnMouseMoveEvent();
                    this.onMouseMove(MOUSE_EVENT);
                }
            }
        }
    }

    onArrowDown(event: KeyboardEvent): void {
        if (!this.arrowDown) {
            this.arrowCoord = this.getBottomRightCorner();
            this.ellipseService.mouseDownCoord = this.startDownCoord;
            this.pathData.push(this.arrowCoord);
            if (this.hasDoneFirstTranslation) {
                this.showSelection(
                    this.drawingService.baseCtx,
                    this.oldImage,
                    { x: this.selectionSize.x, y: this.selectionSize.y },
                    this.firstSelectionCoord,
                );
            }
            // Puts a white rectangle on selection original placement
            else {
                this.clearCanvasEllipse();
            }
            this.startSelectionPoint = { x: this.startDownCoord.x, y: this.startDownCoord.y };
        }
        if (this.selectionCreated) {
            this.checkArrowHit(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.showSelection(this.drawingService.previewCtx, this.image, this.firstSelectionCoord, {
                x: this.selectionSize.x,
                y: this.selectionSize.y,
            });
            this.draggingImage = false;
        }
    }

    onArrowUp(event: KeyboardEvent): void {
        if (this.selectionCreated) {
            this.checkArrowUnhit(event);
            if (this.arrowPress.every((v) => v === false)) {
                this.arrowDown = false;
                this.draggingImage = true;
                this.clearPath();
                this.pathData.push(this.pathLastCoord);
                this.ellipseService.mouseDownCoord = this.startDownCoord;
                this.clearPath();
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.onMouseUp({ offsetX: 25, offsetY: 25, button: 0 } as MouseEvent);
                this.draggingImage = false;
                this.hasDoneFirstTranslation = true;
            }
            if (this.arrowDown) {
                this.onArrowDown({} as KeyboardEvent);
            }
        }
    }

    onCtrlADown(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.resetTransform();
        this.localMouseDown = true;
        this.startDownCoord = { x: 0, y: 0 };
        this.firstSelectionCoord = { x: 0, y: 0 };
        this.ellipseService.mouseDownCoord = { x: 0, y: 0 };
        this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
        this.selectionSize = { x: this.drawingService.baseCtx.canvas.width, y: this.drawingService.baseCtx.canvas.height };
        const MOUSE_EVENT = {
            offsetX: this.selectionSize.x,
            offsetY: this.selectionSize.y,
            button: 0,
        } as MouseEvent;
        this.onMouseUp(MOUSE_EVENT);
    }

    execute(interaction: InteractionSelectionEllipse): void {
        this.selectionCreated = false;
        this.drawingService.baseCtx.putImageData(interaction.selection, interaction.startSelectionPoint.x, interaction.startSelectionPoint.y);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
