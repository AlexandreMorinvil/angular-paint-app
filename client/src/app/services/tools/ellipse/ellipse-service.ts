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
export class EllipseService extends Tool {
    pathData: Vec2[];

    constructor(
        drawingService: DrawingService,
        private drawingStateTrackingService: DrawingStateTrackerService,
        private colorService: ColorService,
        private tracingService: TracingService,
        private widthService: WidthService,
    ) {
        super(drawingService, new Description('ellipse', '2', 'ellipse_icon.png'));
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
        if (this.shiftDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawCircle(this.drawingService.baseCtx, this.pathData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        } else if (this.mouseDown && !this.shiftDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawEllipse(this.drawingService.baseCtx, this.pathData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.drawingStateTrackingService.addAction(this, new InteractionStartEnd(this.mouseDownCoord, this.pathData, this.shiftDown));

        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
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
        if (this.shiftDown && this.mouseDown) {
            this.pathData.push(mousePosition);
            // We draw on the preview canvas and erase it each time the mouse is moved
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawCircle(this.drawingService.previewCtx, this.pathData);
            this.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
        } else if (this.mouseDown) {
            this.pathData.push(mousePosition);
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

        if (this.tracingService.getHasContour()) {
            const contourRadiusX = Math.abs(radiusX - this.widthService.getWidth() / 2);
            const contourRadiusY = Math.abs(radiusY - this.widthService.getWidth() / 2);
            ctx.ellipse(centerX, centerY, contourRadiusX, contourRadiusY, 0, 0, Math.PI * 2, false);
        }
        if (this.tracingService.getHasFill() && !this.tracingService.getHasContour()) {
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2, false);
            ctx.lineWidth = this.widthService.getWidth();
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
        const lineDashValue = 6;
        ctx.rect(startX, startY, width, height);
        ctx.strokeStyle = 'black';
        ctx.setLineDash([lineDashValue]);
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    onShiftDown(): void {
        this.shiftDown = true;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
        this.drawCircle(this.drawingService.previewCtx, this.pathData);
    }

    onShiftUp(): void {
        this.shiftDown = false;
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

        ctx.lineWidth = this.widthService.getWidth();
        ctx.setLineDash([0]); // set line dash to default when drawing Cercle
        this.applyTrace(ctx);
    }

    applyTrace(ctx: CanvasRenderingContext2D): void {
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

    clearPath(): void {
        this.pathData = [];
    }

    private resetBorder(): void {
        this.drawingService.previewCtx.canvas.width = this.drawingService.baseCtx.canvas.width;
        this.drawingService.previewCtx.canvas.height = this.drawingService.baseCtx.canvas.height;
    }

    execute(interaction: InteractionStartEnd): void {
        this.mouseDownCoord = interaction.startPoint;
        if (interaction.shiftDown) this.drawCircle(this.drawingService.baseCtx, interaction.path);
        else this.drawEllipse(this.drawingService.baseCtx, interaction.path);
    }
}
