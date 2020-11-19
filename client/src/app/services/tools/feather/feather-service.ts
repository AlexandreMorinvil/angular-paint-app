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

    onMouseScroll(event: MouseEvent): void {
        const rotationAngle15 = 15;
        const rotationAngle1 = 1;
        const resetAngle = 360;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        if (this.angleInRadian === resetAngle) {
            this.angleInRadian = 0;
        }
        if (this.isAltDown) {
            this.angleInRadian = this.angleInRadian + rotationAngle1;
        } else {
            this.angleInRadian = this.angleInRadian + rotationAngle15;
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.resetBorder();
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
    }

    private featherDraw(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.strokeStyle = this.colorService.getPrimaryColor(); // color of the line
        ctx.fillStyle = this.colorService.getPrimaryColor(); // color of the starting point
        ctx.lineWidth = 1;
        const lastPosition: Vec2 = path[path.length - 2];
        const currentPosition: Vec2 = path[path.length - 1];
        for (let i = 0; i < this.widthService.getWidth(); i++) {
            ctx.moveTo(
                lastPosition.x + (Math.sin(this.convertDegreeToRad(this.angleInRadian)) * i) / 2,
                lastPosition.y - (Math.cos(this.convertDegreeToRad(this.angleInRadian)) * i) / 2,
            );

            ctx.lineTo(
                currentPosition.x + (Math.sin(this.convertDegreeToRad(this.angleInRadian)) * i) / 2,
                currentPosition.y - (Math.cos(this.convertDegreeToRad(this.angleInRadian)) * i) / 2,
            );
        }

        ctx.stroke();
    }

    private convertDegreeToRad(angleDegre: number): number {
        // Number is self explanatory
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
