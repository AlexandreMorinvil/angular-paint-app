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
    private readonly STAMP1_IMAGE_SOURCE: string = '/assets/images/approved.png';
    private readonly STAMP2_IMAGE_SOURCE: string = '/assets/images/certified.png';
    private readonly STAMP3_IMAGE_SOURCE: string = '/assets/images/crown.png';
    private readonly STAMP4_IMAGE_SOURCE: string = '/assets/images/crown2.png';
    private readonly STAMP5_IMAGE_SOURCE: string = '/assets/images/sealN.png';
    private readonly DEFAULT_SIZE_VALUE: number = 25;

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
        const ORIENTATION_FACTOR = 100;
        const ORIENTATION = event.deltaY / ORIENTATION_FACTOR;

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.previewStamp(this.drawingService.previewCtx, this.pathData);

        if (this.angleInRadian === RESET_ANGLE) {
            if (ORIENTATION < 0) {
                this.angleInRadian = CIRCLE_ANGLE;
            } else {
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

        if (!this.mouseDown) {
            return;
        }
        if (!this.isInCanvas(mousePosition) && this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        } else {
            this.previewStamp(this.drawingService.previewCtx, this.pathData);
            this.resetBorder();
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
        const STAMP_TYPE: string = this.stampPickerService.getStamp();
        switch (STAMP_TYPE) {
            case StampEnum.stamp1: {
                this.stamp(ctx, path, this.STAMP1_IMAGE_SOURCE);
                break;
            }
            case StampEnum.stamp2: {
                this.stamp(ctx, path, this.STAMP2_IMAGE_SOURCE);
                break;
            }
            case StampEnum.stamp3: {
                this.stamp(ctx, path, this.STAMP3_IMAGE_SOURCE);
                break;
            }
            case StampEnum.stamp4: {
                this.stamp(ctx, path, this.STAMP4_IMAGE_SOURCE);
                break;
            }
            case StampEnum.stamp5: {
                this.stamp(ctx, path, this.STAMP5_IMAGE_SOURCE);
                break;
            }
        }
    }

    private previewStamp(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const TRANSPARENCE_VALUE = 0.4;
        ctx.globalAlpha = TRANSPARENCE_VALUE;
        this.applyStamp(ctx, path);
    }

    private convertDegreeToRad(angleDegre: number): number {
        const HALF_CIRCLE_ANGLE: number = 180;
        return (angleDegre * Math.PI) / HALF_CIRCLE_ANGLE;
    }

    private stamp(ctx: CanvasRenderingContext2D, path: Vec2[], imageSource: string): void {
        const IMAGE = new Image();
        IMAGE.src = imageSource;
        this.drawImage(ctx, path, IMAGE);
    }

    private drawImage(ctx: CanvasRenderingContext2D, path: Vec2[], image: HTMLImageElement): void {
        const LAST_POSITION: Vec2 = path[path.length - 1];
        const X_POSITION: number = LAST_POSITION.x;
        const Y_POSITION: number = LAST_POSITION.y;

        image.onload = () => {
            ctx.save();
            ctx.fillStyle = this.colorService.getPrimaryColor();
            ctx.beginPath();
            ctx.arc(X_POSITION, Y_POSITION, this.widthService.getWidth() / 2, 0, 2 * Math.PI);
            ctx.fill();
            ctx.translate(X_POSITION, Y_POSITION);
            ctx.rotate(this.convertDegreeToRad(this.angleInRadian));
            ctx.translate(-X_POSITION, -Y_POSITION);
            ctx.globalCompositeOperation = 'destination-out';
            ctx.drawImage(
                image,
                X_POSITION - this.widthService.getWidth() / 2,
                Y_POSITION - this.widthService.getWidth() / 2,
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
