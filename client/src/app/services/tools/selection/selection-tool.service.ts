import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { RectangleService } from '../rectangle/rectangle-service';

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}
const dotsize = 10;

@Injectable({
    providedIn: 'root',
})
export class SelectionToolService extends Tool {
    mouseDownCoord: Vec2;
    startDownCoord: Vec2;
    imageData: ImageData;
    private pathData: Vec2[];
    selectionCreated: boolean;
    draggingImage: boolean;
    rectWidth: number;
    rectHeight: number;

    constructor(
        drawingService: DrawingService,
        private rectangleService: RectangleService,
        private tracing: TracingService,
        private colorService: ColorService,
    ) {
        super(drawingService, new Description('selection rectangle', 'r', 'question_mark.png'));
        this.mouseDown = false;
        this.clearPath();
        this.selectionCreated = false;
        this.draggingImage = false;
    }

    onMouseDown(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.mouseDown = event.button === MouseButton.Left;
        if (this.selectionCreated && this.hitSelection(this.mouseDownCoord.x, this.mouseDownCoord.y)) {
            this.draggingImage = true;
        } else {
            this.tracing.setHasFill(false);
            this.tracing.setHasContour(true);
            this.colorService.setSecondaryColor('#000000');
            this.startDownCoord = this.getPositionFromMouse(event);
            this.rectangleService.onMouseDown(event);
            this.pathData.push(this.startDownCoord);
        }
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.draggingImage && this.mouseDown) {
            this.drawingService.previewCtx.putImageData(this.imageData, mousePosition.x, mousePosition.y);
            this.startDownCoord = mousePosition;
        } else if (this.isInCanvas(mousePosition) && this.mouseDown) {
            this.rectangleService.onMouseMove(event);
            this.imageData = this.drawingService.baseCtx.getImageData(this.startDownCoord.x, this.startDownCoord.y, mousePosition.x, mousePosition.y);
            this.pathData.push(mousePosition);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.draggingImage) {
            this.drawingService.baseCtx.putImageData(this.imageData, mousePosition.x, mousePosition.y);
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.rect(mousePosition.x, mousePosition.y, this.rectWidth, this.rectHeight);
            this.drawingService.previewCtx.stroke();
            this.draggingImage = false;
        } else if (this.mouseDown) {
            this.pathData.push(mousePosition);
            this.drawingService.previewCtx.putImageData(this.imageData, this.startDownCoord.x, this.startDownCoord.y);
            this.rectangleService.drawRectangle(this.drawingService.previewCtx, this.pathData);
            this.rectWidth = Math.abs(this.startDownCoord.x - this.pathData[this.pathData.length-1].x);
            this.rectHeight = Math.abs(this.startDownCoord.y - this.pathData[this.pathData.length-1].y);
            this.clearZone();
        }
        this.mouseDown = false;
        this.clearPath();
        this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
        this.selectionCreated = true;
    }

    drawnAnchor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        this.colorService.setPrimaryColor('#000000');
        ctx.beginPath();
        // start coner
        ctx.arc(this.startDownCoord.x, this.startDownCoord.y, dotsize, 0, Math.PI * 2, false);
        ctx.closePath();

        // end corner
        ctx.arc(this.startDownCoord.x + this.rectWidth, this.startDownCoord.y + this.rectHeight, dotsize, 0, Math.PI * 2, false);
        ctx.closePath();

        // two other corner
        ctx.arc(this.startDownCoord.x, this.startDownCoord.y + this.rectHeight, dotsize, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.arc(this.startDownCoord.x + this.rectWidth, this.startDownCoord.y, dotsize, 0, Math.PI * 2, false);
        ctx.closePath();

        // four mid anchor
        ctx.arc((this.rectWidth + (this.startDownCoord.x*2)) / 2, this.startDownCoord.y + this.rectHeight, dotsize, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.arc((this.rectWidth + (this.startDownCoord.x*2)) / 2, this.startDownCoord.y, dotsize, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.arc(this.startDownCoord.x, (this.rectHeight + (this.startDownCoord.y*2)) / 2, dotsize, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.arc(this.startDownCoord.x + this.rectWidth, (this.rectHeight + (this.startDownCoord.y*2)) / 2, dotsize, 0, Math.PI * 2, false);
        ctx.closePath();

        ctx.fill();
    }

    private isInCanvas(mousePosition: Vec2): boolean {
        return mousePosition.x <= this.drawingService.baseCtx.canvas.width && mousePosition.y <= this.drawingService.baseCtx.canvas.height;
    }

    private clearPath(): void {
        this.pathData = [];
    }

    private hitSelection(x: number, y: number): boolean {
        let xIn = x > this.startDownCoord.x && x < this.imageData.width + this.startDownCoord.x;
        let yIn = y > this.startDownCoord.y && y < this.imageData.height + this.startDownCoord.y;
        return xIn && yIn;
    }

    private clearZone() {
        this.tracing.setHasFill(true);
        this.colorService.setPrimaryColor('#FFFFFF');
        this.tracing.setHasContour(false);
        this.rectangleService.drawRectangle(this.drawingService.baseCtx, this.pathData);
    }
}
