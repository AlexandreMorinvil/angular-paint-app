import { Injectable } from '@angular/core';
import { InteractionPath } from '@app/classes/action/interaction-path';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { StampEnum, StampPickerService } from '@app/services/tool-modifier/stamp-picker/stamp-picker.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    private readonly DEFAULT_SIZE_VALUE = 25;

    private pathData: Vec2[];
    private angleInRadian: number;
    private isAltDown: boolean;

    constructor(
        public drawingService: DrawingService,
        private stampPickerService: StampPickerService,
        private widthService: WidthService,
        private colorService: ColorService,
        private drawingStateTrackingService: DrawingStateTrackerService,
    ) {
        super(drawingService, new Description('stamp', 'd', 'stamp_icon.png'));
        this.modifiers.push(this.stampPickerService);
        this.modifiers.push(this.widthService);
        this.clearPath();
        this.angleInRadian = 0;
        this.isAltDown = false;
        this.widthService.setWidth(this.DEFAULT_SIZE_VALUE);
    }

    onAltDown(event: KeyboardEvent): void {
        this.isAltDown = true;
    }
    onAltUp(event: KeyboardEvent): void {
        this.isAltDown = false;
    }
    onMouseWheel(event: WheelEvent): void {
        const ANGLE_ROTATION_ON_ALT_UP = 15;
        const ANGLE_ROTATION_ON_ALT_DOWN = 1;
        const RESET_ANGLE = 0;
        const CIRCLE_ANGLE = 360;
        const ORIENTATION = event.deltaY / 100;

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.previewStamp(this.drawingService.previewCtx, this.pathData);

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

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }
    onMouseMove(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        const mousePosition = this.getPositionFromMouse(event);
        this.pathData.push(mousePosition);
        this.previewStamp(this.drawingService.previewCtx, this.pathData);

        if (this.mouseDown) {
            if (!this.isInCanvas(mousePosition) && this.mouseDown) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
            } else {
                this.previewStamp(this.drawingService.previewCtx, this.pathData);
                this.resetBorder();
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.resetBorder();
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.previewStamp(this.drawingService.previewCtx, this.pathData);
            this.applyStamp(this.drawingService.baseCtx, this.pathData);
            this.drawingStateTrackingService.addAction(this, new InteractionPath(this.pathData));
        }
        this.mouseDown = false;
        this.clearPath();
    }

    private applyStamp(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        switch (this.stampPickerService.getStamp()) {
            case StampEnum.stamp1: {
                this.stamp1(ctx, path);
                break;
            }
            case StampEnum.stamp2: {
                this.stamp2(ctx, path);
                break;
            }
            case StampEnum.stamp3: {
                this.stamp3(ctx, path);
                break;
            }
            case StampEnum.stamp4: {
                this.stamp4(ctx, path);
                break;
            }
            case StampEnum.stamp5: {
                this.stamp5(ctx, path);
                break;
            }
        }
    }

    private previewStamp(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const transparenceValue = 0.4;
        ctx.globalAlpha = transparenceValue;
        this.applyStamp(ctx, path);
    }

    private convertDegreeToRad(angleDegre: number): number {
        // value 180 is used for conversion purposes of degree to rad
        // tslint:disable:no-magic-numbers
        return (angleDegre * Math.PI) / 180;
    }
    private stamp1(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const image = new Image();
        image.src = '/assets/images/approved.png';
        this.drawImage(ctx, path, image);
    }

    private stamp2(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const image = new Image();
        image.src = '/assets/images/certified.png';
        this.drawImage(ctx, path, image);
    }
    private stamp3(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const image = new Image();
        image.src = '/assets/images/crown.png';
        this.drawImage(ctx, path, image);
    }
    private stamp4(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const image = new Image();
        image.src = '/assets/images/crown2.png';
        this.drawImage(ctx, path, image);
    }
    private stamp5(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const image = new Image();
        image.src = '/assets/images/sealN.png';
        this.drawImage(ctx, path, image);
    }
    private drawImage(ctx: CanvasRenderingContext2D, path: Vec2[], image: HTMLImageElement): void {
        const lastPostion: Vec2 = path[path.length - 1];
        const xPosition: number = lastPostion.x;
        const yPosition: number = lastPostion.y;

        image.onload = () => {
            ctx.save();
            ctx.fillStyle = this.colorService.getPrimaryColor();
            ctx.beginPath();
            ctx.arc(xPosition, yPosition, this.widthService.getWidth() / 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.translate(xPosition, yPosition);
            ctx.rotate(this.convertDegreeToRad(this.angleInRadian));
            ctx.translate(-xPosition, -yPosition);
            ctx.globalCompositeOperation = 'destination-out';
            ctx.drawImage(
                image,
                xPosition - this.widthService.getWidth() / 2,
                yPosition - this.widthService.getWidth() / 2,
                this.widthService.getWidth(),
                this.widthService.getWidth(),
            );
            ctx.restore();
        };
    }

    private clearPath(): void {
        this.pathData = [];
    }

    private resetBorder(): void {
        this.drawingService.previewCtx.canvas.width = this.drawingService.baseCtx.canvas.width;
        this.drawingService.previewCtx.canvas.height = this.drawingService.baseCtx.canvas.height;
    }

    execute(interaction: InteractionPath): void {
        this.applyStamp(this.drawingService.baseCtx, interaction.path);
    }
}
