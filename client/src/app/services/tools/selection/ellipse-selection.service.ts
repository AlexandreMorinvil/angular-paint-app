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
    firstEllipseCoord: Vec2;
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
            this.selectionCreated = false;
        }
        this.arrowPress = [false, false, false, false];
        this.arrowDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.localMouseDown = event.button === MouseButton.Left;
        this.resetTransform();
        // resizing
        if (this.selectionCreated && this.checkHit(this.mouseDownCoord)) {
            this.getAnchorHit(this.drawingService.previewCtx, this.mouseDownCoord, 1);
            this.pathLastCoord = this.mouseDownCoord;
            this.startSelectionPoint = this.startDownCoord;
            // translate
        } else if (this.selectionCreated && this.hitSelection(this.mouseDownCoord.x, this.mouseDownCoord.y)) {
            this.pathData.push(this.pathLastCoord);
            this.startSelectionPoint = this.startDownCoord;
            if (this.hasDoneFirstTranslation) {
                this.clearCanvasEllipse();
                this.showSelection(
                    this.drawingService.baseCtx,
                    this.oldImage,
                    { x: this.imageData.width, y: this.imageData.height },
                    this.firstEllipseCoord,
                    1,
                );
            } else {
                this.clearCanvasEllipse();
            }
            this.draggingImage = true;
            this.rotateCanvas(this.angle);
            this.startDownCoord = { x: -this.imageData.width / 2, y: -this.imageData.height / 2 };
            this.showSelection(
                this.drawingService.previewCtx,
                this.image,
                { x: this.imageData.width, y: this.imageData.height },
                this.firstEllipseCoord,
            );
            // reset canvas transform after rotation
            this.resetCanvasRotation();
            this.startDownCoord = this.evenImageStartCoord(this.mouseDownCoord);
            this.mouseDown = true;
            //this.angle = 0;
            // creation
        } else {
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.imageData = new ImageData(1, 1);
            this.startDownCoord = this.getPositionFromMouse(event);
            this.firstEllipseCoord = this.getPositionFromMouse(event);
            this.ellipseService.onMouseDown(event);
            this.pathData.push(this.startDownCoord);
            this.startSelectionPoint = this.getPositionFromMouse(event);
            this.mouseDown = true;
            this.angle = 0;
        }
    }

    onMouseMove(event: MouseEvent): void {
        const MOUSE_POSITION = this.getPositionFromMouse(event);
        // translate
        if (this.draggingImage && this.localMouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.firstEllipseCoord = this.offsetAnchors(this.firstEllipseCoord);
            this.rotateCanvas(this.angle);
            this.startDownCoord = { x: -this.imageData.width / 2, y: -this.imageData.height / 2 };
            this.showSelection(
                this.drawingService.previewCtx,
                this.image,
                { x: this.imageData.width, y: this.imageData.height },
                this.firstEllipseCoord,
            );
            // reset canvas transform after rotation
            this.resetCanvasRotation();
            this.startDownCoord = this.evenImageStartCoord(MOUSE_POSITION);
            this.pathLastCoord = { x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y + this.imageData.height };
            // resizing
        } else if (this.clickOnAnchor && this.localMouseDown) {
            this.pathData.push({ x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y + this.imageData.height });
            this.clearCanvasEllipse();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.getAnchorHit(this.drawingService.previewCtx, MOUSE_POSITION, 1);
            // creation
        } else if (this.isInCanvas(MOUSE_POSITION) && this.localMouseDown) {
            this.ellipseService.onMouseMove(event);
            if (this.startDownCoord.x !== MOUSE_POSITION.x && this.startDownCoord.y !== MOUSE_POSITION.y && this.ellipseService.shiftDown) {
                const SQUARE = this.getSquaredSize(MOUSE_POSITION);
                this.imageData = this.drawingService.baseCtx.getImageData(this.startDownCoord.x, this.startDownCoord.y, SQUARE.x, SQUARE.y);
            } else if (this.startDownCoord.x !== MOUSE_POSITION.x && this.startDownCoord.y !== MOUSE_POSITION.y && !this.ellipseService.shiftDown) {
                this.imageData = this.drawingService.baseCtx.getImageData(
                    this.startDownCoord.x,
                    this.startDownCoord.y,
                    MOUSE_POSITION.x - this.startDownCoord.x,
                    MOUSE_POSITION.y - this.startDownCoord.y,
                );
            }
            this.pathData.push(MOUSE_POSITION);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const MOUSE_POSITION = this.getPositionFromMouse(event);
        const SIZE = { x: this.imageData.width, y: this.imageData.height };
        const TRANSLATION = { x: this.startDownCoord.x + SIZE.x / 2, y: this.startDownCoord.y + SIZE.y / 2 };
        const MEMORY_COORDS = this.startDownCoord;
        const MAX_SIDE = Math.max(SIZE.x, SIZE.y);
        // translate
        if (this.draggingImage) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.oldImage.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.getImageRotation();
            this.ellipseService.mouseDownCoord = this.startDownCoord;
            this.pathLastCoord = { x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y + this.imageData.height };
            this.pathData.push(this.pathLastCoord);
            this.rotateCanvas(this.angle);
            this.startDownCoord = { x: -this.imageData.width / 2, y: -this.imageData.height / 2 };
            this.showSelection(
                this.drawingService.baseCtx,
                this.image,
                { x: this.imageData.width, y: this.imageData.height },
                this.firstEllipseCoord,
            );
            // reset canvas transform after rotation
            this.resetCanvasRotation();
            this.startDownCoord = this.ellipseService.mouseDownCoord;
            const TRACKING_INFO = this.getActionTrackingInfo(this.startDownCoord);
            this.addActionTracking(TRACKING_INFO);
            //this.ellipseService.drawEllipse(this.drawingService.previewCtx, this.pathData);
            //this.ellipseService.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
            //this.startDownCoord = { x: this.pathData[0].x, y: this.pathData[0].y };
            //this.startDownCoord = { x: this.pathData[1].x - this.imageData.width, y: this.pathData[1].y - this.imageData.height };

            //this.drawnAnchor(this.drawingService.previewCtx);
            this.draggingImage = false;
            //this.firstEllipseCoord = this.startDownCoord;
            //this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.hasDoneFirstTranslation = true;
            // Added

            // draw selection preview
            this.startDownCoord = { x: TRANSLATION.x - MAX_SIDE / 2, y: TRANSLATION.y - MAX_SIDE / 2 };
            this.pathLastCoord = { x: this.startDownCoord.x + MAX_SIDE, y: this.startDownCoord.y + MAX_SIDE };
            this.pathData.push(this.pathLastCoord);
            this.ellipseService.mouseDownCoord = this.startDownCoord;
            this.ellipseService.drawEllipse(this.drawingService.previewCtx, this.pathData);
            this.ellipseService.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
            this.drawnAnchor(this.drawingService.previewCtx, { x: MAX_SIDE, y: MAX_SIDE });
            this.clearPath();
            this.startDownCoord = MEMORY_COORDS;
            // resizing
        } else if (this.clickOnAnchor) {
            this.getAnchorHit(this.drawingService.baseCtx, MOUSE_POSITION, 1);
            this.pathData.push(MOUSE_POSITION);
            this.offsetAnchors(this.startDownCoord);
            this.clearPath();
            this.imageData = this.drawingService.baseCtx.getImageData(
                this.startDownCoord.x,
                this.startDownCoord.y,
                this.resizeWidth,
                this.resizeHeight,
            );
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.getImageRotation();
            this.pathData.push({ x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y + this.imageData.height });
            this.ellipseService.drawEllipse(this.drawingService.previewCtx, this.pathData);
            this.ellipseService.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
            this.drawnAnchor(this.drawingService.previewCtx);
            this.clearPath();
            this.clickOnAnchor = false;
            this.hasDoneResizing = true;
            const TRACKING_INFO = this.getActionTrackingInfo(MOUSE_POSITION);
            this.addActionTracking(TRACKING_INFO);
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL();

            // creation
        } else if (this.mouseDown) {
            if (this.ellipseService.shiftDown) {
                const SQUARE = this.getSquaredSize(MOUSE_POSITION);
                this.pathData.push({ x: SQUARE.x + this.startDownCoord.x, y: SQUARE.y + this.startDownCoord.y });
            } else {
                this.pathData.push(MOUSE_POSITION);
            }
            this.oldImage.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.ellipseService.drawEllipse(this.drawingService.previewCtx, this.pathData);
            this.startDownCoord = this.offsetAnchors(this.startDownCoord);
            this.drawnAnchor(this.drawingService.previewCtx);
            this.selectionCreated = true;
            this.pathLastCoord = this.pathData[this.pathData.length - 1];
            this.showSelection(
                this.drawingService.previewCtx,
                this.image,
                { x: this.imageData.width, y: this.imageData.height },
                this.firstEllipseCoord,
            );
            this.getImageRotation();
            this.hasDoneFirstRotation = false;
            this.hasDoneFirstTranslation = false;
        }
        this.localMouseDown = false;
        this.clearPath();
    }

    onShiftDown(event: KeyboardEvent): void {
        if (!event.ctrlKey) {
            this.shiftDown = true;
            this.ratio = this.getRatio(this.imageData.width, this.imageData.height);
            if (!this.clickOnAnchor) {
                this.ellipseService.shiftDown = true;
                this.createOnMouseMoveEvent();
            }
        }
    }

    onShiftUp(event: KeyboardEvent): void {
        if (!event.ctrlKey) {
            this.shiftDown = false;
            if (!this.clickOnAnchor) {
                this.ellipseService.shiftDown = false;
                this.createOnMouseMoveEvent();
            }
        }
    }

    onArrowDown(event: KeyboardEvent): void {
        if (!this.arrowDown) {
            this.arrowCoord = { x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y + this.imageData.height };
            this.ellipseService.mouseDownCoord = this.startDownCoord;
            this.pathData.push(this.arrowCoord);
            if (this.hasDoneFirstTranslation) {
                this.showSelection(
                    this.drawingService.baseCtx,
                    this.oldImage,
                    { x: this.imageData.width, y: this.imageData.height },
                    this.firstEllipseCoord,
                    1,
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
            this.showSelection(
                this.drawingService.previewCtx,
                this.image,
                { x: this.imageData.width, y: this.imageData.height },
                this.firstEllipseCoord,
            );
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
        console.log('select all canvas');
        this.firstEllipseCoord = { x: 0, y: 0 };
        this.ellipseService.mouseDownCoord = { x: 0, y: 0 };
        this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
        const MOUSE_EVENT = {
            offsetX: this.drawingService.baseCtx.canvas.width,
            offsetY: this.drawingService.baseCtx.canvas.height,
            button: 0,
        } as MouseEvent;
        this.imageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.drawingService.baseCtx.canvas.width,
            this.drawingService.baseCtx.canvas.height,
        );
        this.onMouseUp(MOUSE_EVENT);
    }

    // tslint:disable:no-magic-numbers
    onMouseWheel(event: WheelEvent): void {
        // setting up variable/const
        if (this.selectionCreated) {
            const SIZE = { x: this.imageData.width, y: this.imageData.height };
            const TRANSLATION = { x: this.startDownCoord.x + SIZE.x / 2, y: this.startDownCoord.y + SIZE.y / 2 };
            const MEMORY_COORDS = this.startDownCoord;
            const ORIENTATION = event.deltaY / 100;

            // clearing old spot
            const MAX_SIDE = Math.max(SIZE.x, SIZE.y);
            this.putImageData({ x: TRANSLATION.x - MAX_SIDE / 2, y: TRANSLATION.y - MAX_SIDE / 2 }, this.drawingService.baseCtx, this.oldImageData);
            if (!this.hasDoneFirstTranslation || this.hasDoneResizing) {
                this.ellipseService.mouseDownCoord = this.firstEllipseCoord;
                this.pathLastCoord = { x: MEMORY_COORDS.x + SIZE.x, y: MEMORY_COORDS.y + SIZE.y };
                this.pathData.push(this.pathLastCoord);
                this.clearCanvasEllipse();
                this.clearPath();
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            // calculate desire angle for canvas rotation
            let angleVoulue = 0;
            if (event.altKey) {
                angleVoulue = 1;
            } else {
                angleVoulue = 15;
            }
            this.angle += ORIENTATION * angleVoulue;
            this.rotateCanvas(this.angle);
            this.startDownCoord = { x: -SIZE.x / 2, y: -SIZE.y / 2 };
            this.showSelection(this.drawingService.baseCtx, this.image, SIZE, this.firstEllipseCoord);

            // reset canvas transform after rotation
            this.resetCanvasRotation();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            // draw selection preview
            this.startDownCoord = { x: TRANSLATION.x - MAX_SIDE / 2, y: TRANSLATION.y - MAX_SIDE / 2 };
            this.pathLastCoord = { x: this.startDownCoord.x + MAX_SIDE, y: this.startDownCoord.y + MAX_SIDE };
            this.pathData.push(this.pathLastCoord);
            this.ellipseService.mouseDownCoord = this.startDownCoord;
            this.ellipseService.drawEllipse(this.drawingService.previewCtx, this.pathData);
            this.ellipseService.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
            this.drawnAnchor(this.drawingService.previewCtx, { x: MAX_SIDE, y: MAX_SIDE });
            this.clearPath();
            this.startDownCoord = MEMORY_COORDS;
            this.hasDoneFirstRotation = true;
        }
    }

    private addActionTracking(trackingInfo: Vec2[]): void {
        const IMAGE_DATA_SELECTION = this.drawingService.baseCtx.getImageData(
            trackingInfo[0].x,
            trackingInfo[0].y,
            trackingInfo[1].x - trackingInfo[0].x,
            trackingInfo[1].y - trackingInfo[0].y,
        );
        this.drawingStateTrackingService.addAction(
            this,
            new InteractionSelectionEllipse({ x: trackingInfo[0].x, y: trackingInfo[0].y }, IMAGE_DATA_SELECTION),
        );
    }

    private createOnMouseMoveEvent(): void {
        if (this.localMouseDown) {
            const MOUSE_EVENT = {
                offsetX: this.pathData[this.pathData.length - 1].x,
                offsetY: this.pathData[this.pathData.length - 1].y,
                button: 0,
            } as MouseEvent;
            this.onMouseMove(MOUSE_EVENT);
        }
    }

    private resetTransform(): void {
        this.widthService.setWidth(1);
        this.colorService.setPrimaryColor('#000000');
        this.colorService.setSecondaryColor('#000000');
        this.tracingService.setHasFill(false);
        this.tracingService.setHasContour(true);
    }

    private showSelection(canvas: CanvasRenderingContext2D, image: HTMLImageElement, size: Vec2, imageStart: Vec2, offset: number = 0): void {
        canvas.save();
        const ELLIPSE_PATH = this.getPath(offset, this.startDownCoord);
        canvas.clip(ELLIPSE_PATH);
        this.drawImage(canvas, this.startDownCoord, imageStart, { x: this.imageData.width, y: this.imageData.height }, image, size);
        canvas.restore();
    }

    private clearCanvasEllipse(): void {
        this.colorService.setPrimaryColor('#FFFFFF');
        this.tracingService.setHasFill(true);
        this.tracingService.setHasContour(false);
        this.ellipseService.drawEllipse(this.drawingService.previewCtx, this.pathData);
        this.ellipseService.drawEllipse(this.drawingService.baseCtx, this.pathData);
        this.resetTransform();
    }

    private getImageRotation(): void {
        const MAX_SIDE = Math.max(this.imageData.width, this.imageData.height);
        this.oldImageData = this.drawingService.baseCtx.getImageData(
            this.startDownCoord.x + this.imageData.width / 2 - MAX_SIDE / 2,
            this.startDownCoord.y + this.imageData.height / 2 - MAX_SIDE / 2,
            MAX_SIDE,
            MAX_SIDE,
        );
    }

    execute(interaction: InteractionSelectionEllipse): void {
        this.putImageData(interaction.startSelectionPoint, this.drawingService.baseCtx, interaction.selection);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selectionCreated = false;
    }
}
