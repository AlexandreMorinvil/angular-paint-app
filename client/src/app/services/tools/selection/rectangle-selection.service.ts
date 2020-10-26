import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { SelectionToolService } from '@app/services/tools/selection/selection-tool.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionService extends SelectionToolService {
    mouseDownCoord: Vec2;
    startDownCoord: Vec2;

    constructor(
        drawingService: DrawingService,
        private rectangleService: RectangleService,
        private tracingService: TracingService,
        private colorService: ColorService,
        private widthService: WidthService,
    ) {
        super(drawingService, colorService, new Description('selection rectangle', 'r', 'question_mark.png'));
    }

    onMouseDown(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.mouseDown = event.button === MouseButton.Left;
        this.widthService.setWidth(1);
        this.colorService.setPrimaryColor('#000000');
        this.colorService.setSecondaryColor('#000000');
        this.tracingService.setHasFill(false);
        this.tracingService.setHasContour(true);

        if (this.selectionCreated && this.checkHit(this.mouseDownCoord)) {
            this.getAnchorHit(this.drawingService.previewCtx, this.mouseDownCoord);
        } else if (this.selectionCreated && this.hitSelection(this.mouseDownCoord.x, this.mouseDownCoord.y)) {
            this.draggingImage = true;
            this.putImageData(this.mouseDownCoord, this.drawingService.previewCtx);
            this.drawingService.baseCtx.clearRect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
        } else {
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.imageData = new ImageData(1, 1);
            this.startDownCoord = this.getPositionFromMouse(event);
            this.rectangleService.onMouseDown(event);
            this.pathData.push(this.startDownCoord);
        }
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.draggingImage && this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.putImageData(mousePosition, this.drawingService.previewCtx);
            this.startDownCoord = { x: mousePosition.x - this.imageData.width / 2, y: mousePosition.y - this.imageData.height / 2 };
        } else if (this.clickOnAnchor && this.mouseDown) {
            this.drawingService.baseCtx.clearRect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.getAnchorHit(this.drawingService.previewCtx, mousePosition);
        } else if (this.isInCanvas(mousePosition) && this.mouseDown) {
            this.rectangleService.onMouseMove(event);
            if (this.startDownCoord.x !== mousePosition.x && this.startDownCoord.y !== mousePosition.y) {
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
        if (this.draggingImage) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.putImageData(mousePosition, this.drawingService.baseCtx);
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.rect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
            this.drawingService.previewCtx.stroke();
            this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
            this.draggingImage = false;
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
        } else if (this.clickOnAnchor) {
            this.getAnchorHit(this.drawingService.baseCtx, mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clickOnAnchor = false;
            this.selectionCreated = false;
        } else if (this.mouseDown) {
            this.pathData.push(mousePosition);
            this.rectangleService.drawRectangle(this.drawingService.previewCtx, this.pathData);
            this.drawingService.baseCtx.clearRect(
                this.startDownCoord.x,
                this.startDownCoord.y,
                this.pathData[this.pathData.length - 1].x - this.startDownCoord.x,
                this.pathData[this.pathData.length - 1].y - this.startDownCoord.y,
            );
            this.offsetAnchors();
            this.drawingService.previewCtx.putImageData(this.imageData, this.startDownCoord.x, this.startDownCoord.y);
            this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
            this.selectionCreated = true;
        }
        this.mouseDown = false;
        this.clearPath();
    }
}
