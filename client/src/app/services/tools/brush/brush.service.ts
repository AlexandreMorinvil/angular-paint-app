import { Injectable } from '@angular/core';
import { InteractionPath } from '@app/classes/action/interaction-path';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TextureEnum, TextureService } from '@app/services/tool-modifier/texture/texture.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';

@Injectable({
    providedIn: 'root',
})
export class BrushService extends Tool {
    private pathData: Vec2[];

    constructor(
        drawingService: DrawingService,
        private drawingStateTrackingService: DrawingStateTrackerService,
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
        if (!this.mouseDown) {
            return;
        }
        this.clearPath();
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.pathData.push(this.mouseDownCoord);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
            this.drawingStateTrackingService.addAction(this, new InteractionPath(this.pathData));
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.mouseDown) {
            return;
        }
        const mousePosition = this.getPositionFromMouse(event);
        this.pathData.push(mousePosition);

        // We draw on the preview canvas and erase it each time the mouse is moved
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawLine(this.drawingService.previewCtx, this.pathData);
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
        const SHADOW_BLUR = 5;
        const NO_SHADOW_BLUR = 0;
        const STARTING_POINT_ADJUSTMENT = 2;

        ctx.shadowBlur = SHADOW_BLUR;
        // First pixel
        ctx.fillRect(
            path[0].x - this.widthService.getWidth() / STARTING_POINT_ADJUSTMENT,
            path[0].y - this.widthService.getWidth() / STARTING_POINT_ADJUSTMENT,
            this.widthService.getWidth(),
            this.widthService.getWidth(),
        );
        // Drawing of the line
        ctx.beginPath();

        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        ctx.shadowBlur = NO_SHADOW_BLUR;
    }

    private gradientTexture(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // parameters of the line
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.strokeStyle = this.colorService.getPrimaryColor();
        ctx.fillStyle = this.colorService.getPrimaryColor();
        ctx.lineWidth = this.widthService.getWidth();

        // loop parameters
        const NORMAL_ALPHA = 1;
        const NUMBER_OF_LINES = 4;
        const ALPHA_DECREASE_RATE = 0.25;
        const AESTHETIC_ADJUSTMENT = 2;

        // first pixel
        for (let i = 0; i < NUMBER_OF_LINES; i++) {
            ctx.globalAlpha = this.colorService.getPrimaryColorOpacity() * (NORMAL_ALPHA - ALPHA_DECREASE_RATE * i);
            ctx.fillRect(path[0].x, path[0].y + this.widthService.getWidth() * i, 1, this.widthService.getWidth() / AESTHETIC_ADJUSTMENT);
        }

        // drawing of the line
        for (let i = 0; i < NUMBER_OF_LINES; i++) {
            ctx.globalAlpha = this.colorService.getPrimaryColorOpacity() * (NORMAL_ALPHA - ALPHA_DECREASE_RATE * i);
            ctx.beginPath();
            for (const point of path) ctx.lineTo(point.x, point.y + this.widthService.getWidth() * i);
            ctx.stroke();
        }
        ctx.globalAlpha = NORMAL_ALPHA;
    }

    private squareTexture(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // parameters of the line
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.fillStyle = this.colorService.getPrimaryColor();
        const SQUARE_WIDTH_ADJUSTMENT = 5;
        const SQUARE_STARTING_POINT_ADJUSTMENT = 2;
        // first pixel
        ctx.fillRect(
            path[0].x - this.widthService.getWidth() / SQUARE_STARTING_POINT_ADJUSTMENT,
            path[0].y - this.widthService.getWidth() / SQUARE_STARTING_POINT_ADJUSTMENT,
            this.widthService.getWidth() + SQUARE_WIDTH_ADJUSTMENT,
            this.widthService.getWidth() + SQUARE_WIDTH_ADJUSTMENT,
        );
        // Drawing of the squares
        for (const point of path) {
            ctx.fillRect(
                point.x - this.widthService.getWidth() / SQUARE_STARTING_POINT_ADJUSTMENT,
                point.y - this.widthService.getWidth() / SQUARE_STARTING_POINT_ADJUSTMENT,
                this.widthService.getWidth() + SQUARE_WIDTH_ADJUSTMENT,
                this.widthService.getWidth() + SQUARE_WIDTH_ADJUSTMENT,
            );
        }
    }

    private dashTexture(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        // parameters of the line
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.strokeStyle = this.colorService.getPrimaryColor();
        ctx.fillStyle = this.colorService.getPrimaryColor();
        ctx.lineWidth = this.widthService.getWidth();
        const DASH_THICKNESS = 4;
        const DASH_SPACE = 16;

        ctx.setLineDash([DASH_THICKNESS, DASH_SPACE]);
        // first pixel
        ctx.fillRect(path[0].x, path[0].y - ctx.lineWidth / 2, DASH_THICKNESS, ctx.lineWidth);

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
        const ZIGZAG_WIDTH_MULTIPLIER = 2;

        // drawing of the line
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(
                point.x + ZIGZAG_WIDTH_MULTIPLIER * this.widthService.getWidth(),
                point.y - ZIGZAG_WIDTH_MULTIPLIER * this.widthService.getWidth(),
            );
            ctx.lineTo(
                point.x - ZIGZAG_WIDTH_MULTIPLIER * this.widthService.getWidth(),
                point.y + ZIGZAG_WIDTH_MULTIPLIER * this.widthService.getWidth(),
            );
        }
        ctx.stroke();
    }

    execute(interaction: InteractionPath): void {
        this.drawLine(this.drawingService.baseCtx, interaction.path);
    }
}
