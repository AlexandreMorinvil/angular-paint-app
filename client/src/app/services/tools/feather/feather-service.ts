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
        this.clearPath();
        this.angleInRadian = 0;
        this.isAltDown = false;
        this.widthService.setWidth(2);
    }
    onAltDown(event: KeyboardEvent): void {
        this.isAltDown = true;
    }
    onAltUp(event: KeyboardEvent): void {
        this.isAltDown = false;
    }

    // tslint:disable:no-magic-numbers
    onMouseWheel(event: WheelEvent): void {
        const rotationAngle15 = 15;
        const rotationAngle1 = 1;
        const resetAngle = 0;
        const setAngle = 360;
        const orientation = event.deltaY / 100;

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.angleInRadian === resetAngle) {
            if (orientation < 0) {
                this.angleInRadian = setAngle;
            }
            if (orientation > 0) {
                this.angleInRadian = 0;
            }
        }
        if (this.isAltDown) {
            this.angleInRadian = this.angleInRadian + rotationAngle1 * orientation;
        } else {
            this.angleInRadian = this.angleInRadian + rotationAngle15 * orientation;
        }
    }
    onMouseDown(event: MouseEvent): void {
        this.clearPath();
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.featherDraw(this.drawingService.baseCtx, this.pathData);
        }
    }
    onMouseMove(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        const mousePosition = this.getPositionFromMouse(event);
        this.pathData.push(mousePosition);
        if (this.mouseDown) {
            if (!this.isInCanvas(mousePosition) && this.mouseDown) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);

                if (mousePosition.x >= this.drawingService.baseCtx.canvas.width) {
                    this.drawingService.previewCtx.canvas.width = mousePosition.x;
                }
                if (mousePosition.y >= this.drawingService.baseCtx.canvas.height) {
                    this.drawingService.previewCtx.canvas.height = mousePosition.y;
                }
            } else {
                this.featherDraw(this.drawingService.baseCtx, this.pathData);
                this.resetBorder();
            }
        }
        this.featherDraw(this.drawingService.previewCtx, this.pathData);
    }

    onMouseUp(event: MouseEvent): void {
        this.resetBorder();
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.featherDraw(this.drawingService.baseCtx, this.pathData);

            this.drawingStateTrackingService.addAction(this, new InteractionPath(this.pathData));
        }
        this.mouseDown = false;
        this.clearPath();
    }

    private featherDraw(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.strokeStyle = this.colorService.getPrimaryColor();
        ctx.fillStyle = this.colorService.getPrimaryColor();
        ctx.lineWidth = 1;
        const currentPosition: Vec2 = path[path.length - 1];
        if (this.pathData.length > 2) {
            const lastPosition: Vec2 = path[path.length - 2];
            for (let i = 0; i < this.widthService.getWidth(); i++) {
                ctx.moveTo(
                    lastPosition.x + Math.sin(this.convertDegreeToRad(this.angleInRadian)) * i,
                    lastPosition.y - Math.cos(this.convertDegreeToRad(this.angleInRadian)) * i,
                );

                ctx.lineTo(
                    currentPosition.x + Math.sin(this.convertDegreeToRad(this.angleInRadian)) * i,
                    currentPosition.y - Math.cos(this.convertDegreeToRad(this.angleInRadian)) * i,
                );
            }
        }
        if (this.pathData.length < 2) {
            for (let i = 0; i < this.widthService.getWidth(); i++) {
                ctx.moveTo(
                    currentPosition.x + Math.sin(this.convertDegreeToRad(this.angleInRadian)) * i,
                    currentPosition.y - Math.cos(this.convertDegreeToRad(this.angleInRadian)) * i,
                );

                ctx.lineTo(
                    currentPosition.x + 1 + Math.sin(this.convertDegreeToRad(this.angleInRadian)) * i,
                    currentPosition.y - Math.cos(this.convertDegreeToRad(this.angleInRadian)) * i,
                );
            }
        }

        ctx.stroke();
    }

    private convertDegreeToRad(angleDegre: number): number {
        // Number is self explanatory and is used as a conversion
        // tslint:disable:no-magic-numbers
        return (angleDegre * Math.PI) / 180;
    }

    private clearPath(): void {
        this.pathData = [];
    }
    private resetBorder(): void {
        this.drawingService.previewCtx.canvas.width = this.drawingService.baseCtx.canvas.width;
        this.drawingService.previewCtx.canvas.height = this.drawingService.baseCtx.canvas.height;
    }

    execute(interaction: InteractionPath): void {
        for (let i = 0; i < interaction.path.length - 1; i++) {
            const pathData: Vec2[] = [interaction.path[i], interaction.path[i + 1]];
            this.featherDraw(this.drawingService.baseCtx, pathData);
        }
    }
}
