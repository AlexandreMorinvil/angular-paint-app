import { Injectable } from '@angular/core';
import { InteractionStartEnd } from '@app/classes/action/interaction-start-end';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { SidesService } from '@app/services/tool-modifier/sides/sides.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
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
export class PolygonService extends Tool {
    private pathData: Vec2[];
    private savedData: Vec2[];
    private angle: number;
    private radius: number;

    constructor(
        drawingService: DrawingService,
        private drawingStateTrackingService: DrawingStateTrackerService,
        private colorService: ColorService,
        private tracingService: TracingService,
        private widthService: WidthService,
        private sidesService: SidesService,
    ) {
        super(drawingService, new Description('polygone', '3', 'polygon_icon.png'));
        this.modifiers.push(this.colorService);
        this.modifiers.push(this.widthService);
        this.modifiers.push(this.tracingService);
        this.modifiers.push(this.sidesService);
        this.angle = Math.PI / (this.sidesService.getSide() - 2);
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
            this.drawPolygon(this.drawingService.baseCtx, this.pathData);
            this.drawingStateTrackingService.addAction(this, new InteractionStartEnd(this.mouseDownCoord, this.pathData, this.shiftDown));
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.mouseDown) {
            return;
        }
        const MOUSE_POSITION = this.getPositionFromMouse(event);
        this.pathData.push(MOUSE_POSITION);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (!this.isInCanvas(MOUSE_POSITION) && this.mouseDown) {
            if (this.drawingService.baseCtx.canvas.width < MOUSE_POSITION.x) {
                this.drawingService.previewCtx.canvas.width = MOUSE_POSITION.x;
            }
            if (this.drawingService.baseCtx.canvas.height < MOUSE_POSITION.y) {
                this.drawingService.previewCtx.canvas.height = MOUSE_POSITION.y;
            }
        } else {
            this.resetBorder();
        }
        this.drawPolygon(this.drawingService.previewCtx, this.pathData);
        this.drawPreviewCircle(this.drawingService.previewCtx);
    }

    setAttribute(ctx: CanvasRenderingContext2D): void {
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

    private drawPolygon(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        this.savedData = [];
        const LAST_MOUSE_MOVE_COORD = path[path.length - 1];
        const RADIUS = Math.sqrt(
            Math.pow(this.mouseDownCoord.x - LAST_MOUSE_MOVE_COORD.x, 2) + Math.pow(this.mouseDownCoord.y - LAST_MOUSE_MOVE_COORD.y, 2),
        );
        this.radius = RADIUS;
        for (let i = 0; i < this.sidesService.getSide(); i++) {
            this.savedData.push({
                x: this.mouseDownCoord.x + RADIUS * Math.cos(this.angle),
                y: this.mouseDownCoord.y - RADIUS * Math.sin(this.angle),
            });
            this.angle += (2 * Math.PI) / this.sidesService.getSide();
        }
        this.drawingService.previewCtx.setLineDash([0]);
        ctx.beginPath();
        ctx.moveTo(this.savedData[0].x, this.savedData[0].y);
        for (let k = 1; k < this.sidesService.getSide(); k++) {
            ctx.lineTo(this.savedData[k].x, this.savedData[k].y);
        }
        ctx.closePath();
        ctx.setLineDash([0]);
        this.setAttribute(ctx);
    }

    drawPreviewCircle(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        const CENTER_X = this.pathData[0].x;
        const CENTER_Y = this.pathData[0].y;
        const NUMBER_MIN_SIDE = 5;
        const NUMBER_SQUARE_SIDE = 4;
        const NUMBER_TRIANGLE_SIDE = 3;
        const HALF_CIRCLE_ANGLE = 180;
        const CIRCLE_ANGLE = 360;
        // Leave the calculation in full so as not to have a space due to calculation imprecision
        if (this.tracingService.getHasContour() && this.sidesService.getSide() >= NUMBER_MIN_SIDE) {
            this.radius = this.radius - this.widthService.getWidth() / 2;
            const SPACE_BETWEEN_TWO_POLYGON =
                (2 * this.radius * Math.cos((((HALF_CIRCLE_ANGLE - CIRCLE_ANGLE / this.sidesService.getSide()) / 2) * Math.PI) / HALF_CIRCLE_ANGLE) +
                    (2 * this.widthService.getWidth()) /
                        Math.tan((((HALF_CIRCLE_ANGLE - CIRCLE_ANGLE / this.sidesService.getSide()) / 2) * Math.PI) / HALF_CIRCLE_ANGLE)) /
                (2 * Math.cos((((HALF_CIRCLE_ANGLE - CIRCLE_ANGLE / this.sidesService.getSide()) / 2) * Math.PI) / HALF_CIRCLE_ANGLE));
            this.radius = SPACE_BETWEEN_TWO_POLYGON;
        } else if (this.tracingService.getHasContour() && this.sidesService.getSide() === NUMBER_SQUARE_SIDE) {
            const SPACE_BETWEEN_TWO_SQUARE = Math.sqrt(Math.pow(this.widthService.getWidth(), 2) + Math.pow(this.widthService.getWidth(), 2));
            this.radius = this.radius - SPACE_BETWEEN_TWO_SQUARE / 2;
            this.radius = this.radius + SPACE_BETWEEN_TWO_SQUARE;
        } else {
            this.radius = this.radius - this.widthService.getWidth();
            const SPACE_BETWEEN_TWO_TRIANGLE =
                this.widthService.getWidth() / Math.sin(((HALF_CIRCLE_ANGLE / NUMBER_TRIANGLE_SIDE / 2) * Math.PI) / HALF_CIRCLE_ANGLE);
            this.radius = this.radius + SPACE_BETWEEN_TWO_TRIANGLE;
        }
        const ANGLE_CIRCLE = 2 * Math.PI;
        ctx.arc(CENTER_X, CENTER_Y, this.radius, 0, ANGLE_CIRCLE);
        const LINE_DASH_VALUE = 6;
        ctx.strokeStyle = 'black';
        ctx.setLineDash([LINE_DASH_VALUE]);
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
        this.drawPolygon(this.drawingService.baseCtx, interaction.path);
    }
}
