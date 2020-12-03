import { Injectable } from '@angular/core';
import { InteractionStartEnd } from '@app/classes/action/interaction-start-end';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    private pathData: Vec2[];

    constructor(
        public drawingService: DrawingService,
        private drawingStateTrackingService: DrawingStateTrackerService,
        private colorService: ColorService,
        private tracingService: TracingService,
        private widthService: WidthService,
    ) {
        super(drawingService, new Description('rectangle', '1', 'rectangle_icon.png'));
        this.modifiers.push(this.colorService);
        this.modifiers.push(this.widthService);
        this.modifiers.push(this.tracingService);
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
            this.drawRectangle(this.drawingService.baseCtx, this.pathData);
            this.drawingStateTrackingService.addAction(this, new InteractionStartEnd(this.mouseDownCoord, this.pathData, this.shiftDown));
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            //this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (!this.isInCanvas(mousePosition) && this.mouseDown) {
                if (mousePosition.x >= this.drawingService.baseCtx.canvas.width) {
                    this.drawingService.previewCtx.canvas.width = mousePosition.x;
                }
                if (mousePosition.y >= this.drawingService.baseCtx.canvas.height) {
                    this.drawingService.previewCtx.canvas.height = mousePosition.y;
                }
                this.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
            } else {
                this.resetBorder();
                this.drawRectangle(this.drawingService.previewCtx, this.pathData);
                this.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
            }
        }
    }

    onShiftDown(event: KeyboardEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.shiftDown = true;
        this.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
        this.drawRectangle(this.drawingService.previewCtx, this.pathData);
    }

    onShiftUp(event: KeyboardEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.shiftDown = false;
        this.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
        this.drawRectangle(this.drawingService.previewCtx, this.pathData);
    }

    drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        const lastMouseMoveCoord = path[path.length - 1];
        const mouseDownCoordX = this.mouseDownCoord.x;
        const mouseDownCoordY = this.mouseDownCoord.y;
        let width = lastMouseMoveCoord.x - this.mouseDownCoord.x;
        let height = lastMouseMoveCoord.y - this.mouseDownCoord.y;
        if (this.shiftDown) {
            // If Shift is pressed should be a square
            const squareSide = Math.abs(Math.min(height, width));
            if (height < 0 && width >= 0) {
                height = -squareSide;
                width = squareSide;
            } else if (height >= 0 && width < 0) {
                width = -squareSide;
                height = squareSide;
            } else if (height < 0 && width < 0) {
                width = -squareSide;
                height = -squareSide;
            } else {
                width = squareSide;
                height = squareSide;
            }
        }
        ctx.rect(mouseDownCoordX, mouseDownCoordY, width, height);
        ctx.setLineDash([0]);
        this.setAttribute(ctx);
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

    drawPreviewRect(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        const mouseMoveCoord = path[path.length - 1];
        let width = mouseMoveCoord.x - this.mouseDownCoord.x;
        let height = mouseMoveCoord.y - this.mouseDownCoord.y;
        let startX = this.mouseDownCoord.x;
        let startY = this.mouseDownCoord.y;
        if (this.shiftDown) {
            const squareSide = Math.abs(Math.min(height, width));
            if (height < 0 && width >= 0) {
                height = -squareSide;
                width = squareSide;
            } else if (height >= 0 && width < 0) {
                width = -squareSide;
                height = squareSide;
            } else if (height < 0 && width < 0) {
                width = -squareSide;
                height = -squareSide;
            } else {
                width = squareSide;
                height = squareSide;
            }
        }
        if (this.widthService.getWidth() > 1) {
            if (width >= 0 && height >= 0) {
                width += this.widthService.getWidth();
                height += this.widthService.getWidth();
                startX -= this.widthService.getWidth() / 2;
                startY -= this.widthService.getWidth() / 2;
            } else if (width >= 0 && height < 0) {
                width += this.widthService.getWidth();
                height -= this.widthService.getWidth();
                startX -= this.widthService.getWidth() / 2;
                startY += this.widthService.getWidth() / 2;
            } else if (width < 0 && height >= 0) {
                width -= this.widthService.getWidth();
                height += this.widthService.getWidth();
                startX += this.widthService.getWidth() / 2;
                startY -= this.widthService.getWidth() / 2;
            } else {
                width -= this.widthService.getWidth();
                height -= this.widthService.getWidth();
                startX += this.widthService.getWidth() / 2;
                startY += this.widthService.getWidth() / 2;
            }
        }
        ctx.rect(startX, startY, width, height);
        const lineDash = 6;
        ctx.setLineDash([lineDash]);
        // tslint:disable:no-magic-numbers
        ctx.strokeStyle = 'black';
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

    execute(interaction: InteractionStartEnd): void {
        this.mouseDownCoord = interaction.startPoint;
        this.shiftDown = interaction.shiftDown;
        this.drawRectangle(this.drawingService.baseCtx, interaction.path);
    }
}
