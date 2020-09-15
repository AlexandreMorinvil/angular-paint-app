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
    public pathData: Vec2[];
    public lineWidth: number;
    public primaryColor: string;
    public secondaryColor: string;
    public typeTrace: TypeTrace;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.typeTrace = TypeTrace.Contour;
        this.primaryColor = '#ff0000'; //red
        this.secondaryColor = '#000000'; //black
        this.lineWidth = 1;
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
            this.drawCercle(this.drawingService.baseCtx, this.pathData);
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
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawEllipse(this.drawingService.previewCtx, this.pathData);
            //Rectangle preview for ellipse
            this.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
        }
        if (event.shiftKey && this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawCercle(this.drawingService.previewCtx, this.pathData);
            this.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
        }
    }

    private drawEllipse(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        let mouseMoveCoord = path[path.length - 1];

        let centerX = (mouseMoveCoord.x + this.mouseDownCoord.x) / 2;
        let centerY = (mouseMoveCoord.y + this.mouseDownCoord.y) / 2;

        let radiusX = Math.abs(mouseMoveCoord.x - this.mouseDownCoord.x) / 2;
        let radiusY = Math.abs(mouseMoveCoord.y - this.mouseDownCoord.y) / 2;

        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2, false);
        ctx.lineWidth = this.lineWidth;

        this.drawingService.previewCtx.setLineDash([0]); //set line dash to default when drawing Ellipse
        this.applyTrace(ctx);
    }

    private drawPreviewRect(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        let mouseMoveCoord = path[path.length - 1];
        let width = mouseMoveCoord.x - this.mouseDownCoord.x;
        let height = mouseMoveCoord.y - this.mouseDownCoord.y;

        ctx.rect(this.mouseDownCoord.x, this.mouseDownCoord.y, width, height);
        ctx.setLineDash([6]); //abitrary number!!!
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    private drawCercle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        let mouseMoveCoord = path[path.length - 1];

        let radius = Math.abs(mouseMoveCoord.y - this.mouseDownCoord.y) / 2;
        let centerY = (mouseMoveCoord.y + this.mouseDownCoord.y) / 2;
        let lengthPreview = Math.abs(mouseMoveCoord.x - this.mouseDownCoord.x);

        if (lengthPreview <= 2 * radius && mouseMoveCoord.x >= this.mouseDownCoord.x) {
            let radius = Math.abs(mouseMoveCoord.x - this.mouseDownCoord.x) / 2;
            let centerX = Math.abs(mouseMoveCoord.x + this.mouseDownCoord.x) / 2;
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        }
        if (lengthPreview <= 2 * radius && mouseMoveCoord.x <= this.mouseDownCoord.x) {
            let radius = Math.abs(mouseMoveCoord.x - this.mouseDownCoord.x) / 2;
            let centerX = Math.abs(mouseMoveCoord.x + this.mouseDownCoord.x) / 2;
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        }
        if (lengthPreview >= 2 * radius && mouseMoveCoord.x <= this.mouseDownCoord.x) {
            let centerX = this.mouseDownCoord.x - radius;
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        }
        if (lengthPreview >= 2 * radius && mouseMoveCoord.x >= this.mouseDownCoord.x) {
            let centerX = this.mouseDownCoord.x + radius;
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        }

        ctx.lineWidth = this.lineWidth;
        ctx.setLineDash([0]); //set line dash to default when drawing Cercle
        this.applyTrace(ctx);
    }

    private applyTrace(ctx: CanvasRenderingContext2D): void {
        if (this.typeTrace == TypeTrace.Contour) {
            ctx.strokeStyle = this.secondaryColor;
            ctx.stroke();
        }
        if (this.typeTrace == TypeTrace.Full) {
            ctx.fillStyle = this.primaryColor;
            ctx.fill();
        }
        if (this.typeTrace == TypeTrace.FullContour) {
            ctx.fillStyle = this.primaryColor;
            ctx.strokeStyle = this.secondaryColor;
            ctx.fill();
            ctx.stroke();
        }
    }
    onWidthChange(width: number): void {
        this.lineWidth = width;
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
