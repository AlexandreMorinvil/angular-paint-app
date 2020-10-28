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
    private radius: number;

    constructor(
        drawingService: DrawingService,
        private colorService: ColorService,
        private tracingService: TracingService,
        public widthService: WidthService,
        public sidesService: SidesService,
    ) {
        super(drawingService, new Description('polygone', '3', 'polygon_icon.png'));
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
            this.drawPolygon(this.drawingService.previewCtx, this.pathData);
            this.drawPreviewCircle(this.drawingService.previewCtx, this.pathData);
        }
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

    private drawPolygon(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.savedData = [];
        const lastMouseMoveCoord = path[path.length - 1];
        const radius = Math.sqrt(
            Math.pow(this.mouseDownCoord.x - lastMouseMoveCoord.x, 2) + Math.pow(this.mouseDownCoord.y - lastMouseMoveCoord.y, 2),
        );
        this.radius = radius;
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
        ctx.setLineDash([0]);
        this.setAttribute(ctx);
    }

    drawPreviewCircle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        const centerX = this.mouseDownCoord.x;
        const centerY = this.mouseDownCoord.y;
        const numberMinSide = 5;
        const numberSquareSide = 4;
        const numberTriangleSide = 3;
        const halfCircleAngle = 180;
        const circleAngle = 360;
        if (this.tracingService.getHasContour() === true && this.sidesService.getSide() >= numberMinSide) {
            this.radius = this.radius - this.widthService.getWidth() / 2;
            const spaceBetweenTwoPolygon =
                (2 * this.radius * Math.cos((((halfCircleAngle - circleAngle / this.sidesService.getSide()) / 2) * Math.PI) / halfCircleAngle) +
                    (2 * this.widthService.getWidth()) /
                        Math.tan((((halfCircleAngle - circleAngle / this.sidesService.getSide()) / 2) * Math.PI) / halfCircleAngle)) /
                (2 * Math.cos((((halfCircleAngle - circleAngle / this.sidesService.getSide()) / 2) * Math.PI) / halfCircleAngle));
            this.radius = spaceBetweenTwoPolygon;
        } else if (this.tracingService.getHasContour() === true && this.sidesService.getSide() === numberSquareSide) {
            const spaceBetweenTwoSquare = Math.sqrt(Math.pow(this.widthService.getWidth(), 2) + Math.pow(this.widthService.getWidth(), 2));
            this.radius = this.radius - spaceBetweenTwoSquare / 2;
            this.radius = this.radius + spaceBetweenTwoSquare;
        } else if (this.tracingService.getHasContour() === true && this.sidesService.getSide() === numberTriangleSide) {
            this.radius = this.radius - this.widthService.getWidth();
            const spaceBetweenTwoTriangle =
                this.widthService.getWidth() / Math.sin(((halfCircleAngle / numberTriangleSide / 2) * Math.PI) / halfCircleAngle);
            this.radius = this.radius + spaceBetweenTwoTriangle;
        }
        const angleCircle = 2 * Math.PI;
        ctx.arc(centerX, centerY, this.radius, 0, angleCircle);
        const lineDashValue = 6;
        ctx.strokeStyle = 'black';
        ctx.setLineDash([lineDashValue]);
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    private clearPath(): void {
        this.pathData = [];
    }

    private isInCanvas(mousePosition: Vec2): boolean {
        return mousePosition.x <= this.drawingService.baseCtx.canvas.width && mousePosition.y <= this.drawingService.baseCtx.canvas.height;
    }

    private resetBorder(): void {
        this.drawingService.previewCtx.canvas.width = this.drawingService.baseCtx.canvas.width;
        this.drawingService.previewCtx.canvas.height = this.drawingService.baseCtx.canvas.height;
    }
}
