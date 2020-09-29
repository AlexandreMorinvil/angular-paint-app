import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    private pathData: Vec2[];

    constructor(
        drawingService: DrawingService,
        private colorService: ColorService,
        private tracingService: TracingService,
        private widthService: WidthService,
    ) {
        super(drawingService, new Description('rectangle', '1', 'rectangle_icon.png'));
        this.modifiers.push(this.colorService);
        this.modifiers.push(this.widthService);
        this.modifiers.push(this.tracingService);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawRectangle(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawRectangle(this.drawingService.previewCtx, this.pathData);
        }
    }

    onShiftDown(event: KeyboardEvent): void {
        this.shiftDown = true;
        this.drawRectangle(this.drawingService.previewCtx, this.pathData);
    }

    onShiftUp(event: KeyboardEvent): void {
        this.shiftDown = false;
        this.drawRectangle(this.drawingService.previewCtx, this.pathData);
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        const lastMouseMoveCoord = path[path.length - 1];
        let width = lastMouseMoveCoord.x - this.mouseDownCoord.x;
        let height = lastMouseMoveCoord.y - this.mouseDownCoord.y;
        if (this.shiftDown) {
            const squareSide = Math.abs(Math.min(height, width));
            if (height < 0 && width >= 0) {
                height = -squareSide;
                width = squareSide;
            } else if (height >= 0 && width < 0) {
                width = -squareSide;
                height = squareSide;
            } else if (height < 0 && width < 0) {
                width = -squareSide;
                height = -squareSide;
            } else {
                width = squareSide;
                height = squareSide;
            }
        }
        ctx.rect(this.mouseDownCoord.x, this.mouseDownCoord.y, width, height);
        this.setAttribute(ctx);
        ctx.setLineDash([0]);
    }

    setAttribute(ctx: CanvasRenderingContext2D): void {
        ctx.lineWidth = this.widthService.getWidth();
        ctx.fillStyle = this.colorService.getPrimaryColor();
        ctx.strokeStyle = this.colorService.getSecondaryColor();
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        if (this.tracingService.getHasFill()) {
            ctx.fill();
        }
        ctx.globalAlpha = this.colorService.getSecondaryColorOpacity();
        if (this.tracingService.getHasContour()) {
            ctx.stroke();
        }
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
