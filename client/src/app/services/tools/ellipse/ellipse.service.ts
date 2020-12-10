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
    private pathData: Vec2[];

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
        const MOUSE_MOVE_COORD = path[path.length - 1];
        const CENTER_X = (MOUSE_MOVE_COORD.x + this.mouseDownCoord.x) / 2;
        const CENTER_Y = (MOUSE_MOVE_COORD.y + this.mouseDownCoord.y) / 2;

        const RADIUS_X = Math.abs(MOUSE_MOVE_COORD.x - this.mouseDownCoord.x) / 2;
        const RADIUS_Y = Math.abs(MOUSE_MOVE_COORD.y - this.mouseDownCoord.y) / 2;

        if (this.tracingService.getHasContour()) {
            const CONTOUR_RADIUS_X = Math.abs(RADIUS_X - this.widthService.getWidth() / 2);
            const CONTOUR_RADIUS_Y = Math.abs(RADIUS_Y - this.widthService.getWidth() / 2);
            ctx.ellipse(CENTER_X, CENTER_Y, CONTOUR_RADIUS_X, CONTOUR_RADIUS_Y, 0, 0, Math.PI * 2, false);
        }
        if (this.tracingService.getHasFill() && !this.tracingService.getHasContour()) {
            ctx.ellipse(CENTER_X, CENTER_Y, RADIUS_X, RADIUS_Y, 0, 0, Math.PI * 2, false);
            ctx.lineWidth = this.widthService.getWidth();
        }
        this.drawingService.previewCtx.setLineDash([0]); // set line dash to default when drawing Ellipse
        this.applyTrace(ctx);
    }

    drawPreviewRect(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        const MOUSE_MOVE_COORD = path[path.length - 1];
        const WIDTH = MOUSE_MOVE_COORD.x - this.mouseDownCoord.x;
        const HEIGHT = MOUSE_MOVE_COORD.y - this.mouseDownCoord.y;
        const START_X = this.mouseDownCoord.x;
        const START_Y = this.mouseDownCoord.y;
        const lineDashValue = 6;
        ctx.rect(START_X, START_Y, WIDTH, HEIGHT);
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

    private drawCircle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();

        const MOUSE_MOVE_COORD = path[path.length - 1];
        const RADIUS = Math.abs(MOUSE_MOVE_COORD.y - this.mouseDownCoord.y) / 2;
        const CENTER_Y = (MOUSE_MOVE_COORD.y + this.mouseDownCoord.y) / 2;
        const LENGHT_PREVIEW = Math.abs(MOUSE_MOVE_COORD.x - this.mouseDownCoord.x);

        if (LENGHT_PREVIEW <= 2 * RADIUS && MOUSE_MOVE_COORD.x >= this.mouseDownCoord.x) {
            const RADIUS_X = Math.abs(MOUSE_MOVE_COORD.x - this.mouseDownCoord.x) / 2;
            const CENTER_X = Math.abs(MOUSE_MOVE_COORD.x + this.mouseDownCoord.x) / 2;
            ctx.arc(CENTER_X, CENTER_Y, RADIUS_X, 0, 2 * Math.PI);
        } else if (LENGHT_PREVIEW <= 2 * RADIUS && MOUSE_MOVE_COORD.x <= this.mouseDownCoord.x) {
            const radiusX = Math.abs(MOUSE_MOVE_COORD.x - this.mouseDownCoord.x) / 2;
            const centerX = Math.abs(MOUSE_MOVE_COORD.x + this.mouseDownCoord.x) / 2;
            ctx.arc(centerX, CENTER_Y, radiusX, 0, 2 * Math.PI);
        } else if (LENGHT_PREVIEW >= 2 * RADIUS && MOUSE_MOVE_COORD.x <= this.mouseDownCoord.x) {
            const CENTER_X = this.mouseDownCoord.x - RADIUS;
            ctx.arc(CENTER_X, CENTER_Y, RADIUS, 0, 2 * Math.PI);
        } else if (LENGHT_PREVIEW >= 2 * RADIUS && MOUSE_MOVE_COORD.x >= this.mouseDownCoord.x) {
            const CENTER_X = this.mouseDownCoord.x + RADIUS;
            ctx.arc(CENTER_X, CENTER_Y, RADIUS, 0, 2 * Math.PI);
        }

        ctx.lineWidth = this.widthService.getWidth();
        ctx.setLineDash([0]); // set line dash to default when drawing Cercle
        this.applyTrace(ctx);
    }

    private applyTrace(ctx: CanvasRenderingContext2D): void {
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

    private clearPath(): void {
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
