import { Injectable } from '@angular/core';
import { InteractionPath } from '@app/classes/action/interaction-path';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    private pathData: Vec2[];
    private eraserColor: string = '#FFFFFF';
    minWidth: number = 5;
    // tslint:disable:prettier
    constructor(drawingService: DrawingService, private drawingStateTrackingService: DrawingStateTrackerService, private widthService: WidthService) {
        super(drawingService, new Description('efface', 'e', 'erase_icon.png'));
        this.modifiers.push(this.widthService);
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
            this.drawingStateTrackingService.addAction(this, new InteractionPath(this.pathData));
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.eraserVisual(event);
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = Math.max(this.widthService.getWidth(), this.minWidth); // width ajustment
        ctx.strokeStyle = this.eraserColor;
        ctx.fillStyle = this.eraserColor;
        const startingPointAdjustment = 2;
        ctx.fillRect(
            path[0].x - this.widthService.getWidth() / startingPointAdjustment,
            path[0].y - this.widthService.getWidth() / startingPointAdjustment,
            this.widthService.getWidth(),
            this.widthService.getWidth(),
        );
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private eraserVisual(event: MouseEvent): void {
        const mousePosition: Vec2 = { x: event.offsetX, y: event.offsetY };
        if (this.isInCanvas(mousePosition)) {
            const borderColor = '#000000';
            const borderWidth = 1;
            const squareWidth: number = Math.max(this.widthService.getWidth(), this.minWidth);

            this.drawingService.previewCtx.strokeStyle = borderColor;
            this.drawingService.previewCtx.fillStyle = this.eraserColor;
            this.drawingService.previewCtx.lineWidth = borderWidth;

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.previewCtx.strokeRect(
                event.offsetX - squareWidth / 2,
                event.offsetY - squareWidth / 2,
                squareWidth + 1,
                squareWidth + 1,
            );
            this.drawingService.previewCtx.fillRect(
                event.offsetX - squareWidth / 2,
                event.offsetY - squareWidth / 2,
                squareWidth + 1,
                squareWidth + 1,
            );
        } else this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    private clearPath(): void {
        this.pathData = [];
    }

    execute(interaction: InteractionPath): void {
        this.drawLine(this.drawingService.baseCtx, interaction.path);
    }
}
