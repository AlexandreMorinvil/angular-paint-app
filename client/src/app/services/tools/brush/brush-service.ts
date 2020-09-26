import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TextureEnum, TextureService } from '@app/services/tool-modifier/texture/texture.service';
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
export class BrushService extends Tool {
    private pathData: Vec2[];

    constructor(drawingService: DrawingService, private colorService: ColorService, private textureService: TextureService, private widthService: WidthService) {
        super(drawingService, new Description('pinceau', 'w', 'brush_icon.png'));
        this.modifiers.push(this.colorService);
        this.modifiers.push(this.widthService);
        this.modifiers.push(this.textureService);
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
            this.drawLine(this.drawingService.baseCtx, this.pathData);
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
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        switch (this.textureService.getTexture()) {
            case TextureEnum.shadowTexture: {
                this.shadowTexture(ctx, path );
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
            default: {
                break;
            }
        }
    }

    private clearPath(): void {
        this.pathData = [];
    }

    private shadowTexture(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // parameters of the line and the shadow
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.strokeStyle = this.colorService.getPrimaryColor();
        ctx.shadowColor = this.colorService.getPrimaryColor();
        ctx.fillStyle = this.colorService.getPrimaryColor();
        ctx.lineWidth = this.widthService.getWidth();
        ctx.shadowBlur = 5;
        // First pixel
        ctx.fillRect(
            path[0].x - this.widthService.getWidth()/2,
            path[0].y - this.widthService.getWidth()/2,
            this.widthService.getWidth(),
            this.widthService.getWidth()
        );
        // Drawing of the line
        ctx.beginPath();

        for (const point of path) {
           ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    private gradientTexture(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // parameters of the line
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.strokeStyle = this.colorService.getPrimaryColor();
        ctx.fillStyle = this.colorService.getPrimaryColor();
        ctx.lineWidth = this.widthService.getWidth();

        // first pixel
        for (let i = 0; i < 4; i++) {
            ctx.globalAlpha = 1 - 0.25 * i;
            ctx.fillRect(
                path[0].x,
                path[0].y + this.widthService.getWidth() * i,
                1,
                this.widthService.getWidth()/2);
        }

        // drawing of the line
        for (let i = 0; i < 4; i++) {
            ctx.globalAlpha = 1 - 0.25 * i;
            ctx.beginPath();
            for (const point of path) ctx.lineTo(point.x, point.y + this.widthService.getWidth() * i);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }

    private squareTexture(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // parameters of the line
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.fillStyle = this.colorService.getPrimaryColor();
        // first pixel
        ctx.fillRect(
          path[0].x - this.widthService.getWidth()/2,
          path[0].y - this.widthService.getWidth()/2,
          this.widthService.getWidth() + 5,
          this.widthService.getWidth() + 5
        );
        // Drawing of the squares
        for (const point of path) {
            ctx.fillRect(
              point.x - this.widthService.getWidth()/2,
              point.y - this.widthService.getWidth()/2,
              this.widthService.getWidth() + 5,
              this.widthService.getWidth() + 5
            );
        }
    }

    private dashTexture(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // parameters of the line
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.strokeStyle = this.colorService.getPrimaryColor();
        ctx.fillStyle = this.colorService.getPrimaryColor();
        ctx.shadowColor = this.colorService.getPrimaryColor();
        ctx.lineWidth = this.widthService.getWidth();

        let dashThickness: number = 4;
        ctx.setLineDash([dashThickness, 16]);
        // first pixel
        ctx.fillRect(
          path[0].x,
          path[0].y - ctx.lineWidth/2,
          dashThickness,
          ctx.lineWidth,
        );


        // Drawing of the squares
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }

    private zigzagTexture(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // parameters of the line
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.strokeStyle = this.colorService.getPrimaryColor();
        ctx.lineWidth = this.widthService.getWidth();

        // Drawing of the line
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x + 2 * this.widthService.getWidth(), point.y - 2 * this.widthService.getWidth());
            ctx.lineTo(point.x - 2 * this.widthService.getWidth(), point.y + 2 * this.widthService.getWidth());
        }
        ctx.stroke();
    }
}
