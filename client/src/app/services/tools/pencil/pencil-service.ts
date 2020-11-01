import { Injectable } from '@angular/core';
import { InteractionPath } from '@app/classes/action/interaction-path';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';

@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    private pathData: Vec2[];

    constructor(
        drawingService: DrawingService,
        private drawingStateTrackingService: DrawingStateTrackerService,
        private colorService: ColorService,
        private widthService: WidthService,
    ) {
        super(drawingService, new Description('crayon', 'c', 'pencil_icon.png'));
        this.modifiers.push(this.colorService);
        this.modifiers.push(this.widthService);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.drawingService.previewCtx.setLineDash([0]);
        this.drawingService.baseCtx.setLineDash([0]);
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
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            if (this.isInCanvas(mousePosition)) {
                this.pathData.push(mousePosition);
                // We draw on the preview canvas and erase it each time the mouse is moved
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawLine(this.drawingService.previewCtx, this.pathData);
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.clearPath();
            }
        }
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.lineWidth = this.widthService.getWidth(); // width ajustment
        ctx.strokeStyle = this.colorService.getPrimaryColor(); // color of the line
        ctx.fillStyle = this.colorService.getPrimaryColor(); // color of the starting point

        if (2 >= path.length) {
            ctx.fillRect(
                path[0].x - this.widthService.getWidth() / 2,
                path[0].y - this.widthService.getWidth() / 2,
                this.widthService.getWidth(),
                this.widthService.getWidth(),
            );
        }
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }

    execute(interaction: InteractionPath): void {
        this.drawLine(this.drawingService.baseCtx, interaction.path);
    }
}
