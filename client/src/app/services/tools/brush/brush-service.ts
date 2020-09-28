import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TextureEnum, TextureService } from '@app/services/tool-modifier/texture/texture.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
//test
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

    constructor(
        drawingService: DrawingService,
        private colorService: ColorService,
        private textureService: TextureService,
        private widthService: WidthService,
    ) {
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
        const shadowBlur = 5;
        const noShadowBlur = 0;
        const startingPointAdjustment = 2;

        ctx.shadowBlur = shadowBlur;
        // First pixel
        ctx.fillRect(
            path[0].x - this.widthService.getWidth() / startingPointAdjustment,
            path[0].y - this.widthService.getWidth() / startingPointAdjustment,
            this.widthService.getWidth(),
            this.widthService.getWidth(),
        );
        // Drawing of the line
        ctx.beginPath();

        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        ctx.shadowBlur = noShadowBlur;
    }

    private gradientTexture(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // parameters of the line
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.strokeStyle = this.colorService.getPrimaryColor();
        ctx.fillStyle = this.colorService.getPrimaryColor();
        ctx.lineWidth = this.widthService.getWidth();

        // loop parameters
        const normalAlpha = 1;
        const numberOfLines = 4;
        const alphaDecreaseRate = 0.25;
        const aestheticAdjustment = 2;

        // first pixel
        for (let i = 0; i < numberOfLines; i++) {
            ctx.globalAlpha = normalAlpha - alphaDecreaseRate * i;
            ctx.fillRect(path[0].x, path[0].y + this.widthService.getWidth() * i, 1, this.widthService.getWidth() / aestheticAdjustment);
        }

        // drawing of the line
        for (let i = 0; i < numberOfLines; i++) {
            ctx.globalAlpha = normalAlpha - alphaDecreaseRate * i;
            ctx.beginPath();
            for (const point of path) ctx.lineTo(point.x, point.y + this.widthService.getWidth() * i);
            ctx.stroke();
        }
        ctx.globalAlpha = normalAlpha;
    }

    private squareTexture(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // parameters of the line
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.fillStyle = this.colorService.getPrimaryColor();
        const squareWidthAdjustment = 5;
        const squareStartingPointAdjustment = 2;
        // first pixel
        ctx.fillRect(
            path[0].x - this.widthService.getWidth() / squareStartingPointAdjustment,
            path[0].y - this.widthService.getWidth() / squareStartingPointAdjustment,
            this.widthService.getWidth() + squareWidthAdjustment,
            this.widthService.getWidth() + squareWidthAdjustment,
        );
        // Drawing of the squares
        for (const point of path) {
            ctx.fillRect(
                point.x - this.widthService.getWidth() / squareStartingPointAdjustment,
                point.y - this.widthService.getWidth() / squareStartingPointAdjustment,
                this.widthService.getWidth() + squareWidthAdjustment,
                this.widthService.getWidth() + squareWidthAdjustment,
            );
        }
    }

    private dashTexture(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // parameters of the line
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.strokeStyle = this.colorService.getPrimaryColor();
        ctx.fillStyle = this.colorService.getPrimaryColor();
        ctx.lineWidth = this.widthService.getWidth();
        const dashThickness = 4;
        const dashSpace = 16;

        ctx.setLineDash([dashThickness, dashSpace]);
        // first pixel
        ctx.fillRect(path[0].x, path[0].y - ctx.lineWidth / 2, dashThickness, ctx.lineWidth);

        // drawing of the line
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
        const zigzagWidthMultiplier = 2;

        // drawing of the line
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(
                point.x + zigzagWidthMultiplier * this.widthService.getWidth(),
                point.y - zigzagWidthMultiplier * this.widthService.getWidth(),
            );
            ctx.lineTo(
                point.x - zigzagWidthMultiplier * this.widthService.getWidth(),
                point.y + zigzagWidthMultiplier * this.widthService.getWidth(),
            );
        }
        ctx.stroke();
    }
}
