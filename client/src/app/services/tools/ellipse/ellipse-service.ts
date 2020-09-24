import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
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
export class EllipseService extends Tool {
    pathData: Vec2[];
    primaryColor: string;
    secondaryColor: string;

    constructor(drawingService: DrawingService, private tracingService: TracingService, private widthService: WidthService) {
        super(drawingService, new Description('ellipse', '2', 'ellipse_icon.png'));
        this.modifiers.push(this.widthService);
        this.modifiers.push(this.tracingService);
        this.clearPath();
        this.primaryColor = '#ff0000'; // red
        this.secondaryColor = '#000000'; // black
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
        if (event.shiftKey) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawCircle(this.drawingService.baseCtx, this.pathData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        } else if (this.mouseDown && !event.shiftKey) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawEllipse(this.drawingService.baseCtx, this.pathData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }

        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (event.shiftKey && this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawCircle(this.drawingService.previewCtx, this.pathData);
            this.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
        } else if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawEllipse(this.drawingService.previewCtx, this.pathData);
            // Rectangle preview for ellipse
            this.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
        }
    }

    drawEllipse(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        const mouseMoveCoord = path[path.length - 1];

        const centerX = (mouseMoveCoord.x + this.mouseDownCoord.x) / 2;
        const centerY = (mouseMoveCoord.y + this.mouseDownCoord.y) / 2;

        const radiusX = Math.abs(mouseMoveCoord.x - this.mouseDownCoord.x) / 2;
        const radiusY = Math.abs(mouseMoveCoord.y - this.mouseDownCoord.y) / 2;

        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2, false);
        ctx.lineWidth = this.widthService.getWidth();

        this.drawingService.previewCtx.setLineDash([0]); // set line dash to default when drawing Ellipse
        this.applyTrace(ctx);
    }

    drawPreviewRect(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        const mouseMoveCoord = path[path.length - 1];
        const width = mouseMoveCoord.x - this.mouseDownCoord.x;
        const height = mouseMoveCoord.y - this.mouseDownCoord.y;

        ctx.rect(this.mouseDownCoord.x, this.mouseDownCoord.y, width, height);
        ctx.setLineDash([6]); // abitrary number!!!
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    onShiftDown(event: KeyboardEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawCircle(this.drawingService.previewCtx, this.pathData);
    }

    onShiftUp(event: KeyboardEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawEllipse(this.drawingService.previewCtx, this.pathData);
    }

    drawCircle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        const mouseMoveCoord = path[path.length - 1];

        let radius = Math.abs(mouseMoveCoord.y - this.mouseDownCoord.y) / 2;
        const centerY = (mouseMoveCoord.y + this.mouseDownCoord.y) / 2;
        const lengthPreview = Math.abs(mouseMoveCoord.x - this.mouseDownCoord.x);

        if (lengthPreview <= 2 * radius && mouseMoveCoord.x >= this.mouseDownCoord.x) {
            radius = Math.abs(mouseMoveCoord.x - this.mouseDownCoord.x) / 2;
            const centerX = Math.abs(mouseMoveCoord.x + this.mouseDownCoord.x) / 2;
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        } else if (lengthPreview <= 2 * radius && mouseMoveCoord.x <= this.mouseDownCoord.x) {
            radius = Math.abs(mouseMoveCoord.x - this.mouseDownCoord.x) / 2;
            const centerX = Math.abs(mouseMoveCoord.x + this.mouseDownCoord.x) / 2;
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        } else if (lengthPreview >= 2 * radius && mouseMoveCoord.x <= this.mouseDownCoord.x) {
            const centerX = this.mouseDownCoord.x - radius;
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        } else if (lengthPreview >= 2 * radius && mouseMoveCoord.x >= this.mouseDownCoord.x) {
            const centerX = this.mouseDownCoord.x + radius;
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        }

        ctx.lineWidth = this.widthService.getWidth();
        ctx.setLineDash([0]); // set line dash to default when drawing Cercle
        this.applyTrace(ctx);
    }

    applyTrace(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.primaryColor;
        ctx.strokeStyle = this.secondaryColor;
        if (this.tracingService.getHasFill()) ctx.fill();
        if (this.tracingService.getHasContour()) ctx.stroke();
    }

    clearPath(): void {
        this.pathData = [];
    }
}
