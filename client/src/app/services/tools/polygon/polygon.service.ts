import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { SidesService } from '@app/services/tool-modifier/sides/sides.service';
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
export class PolygonService extends Tool {
    private pathData: Vec2[];
    private savedData: Vec2[];
    private angle: number;

    constructor(
        drawingService: DrawingService,
        private colorService: ColorService,
        private tracingService: TracingService,
        public widthService: WidthService,
        public sidesService: SidesService,
    ) {
        super(drawingService, new Description('Polygone', '3', 'polygon_icon.png'));
        this.modifiers.push(this.colorService);
        this.modifiers.push(this.widthService);
        this.modifiers.push(this.tracingService);
        this.modifiers.push(this.sidesService);
        this.angle = Math.PI / (this.sidesService.getSide() - 2);
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
        this.resetBorder();
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawPolygon(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (!this.isInCanvas(mousePosition) && this.mouseDown) {
                if (mousePosition.x >= this.drawingService.baseCtx.canvas.width) {
                    this.drawingService.previewCtx.canvas.width = mousePosition.x;
                }
                if (mousePosition.y >= this.drawingService.baseCtx.canvas.height) {
                    this.drawingService.previewCtx.canvas.height = mousePosition.y;
                }
            } else {
                this.resetBorder();
            }
            this.drawPreviewCircle(this.drawingService.previewCtx, this.pathData);
            this.drawPolygon(this.drawingService.previewCtx, this.pathData);
        }
    }

    private setAttribute(ctx: CanvasRenderingContext2D): void {
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

    private drawPolygon(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.savedData = [];
        const lastMouseMoveCoord = path[path.length - 1];
        const radius = Math.sqrt(
            Math.pow(this.mouseDownCoord.x - lastMouseMoveCoord.x, 2) + Math.pow(this.mouseDownCoord.y - lastMouseMoveCoord.y, 2),
        );
        for (let i = 0; i < this.sidesService.getSide(); i++) {
            this.savedData.push({
                x: this.mouseDownCoord.x + radius * Math.cos(this.angle),
                y: this.mouseDownCoord.y - radius * Math.sin(this.angle),
            });
            this.angle += (2 * Math.PI) / this.sidesService.getSide();
        }
        this.drawingService.previewCtx.setLineDash([0]);
        ctx.beginPath();
        ctx.moveTo(this.savedData[0].x, this.savedData[0].y);
        for (let k = 1; k < this.sidesService.getSide(); k++) {
            ctx.lineTo(this.savedData[k].x, this.savedData[k].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.setLineDash([0]);
        this.setAttribute(ctx);
    }

    drawPreviewCircle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        const mouseMoveCoord = path[path.length - 1];
        let radius = Math.sqrt(Math.pow(this.mouseDownCoord.x - mouseMoveCoord.x, 2) + Math.pow(this.mouseDownCoord.y - mouseMoveCoord.y, 2));
        const centerX = this.mouseDownCoord.x;
        const centerY = this.mouseDownCoord.y;
        if (this.widthService.getWidth() > 1) {
            radius = radius + this.widthService.getWidth() - 1; /* -1 car le minimum est 1 pixel pk on px pas zero*/
        }
        ctx.arc(centerX, centerY, radius, 0, this.angle);
        const lineDashValue = 6;
        ctx.strokeStyle = 'black';
        ctx.setLineDash([lineDashValue]);
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    private clearPath(): void {
        this.pathData = [];
    }
    
    private resetBorder(): void {
        this.drawingService.previewCtx.canvas.width = this.drawingService.baseCtx.canvas.width;
        this.drawingService.previewCtx.canvas.height = this.drawingService.baseCtx.canvas.height;
    }
}
