import { DrawingService } from '@app/services/drawing/drawing.service';
import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}
export enum TextureEnum {
    shadowTexture = 0,
    gradientTexture = 1,
    squareTexture = 2,
    dashTexture = 3,
    zigzagTexture = 4,
}
@Injectable({
    providedIn: 'root',
})
export class BrushService extends Tool {
    private pathData: Vec2[];
    private texture: TextureEnum = TextureEnum.shadowTexture;
    private lineWidth: number = 1;
    private color: string = '#000000';

    constructor(drawingService: DrawingService) {
        super(drawingService, 'pinceau', 'w');
        this.clearPath();
    }

    getLineWidth(): number {
        return this.lineWidth;
    }

    getColor(): string {
        return this.color;
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
            this.drawLine(this.drawingService.baseCtx, this.pathData);
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
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onWidthChange(width: number): void {
        this.lineWidth = width;
    }

    onColorChange(color: string): void {
        this.color = color;
    }

    onTextureChange(texture: TextureEnum): void {
        this.texture = texture;
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        switch (+this.texture) {
            case TextureEnum.shadowTexture: {
                this.shadowTexture(ctx, path);
                break;
            }
            case TextureEnum.gradientTexture: {
                this.gradientTexture(ctx, path);
                break;
            }
            case TextureEnum.squareTexture: {
                this.squareTexture(ctx, path);
                break;
            }
            case TextureEnum.dashTexture: {
                this.dashTexture(ctx, path);
                break;
            }
            case TextureEnum.zigzagTexture: {
                this.zigzagTexture(ctx, path);
                break;
            }
        }
    }

    private clearPath(): void {
        this.pathData = [];
    }

    private shadowTexture(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // Parameters of the line and the shadow
        ctx.strokeStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = this.lineWidth;

        ctx.shadowBlur = 5;
        // First pixel
        ctx.fillRect(path[0].x, path[0].y, this.lineWidth, this.lineWidth);
        // Drawing of the line
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    private gradientTexture(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // Parameters of the line
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = this.lineWidth;

        // first pixel
        for (let i = 0; i < 4; i++) {
            ctx.globalAlpha = 1 - 0.25 * i;
            ctx.fillRect(path[0].x, path[0].y + this.lineWidth * i, 1, this.lineWidth / 2);
        }

        // Drawing of the line
        for (let i = 0; i < 4; i++) {
            ctx.globalAlpha = 1 - 0.25 * i;
            ctx.beginPath();
            for (const point of path)
             ctx.lineTo(point.x, point.y + this.lineWidth * i);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    private squareTexture(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // Parameters of the line
        ctx.fillStyle = this.color;
        // First pixel
        ctx.fillRect(path[0].x, path[0].y, this.lineWidth + 5, this.lineWidth + 5);
        // Drawing of the squares
        for (const point of path) {
            ctx.fillRect(point.x, point.y, this.lineWidth + 5, this.lineWidth + 5);
        }
    }

    private dashTexture(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // Parameters of the line
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.setLineDash([4, 16]);
        // First pixel
        ctx.fillRect(path[0].x, path[0].y, this.lineWidth, 1);
        // Drawing of the squares
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }

    private zigzagTexture(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // Parameters of the line
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        // First pixel
        ctx.lineTo(path[0].x - this.lineWidth, path[0].y - this.lineWidth);
        ctx.lineTo(path[0].x + this.lineWidth, path[0].y + this.lineWidth);
        // Drawing of the line
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x + 2 * this.lineWidth, point.y - 2 * this.lineWidth);
            ctx.lineTo(point.x - 2 * this.lineWidth, point.y + 2 * this.lineWidth);
        }
        ctx.stroke();
    }
}
