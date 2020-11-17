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
            this.showSelection(
                this.drawingService.previewCtx,
                this.image,
                { x: this.imageData.width, y: this.imageData.height },
                this.firstEllipseCoord,
            );
            this.startDownCoord = this.evenImageStartCoord(this.mouseDownCoord);
            this.mouseDown = true;
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
        }
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        // translate
        if (this.draggingImage && this.localMouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.firstEllipseCoord = this.offsetAnchors(this.firstEllipseCoord);
            this.showSelection(
                this.drawingService.previewCtx,
                this.image,
                { x: this.imageData.width, y: this.imageData.height },
                this.firstEllipseCoord,
            );
            this.startDownCoord = this.evenImageStartCoord(mousePosition);
            this.pathLastCoord = { x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y + this.imageData.height };
            // resizing
        } else if (this.clickOnAnchor && this.mouseDown) {
            this.pathData.push({ x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y + this.imageData.height });
            this.clearCanvasEllipse();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.getAnchorHit(this.drawingService.previewCtx, mousePosition, 1);
            // creation
        } else if (this.isInCanvas(mousePosition) && this.localMouseDown) {
            this.ellipseService.onMouseMove(event);
            if (this.startDownCoord.x !== mousePosition.x && this.startDownCoord.y !== mousePosition.y && this.ellipseService.shiftDown) {
                const square = this.getSquaredSize(mousePosition);
                this.imageData = this.drawingService.baseCtx.getImageData(this.startDownCoord.x, this.startDownCoord.y, square.x, square.y);
            } else if (this.startDownCoord.x !== mousePosition.x && this.startDownCoord.y !== mousePosition.y && !this.ellipseService.shiftDown) {
                this.imageData = this.drawingService.baseCtx.getImageData(
                    this.startDownCoord.x,
                    this.startDownCoord.y,
                    mousePosition.x - this.startDownCoord.x,
                    mousePosition.y - this.startDownCoord.y,
                );
            }
            this.pathData.push(mousePosition);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        // translate
        if (this.draggingImage) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.oldImage.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.ellipseService.mouseDownCoord = this.startDownCoord;
            this.pathData.push(this.pathLastCoord);
            this.showSelection(
                this.drawingService.baseCtx,
                this.image,
                { x: this.imageData.width, y: this.imageData.height },
                this.firstEllipseCoord,
            );
            const trackingInfo = this.getActionTrackingInfo(this.startDownCoord);
            this.addActionTracking(trackingInfo);
            this.ellipseService.drawEllipse(this.drawingService.previewCtx, this.pathData);
            this.ellipseService.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
            this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
            this.draggingImage = false;
            this.firstEllipseCoord = this.startDownCoord;
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.hasDoneFirstTranslation = true;
            // resizing
        } else if (this.clickOnAnchor) {
            this.getAnchorHit(this.drawingService.baseCtx, mousePosition, 1);
            this.imageData = this.getOldImageData(this.evenImageStartCoord(mousePosition));
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clickOnAnchor = false;
            this.selectionCreated = false;
            const trackingInfo = this.getActionTrackingInfo(mousePosition);
            this.addActionTracking(trackingInfo);
            // creation
        } else if (this.mouseDown) {
            if (this.ellipseService.shiftDown) {
                const square = this.getSquaredSize(mousePosition);
                this.pathData.push({ x: square.x + this.startDownCoord.x, y: square.y + this.startDownCoord.y });
            } else {
                this.pathData.push(mousePosition);
            }
            this.oldImage.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.ellipseService.drawEllipse(this.drawingService.previewCtx, this.pathData);
            this.startDownCoord = this.offsetAnchors(this.startDownCoord);
            this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
            this.selectionCreated = true;
            this.pathLastCoord = this.pathData[this.pathData.length - 1];
            this.showSelection(
                this.drawingService.previewCtx,
                this.image,
                { x: this.imageData.width, y: this.imageData.height },
                this.firstEllipseCoord,
            );
            this.hasDoneFirstTranslation = false;
        }
        this.localMouseDown = false;
        this.clearPath();
    }

    onShiftDown(event: KeyboardEvent): void {
        if (!event.ctrlKey) {
            this.shiftDown = true;
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
        const mouseEvent = {
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
        this.onMouseUp(mouseEvent);
    }

    private addActionTracking(trackingInfo: Vec2[]): void {
        const imageDataSelection = this.drawingService.baseCtx.getImageData(
            trackingInfo[0].x,
            trackingInfo[0].y,
            trackingInfo[1].x - trackingInfo[0].x,
            trackingInfo[1].y - trackingInfo[0].y,
        );
        this.drawingStateTrackingService.addAction(
            this,
            new InteractionSelectionEllipse({ x: trackingInfo[0].x, y: trackingInfo[0].y }, imageDataSelection),
        );
    }

    private createOnMouseMoveEvent(): void {
        if (this.mouseDown) {
            const mouseEvent = {
                offsetX: this.pathData[this.pathData.length - 1].x,
                offsetY: this.pathData[this.pathData.length - 1].y,
                button: 0,
            } as MouseEvent;
            this.onMouseMove(mouseEvent);
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
        const ellipsePath = this.getPath(offset, this.startDownCoord);
        canvas.clip(ellipsePath);
        this.drawImage(
            canvas,
            this.startDownCoord,
            imageStart,
            {
                x: this.imageData.width,
                y: this.imageData.height,
            },
            image,
            size,
        );
        canvas.restore();
    }
    private clearCanvasEllipse(): void {
        this.ellipseService.drawEllipse(this.drawingService.previewCtx, this.pathData);
        this.colorService.setPrimaryColor('#FFFFFF');
        this.tracingService.setHasFill(true);
        this.tracingService.setHasContour(false);
        this.ellipseService.drawEllipse(this.drawingService.baseCtx, this.pathData);
        this.resetTransform();
    }
    execute(interaction: InteractionSelectionEllipse): void {
        this.putImageData(interaction.startSelectionPoint, this.drawingService.baseCtx, interaction.selection);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
