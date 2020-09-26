import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}
export enum TypeTrace {
    Contour = 'contour',
    Full = 'full',
    FullContour = 'fullContour',
}

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Tool {
    pathData: Vec2[];
    lineWidth: number;
    primaryColor: string;
    secondaryColor: string;
    typeTrace: TypeTrace;

    constructor(drawingService: DrawingService) {
        super(drawingService, 'ellipse', '2');
        this.clearPath();
        this.typeTrace = TypeTrace.FullContour;
        this.primaryColor = '#ff0000'; // red
        this.secondaryColor = '#00000'; // vert
        this.lineWidth = 20;
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
        ctx.lineWidth = this.lineWidth;

        const mouseMoveCoord = path[path.length - 1];
        const centerX = (mouseMoveCoord.x + this.mouseDownCoord.x) / 2;
        const centerY = (mouseMoveCoord.y + this.mouseDownCoord.y) / 2;

        if (this.typeTrace === (TypeTrace.FullContour || TypeTrace.Contour)) {
            const radiusX = Math.abs(Math.abs(mouseMoveCoord.x - this.mouseDownCoord.x) / 2 - this.lineWidth / 2);
            const radiusY = Math.abs(Math.abs(mouseMoveCoord.y - this.mouseDownCoord.y) / 2 - this.lineWidth / 2);
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2, false);
        } else if (this.typeTrace === TypeTrace.Full) {
            const radiusX = Math.abs(mouseMoveCoord.x - this.mouseDownCoord.x) / 2;
            const radiusY = Math.abs(mouseMoveCoord.y - this.mouseDownCoord.y) / 2;
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2, false);
        }
        this.drawingService.previewCtx.setLineDash([0]); // set line dash to default when drawing Ellipse
        this.applyTrace(ctx);
    }

    drawPreviewRect(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();

        const mouseMoveCoord = path[path.length - 1];
        const width = mouseMoveCoord.x - this.mouseDownCoord.x;
        const height = mouseMoveCoord.y - this.mouseDownCoord.y;
        const startX = this.mouseDownCoord.x;
        const startY = this.mouseDownCoord.y;

        ctx.rect(startX, startY, width, height);
        ctx.setLineDash([6]); // abitrary number!!!
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    onShiftDown(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
        this.drawCircle(this.drawingService.previewCtx, this.pathData);
    }

    onShiftUp(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
        this.drawEllipse(this.drawingService.previewCtx, this.pathData);
    }

    drawCircle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();

        const mouseMoveCoord = path[path.length - 1];
        const radius = Math.abs(mouseMoveCoord.y - this.mouseDownCoord.y) / 2;
        const centerY = (mouseMoveCoord.y + this.mouseDownCoord.y) / 2;
        const lengthPreview = Math.abs(mouseMoveCoord.x - this.mouseDownCoord.x);

        if (lengthPreview <= 2 * radius && mouseMoveCoord.x >= this.mouseDownCoord.x) {
            const radiusX = Math.abs(mouseMoveCoord.x - this.mouseDownCoord.x) / 2;
            const centerX = Math.abs(mouseMoveCoord.x + this.mouseDownCoord.x) / 2;
            ctx.arc(centerX, centerY, radiusX, 0, 2 * Math.PI);
        } else if (lengthPreview <= 2 * radius && mouseMoveCoord.x <= this.mouseDownCoord.x) {
            const radiusX = Math.abs(mouseMoveCoord.x - this.mouseDownCoord.x) / 2;
            const centerX = Math.abs(mouseMoveCoord.x + this.mouseDownCoord.x) / 2;
            ctx.arc(centerX, centerY, radiusX, 0, 2 * Math.PI);
        } else if (lengthPreview >= 2 * radius && mouseMoveCoord.x <= this.mouseDownCoord.x) {
            const centerX = this.mouseDownCoord.x - radius;
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        } else if (lengthPreview >= 2 * radius && mouseMoveCoord.x >= this.mouseDownCoord.x) {
            const centerX = this.mouseDownCoord.x + radius;
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        }

        ctx.lineWidth = this.lineWidth;
        ctx.setLineDash([0]); // set line dash to default when drawing Cercle
        this.applyTrace(ctx);
    }

    applyTrace(ctx: CanvasRenderingContext2D): void {
        switch (this.typeTrace) {
            case 'contour':
                ctx.strokeStyle = this.secondaryColor;
                ctx.stroke();
                break;
            case 'full':
                ctx.fillStyle = this.primaryColor;
                ctx.fill();
                break;

            case 'fullContour':
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = this.primaryColor;
                ctx.strokeStyle = this.secondaryColor;
                ctx.stroke();
                ctx.fill();
                break;
        }
    }

    clearPath(): void {
        this.pathData = [];
    }
}
