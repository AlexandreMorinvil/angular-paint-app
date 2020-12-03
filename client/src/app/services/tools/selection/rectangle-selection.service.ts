import { Injectable } from '@angular/core';
import { InteractionSelection } from '@app/classes/action/interaction-selection';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Vec2 } from '@app/classes/vec2';
// import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { SelectionToolService } from '@app/services/tools/selection/selection-tool.service';
// tslint:disable:max-file-line-count
@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionService extends SelectionToolService {
    private imageRotation: ImageData;
    constructor(
        drawingService: DrawingService,
        // private drawingStateTrackingService: DrawingStateTrackerService,
        private rectangleService: RectangleService,
        private tracingService: TracingService,
        private colorService: ColorService,
        private widthService: WidthService,
    ) {
        super(drawingService, colorService, new Description('selection rectangle', 'r', 'rectangle-selection.png'));
        this.image = new Image();
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.mouseDown) {
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
            this.getAnchorHit(this.drawingService.previewCtx, this.mouseDownCoord, 2);
            this.pathLastCoord = this.getBottomRightCorner(); // besoin pour le clearCanvas
            // remove original ellipse from base
            this.drawingService.baseCtx.clearRect(this.startDownCoord.x, this.startDownCoord.y, this.selectionSize.x, this.selectionSize.y);
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
            // this.resetCanvasRotation();
            if (this.selectionCreated) {
                this.drawOnBaseCanvas();
                this.selectionCreated = false;
                // this.addActionTracking(this.startDownCoord);
            }
            this.rectangleService.onMouseDown(event);
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
            this.getAnchorHit(this.drawingService.previewCtx, MOUSE_POSITION, 2);
            // creation
        } else if (this.isInCanvas(MOUSE_POSITION) && this.localMouseDown) {
            this.rectangleService.onMouseMove(event);
            if (this.startDownCoord.x !== MOUSE_POSITION.x && this.startDownCoord.y !== MOUSE_POSITION.y && this.rectangleService.shiftDown) {
                const SQUARE = this.getSquaredSize(MOUSE_POSITION);
                this.selectionSize = { x: SQUARE.x, y: SQUARE.y };
            } else if (this.startDownCoord.x !== MOUSE_POSITION.x && this.startDownCoord.y !== MOUSE_POSITION.y && !this.rectangleService.shiftDown) {
                this.selectionSize = { x: Math.abs(this.startDownCoord.x - MOUSE_POSITION.x), y: Math.abs(this.startDownCoord.y - MOUSE_POSITION.y) };
            }
            // this.pathData.push(MOUSE_POSITION);
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
            this.rectangleService.mouseDownCoord = this.startDownCoord;
            this.pathLastCoord = this.getBottomRightCorner();
            this.pathData.push(this.pathLastCoord);
            this.drawSelectionSurround(); // draw selection box and anchor
            // set values
            this.draggingImage = false;
            this.hasDoneFirstTranslation = true;
            // resizing
        } else if (this.clickOnAnchor) {
            this.getAnchorHit(this.drawingService.previewCtx, MOUSE_POSITION, 2); // draw new image on preview
            this.getAnchorHit(this.drawingService.baseCtx, MOUSE_POSITION, 2); // draw new image on base for saving image.src
            this.pathData.push({ x: this.resizeStartCoords.x + this.resizeWidth, y: this.resizeStartCoords.y + this.resizeHeight });
            this.startDownCoord = this.offsetAnchors(this.resizeStartCoords); // set new startCoords with the resize
            this.selectionSize = { x: Math.abs(this.resizeWidth), y: Math.abs(this.resizeHeight) };
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL(); // save new image with resized selection
            this.pathLastCoord = this.getBottomRightCorner();
            // this.addActionTracking(this.pathLastCoord); // Undo redo
            // remove original ellipse from base
            this.drawingService.baseCtx.clearRect(this.startDownCoord.x, this.startDownCoord.y, this.selectionSize.x, this.selectionSize.y);
            this.firstSelectionCoord = this.startDownCoord; // reset firstSelectionCoord to new place on new image
            // draw selection surround
            this.rectangleService.mouseDownCoord = this.startDownCoord;
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
            // addActionTracking()
            // put selection on previewCanvas
            this.pathLastCoord = this.getBottomRightCorner();
            this.showSelection(this.drawingService.previewCtx, this.image, this.firstSelectionCoord, this.selectionSize);
            // remove original ellipse from base
            this.drawingService.baseCtx.clearRect(this.startDownCoord.x, this.startDownCoord.y, this.selectionSize.x, this.selectionSize.y);
            this.selectionCreated = true;
            // draw selection surround
            this.drawSelectionSurround();
            // set up values
            this.selectionCreated = true;
            this.hasDoneFirstRotation = false;
            this.hasDoneFirstTranslation = false;
        }
        this.localMouseDown = false;
        this.clearPath();
    }

    // puts selection on baseCanvas
    drawOnBaseCanvas(): void {
        if (this.selectionCreated) {
            this.showSelection(this.drawingService.baseCtx, this.image, this.firstSelectionCoord, this.selectionSize);
        }
    }

    private drawSelectionSurround(): void {
        this.rectangleService.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
        this.drawnAnchor(this.drawingService.previewCtx);
    }

    private showSelection(canvas: CanvasRenderingContext2D, image: HTMLImageElement, imageStart: Vec2, size: Vec2): void {
        canvas.save();
        this.drawImage(canvas, image, imageStart, this.selectionSize, this.startDownCoord, size);
        canvas.restore();
    }

    onShiftDown(event: KeyboardEvent): void {
        if (!event.ctrlKey) {
            this.shiftDown = true;
            this.ratio = this.getRatio(this.selectionSize.x, this.selectionSize.y);
            if (!this.clickOnAnchor) {
                this.rectangleService.shiftDown = true;
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
                this.rectangleService.shiftDown = false;
                if (this.localMouseDown) {
                    const MOUSE_EVENT = this.createOnMouseMoveEvent();
                    this.onMouseMove(MOUSE_EVENT);
                }
            }
        }
    }

    onArrowDown(event: KeyboardEvent): void {
        if (!this.arrowDown) {
            this.arrowCoord = this.startDownCoord;
            if (this.hasDoneFirstTranslation) {
                // this.putImageData(this.arrowCoord, this.drawingService.baseCtx, this.oldImageData);
            }
            // Puts a white rectangle on selection original placement
            else {
                this.drawingService.baseCtx.clearRect(this.arrowCoord.x, this.arrowCoord.y, this.selectionSize.x, this.selectionSize.y);
            }
            this.startSelectionPoint = { x: this.startDownCoord.x, y: this.startDownCoord.y };
        }
        if (this.selectionCreated) {
            this.pathLastCoord = { x: this.startDownCoord.x + this.selectionSize.x, y: this.startDownCoord.y + this.selectionSize.y };
            this.checkArrowHit(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clearPath();
            this.rectangleService.mouseDownCoord = this.startDownCoord;
            this.pathData.push(this.pathLastCoord);
            // this.drawingService.previewCtx.putImageData(this.imageData, this.startDownCoord.x, this.startDownCoord.y);
        }
    }

    onArrowUp(event: KeyboardEvent): void {
        if (this.selectionCreated) {
            this.checkArrowUnhit(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.arrowPress.every((v) => !v)) {
                this.arrowDown = false;
                this.clearPath();
                this.pathLastCoord = { x: this.startDownCoord.x + this.selectionSize.x, y: this.startDownCoord.y + this.selectionSize.y };
                this.pathData.push(this.pathLastCoord);
                // const SAVED_OLD_IMAGE_DATA = this.oldImageData;
                /* this.oldImageData = this.drawingService.baseCtx.getImageData(
                    this.startDownCoord.x,
                    this.startDownCoord.y,
                    this.selectionSize.x,
                    this.selectionSize.y,
                );*/
                this.rectangleService.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
                this.drawnAnchor(this.drawingService.previewCtx);
                // this.putImageData(this.startDownCoord, this.drawingService.baseCtx, this.imageData);
                /*this.drawingStateTrackingService.addAction(
                    this,
                    new InteractionSelection(
                        this.hasDoneFirstTranslation,
                        this.startSelectionPoint,
                        this.startDownCoord,
                        this.imageData,
                        SAVED_OLD_IMAGE_DATA,
                    ),
                );*/
                this.hasDoneFirstTranslation = true;
            }
            if (this.arrowDown) {
                this.onArrowDown({} as KeyboardEvent);
            }
        }
    }

    onCtrlADown(): void {
        this.localMouseDown = true;
        this.startDownCoord = { x: 0, y: 0 };
        this.rectangleService.mouseDownCoord = { x: 0, y: 0 };
        const MOUSE_EVENT = {
            offsetX: this.drawingService.baseCtx.canvas.width,
            offsetY: this.drawingService.baseCtx.canvas.height,
            button: 0,
        } as MouseEvent;
        /*this.imageData = this.drawingService.baseCtx.getImageData(
            this.startDownCoord.x,
            this.startDownCoord.y,
            this.drawingService.baseCtx.canvas.width,
            this.drawingService.baseCtx.canvas.height,
        );*/
        this.onMouseUp(MOUSE_EVENT);
    }

    // tslint:disable:no-magic-numbers
    onMouseWheel(event: WheelEvent): void {
        if (!this.mouseDown) {
            this.onEscapeDown();
        }
        if (this.selectionCreated) {
            // calculate desire angle for canvas rotation
            this.calculateRotation(event.altKey, event.deltaY / 100);
            this.rotateRectangle();
        }
    }
    private rotateRectangle(): void {
        // setting up variable/const
        const SIZE = { x: this.selectionSize.x, y: this.selectionSize.y };
        const TRANSLATION = { x: this.startDownCoord.x + SIZE.x / 2, y: this.startDownCoord.y + SIZE.y / 2 };
        const MEMORY_COORDS = this.startDownCoord;

        // clearing old spot
        const MAX_SIDE = Math.hypot(SIZE.x, SIZE.y) + 1;
        this.putImageData({ x: TRANSLATION.x - MAX_SIDE / 2, y: TRANSLATION.y - MAX_SIDE / 2 }, this.drawingService.baseCtx, this.imageRotation);
        if (!this.hasDoneFirstTranslation || this.hasDoneResizing) {
            this.drawingService.baseCtx.clearRect(MEMORY_COORDS.x, MEMORY_COORDS.y, SIZE.x, SIZE.y);
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        // rotation
        this.rotateCanvas();
        this.startDownCoord = { x: -SIZE.x / 2, y: -SIZE.y / 2 };
        this.drawImage(this.drawingService.baseCtx, this.image, this.startSelectionPoint, SIZE, this.startDownCoord, SIZE);

        // reset canvas transform after rotation
        this.resetCanvasRotation();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        // draw selection preview
        this.startDownCoord = { x: TRANSLATION.x - MAX_SIDE / 2, y: TRANSLATION.y - MAX_SIDE / 2 };
        this.drawingService.previewCtx.beginPath();
        this.drawingService.previewCtx.rect(this.startDownCoord.x, this.startDownCoord.y, MAX_SIDE, MAX_SIDE);
        this.drawingService.previewCtx.stroke();
        this.drawnAnchor(this.drawingService.previewCtx, { x: MAX_SIDE, y: MAX_SIDE });
        this.startDownCoord = MEMORY_COORDS;
        this.hasDoneFirstRotation = true;
    }

    private resetTransform(): void {
        this.widthService.setWidth(1);
        this.colorService.setPrimaryColor('#000000');
        this.colorService.setSecondaryColor('#000000');
        this.tracingService.setHasFill(false);
        this.tracingService.setHasContour(true);
    }

    execute(interaction: InteractionSelection): void {
        this.resetTransform();
        if (interaction.hasDoneFirstSelection)
            this.putImageData(interaction.startSelectionPoint, this.drawingService.baseCtx, interaction.belowSelection);
        else
            this.drawingService.baseCtx.clearRect(
                interaction.startSelectionPoint.x,
                interaction.startSelectionPoint.y,
                interaction.selection.width,
                interaction.selection.height,
            );
        this.putImageData(interaction.movePosition, this.drawingService.baseCtx, interaction.selection);
    }
}
