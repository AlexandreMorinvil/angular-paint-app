import { Injectable } from '@angular/core';
import { InteractionPath } from '@app/classes/action/interaction-path';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';

@Injectable({
    providedIn: 'root',
})
export class FeatherService extends Tool {
    private readonly DEFAULT_SIZE_VALUE = 2;
    private pathData: Vec2[];
    private angleInRadian: number;
    private isAltDown: boolean;

    constructor(
        drawingService: DrawingService,
        private drawingStateTrackingService: DrawingStateTrackerService,
        private colorService: ColorService,
        private widthService: WidthService,
    ) {
        super(drawingService, new Description('plume', 'p', 'feather_icon.png'));
        this.modifiers.push(this.colorService);
        this.modifiers.push(this.widthService);
        this.widthService.setWidth(this.DEFAULT_SIZE_VALUE);

        this.clearPath();
        this.angleInRadian = 0;
        this.isAltDown = false;
    }
    onAltDown(event: KeyboardEvent): void {
        this.isAltDown = true;
    }
    onAltUp(event: KeyboardEvent): void {
        this.isAltDown = false;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }
    onMouseWheel(event: WheelEvent): void {
        const ANGLE_ROTATION_ON_ALT_UP = 15;
        const ANGLE_ROTATION_ON_ALT_DOWN = 1;
        const RESET_ANGLE = 0;
        const CIRCLE_ANGLE = 360;
        const ORIENTATION = event.deltaY / 100;

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.angleInRadian === RESET_ANGLE) {
            if (ORIENTATION < 0) {
                this.angleInRadian = CIRCLE_ANGLE;
            }
            if (ORIENTATION > 0) {
                this.angleInRadian = 0;
            }
        }
        if (this.isAltDown) {
            this.angleInRadian = this.angleInRadian + ANGLE_ROTATION_ON_ALT_DOWN * ORIENTATION;
        } else {
            this.angleInRadian = this.angleInRadian + ANGLE_ROTATION_ON_ALT_UP * ORIENTATION;
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.featherDraw(this.drawingService.baseCtx, this.pathData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingStateTrackingService.addAction(this, new InteractionPath(this.pathData));
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            if (this.isInCanvas(mousePosition)) {
                this.featherDraw(this.drawingService.baseCtx, this.pathData);
            }
        }
    }

    private featherDraw(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.strokeStyle = this.colorService.getPrimaryColor();
        ctx.fillStyle = this.colorService.getPrimaryColor();
        const LINE_WIDTH = 1;
        ctx.lineWidth = LINE_WIDTH;
        const lastPosition: Vec2 = path[path.length - 2];
        const currentPosition: Vec2 = path[path.length - 1];
        for (let i = 0; i < this.widthService.getWidth(); i++) {
            ctx.moveTo(
                lastPosition.x + Math.sin(this.convertDegreeToRadian(this.angleInRadian)) * i,
                lastPosition.y - Math.cos(this.convertDegreeToRadian(this.angleInRadian)) * i,
            );
            ctx.lineTo(
                currentPosition.x + Math.sin(this.convertDegreeToRadian(this.angleInRadian)) * i,
                currentPosition.y - Math.cos(this.convertDegreeToRadian(this.angleInRadian)) * i,
            );
        }
        ctx.stroke();
    }

    private convertDegreeToRadian(angleDegre: number): number {
        const HALF_CIRCLE_ANGLE = 180;
        return (angleDegre * Math.PI) / HALF_CIRCLE_ANGLE;
    }

    private clearPath(): void {
        this.pathData = [];
    }

    execute(interaction: InteractionPath): void {
        for (let i = 0; i < interaction.path.length - 1; i++) {
            const pathData: Vec2[] = [interaction.path[i], interaction.path[i + 1]];
            this.featherDraw(this.drawingService.baseCtx, pathData);
        }
    }
}
