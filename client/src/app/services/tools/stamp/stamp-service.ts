import { Injectable } from '@angular/core';
import { InteractionPath } from '@app/classes/action/interaction-path';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { StampEnum, StampPickerService } from '@app/services/tool-modifier/stamp-picker/stamp-picker.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    private pathData: Vec2[];
    //private mouseWheelDown: boolean;

    constructor(
        public drawingService: DrawingService,
        private stampPickerService: StampPickerService,
        private widthService: WidthService, //private drawingStateTrackingService: DrawingStateTrackerService,
    ) {
        super(drawingService, new Description('stamp', 'd', 'stamp_icon.png'));
        this.modifiers.push(this.stampPickerService);
        this.modifiers.push(this.widthService);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.previewStamp(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.resetBorder();
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.applyStamp(this.drawingService.baseCtx, this.pathData);
            this.previewStamp(this.drawingService.previewCtx, this.pathData);
            // this.drawingStateTrackingService.addAction(this, new InteractionPath(this.pathData));
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        const mousePosition = this.getPositionFromMouse(event);
        this.pathData.push(mousePosition);
        this.previewStamp(this.drawingService.previewCtx, this.pathData);

        if (!this.isInCanvas(mousePosition)) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }

        if (this.mouseDown) {
            if (!this.isInCanvas(mousePosition) && this.mouseDown) {
                if (mousePosition.x >= this.drawingService.baseCtx.canvas.width) {
                    this.drawingService.previewCtx.canvas.width = mousePosition.x;
                }
                if (mousePosition.y >= this.drawingService.baseCtx.canvas.height) {
                    this.drawingService.previewCtx.canvas.height = mousePosition.y;
                }
            } else {
                this.resetBorder();
                this.previewStamp(this.drawingService.previewCtx, this.pathData);
            }
        }
    }
    //Pas bien implente
    /* private rotateStamp(degrees: number, path: Vec2[]): void {
        const image = new Image();
        image.src = '/assets/images/approved.png';
        const angleInRadians = (degrees * Math.PI) / 180;
        image.onload = () => {
            this.drawingService.baseCtx.drawImage(
                image,
                path[path.length - 1].x - this.widthService.getWidth() / 2,
                path[path.length - 1].y - this.widthService.getWidth() / 2,
                this.widthService.getWidth(),
                this.widthService.getWidth(),
            );
            this.drawingService.baseCtx.translate(
                path[path.length - 1].x - this.widthService.getWidth(),
                path[path.length - 1].y - this.widthService.getWidth(),
            );
            this.drawingService.baseCtx.rotate(angleInRadians);
            this.drawingService.baseCtx.translate(
                -path[path.length - 1].x - this.widthService.getWidth(),
                -path[path.length - 1].y - this.widthService.getWidth(),
            );
            this.drawingService.baseCtx.drawImage(
                image,
                this.drawingService.baseCtx.canvas.width,
                this.drawingService.baseCtx.canvas.height,
                this.widthService.getWidth(),
                this.widthService.getWidth(),
            );
        };
    } */
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
                //this.rotateStamp(90, path);
                this.stamp5(ctx, path);
                break;
            }
        }
    }

    private previewStamp(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.globalAlpha = 0.4;
        this.applyStamp(ctx, path);
    }
    private stamp1(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const image = new Image();
        image.src = '/assets/images/approved.png';
        const lastPostion: Vec2 = path[path.length - 1];
        const xPosition: number = lastPostion.x;
        const yPosition: number = lastPostion.y;
        const angleInDegree: number = 90;

        image.onload = () => {
            ctx.save();
            ctx.translate(xPosition, yPosition);
            ctx.rotate(this.convertDegreeToRad(angleInDegree));
            ctx.translate(-xPosition, -yPosition);
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

    private convertDegreeToRad(angleDegre: number): number {
        return (angleDegre * Math.PI) / 180;
    }

    private stamp2(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const image = new Image();
        image.src = '/assets/images/certified.png';
        const lastPostion: Vec2 = path[path.length - 1];
        const xPosition: number = lastPostion.x;
        const yPosition: number = lastPostion.y;
        const angleInDegree: number = 90;

        image.onload = () => {
            ctx.save();
            ctx.translate(xPosition, yPosition);
            ctx.rotate(this.convertDegreeToRad(angleInDegree));
            ctx.translate(-xPosition, -yPosition);
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
    private stamp3(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const image = new Image();
        image.src = '/assets/images/crown.png';
        const lastPostion: Vec2 = path[path.length - 1];
        const xPosition: number = lastPostion.x;
        const yPosition: number = lastPostion.y;
        const angleInDegree: number = 90;

        image.onload = () => {
            ctx.save();
            ctx.translate(xPosition, yPosition);
            ctx.rotate(this.convertDegreeToRad(angleInDegree));
            ctx.translate(-xPosition, -yPosition);
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
    private stamp4(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const image = new Image();
        image.src = '/assets/images/crown2.png';
        const lastPostion: Vec2 = path[path.length - 1];
        const xPosition: number = lastPostion.x;
        const yPosition: number = lastPostion.y;
        const angleInDegree: number = 90;

        image.onload = () => {
            ctx.save();
            ctx.translate(xPosition, yPosition);
            ctx.rotate(this.convertDegreeToRad(angleInDegree));
            ctx.translate(-xPosition, -yPosition);
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
    private stamp5(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const image = new Image();
        image.src = '/assets/images/sealN.png';
        const lastPostion: Vec2 = path[path.length - 1];
        const xPosition: number = lastPostion.x;
        const yPosition: number = lastPostion.y;
        const angleInDegree: number = 90;

        image.onload = () => {
            ctx.save();
            ctx.translate(xPosition, yPosition);
            ctx.rotate(this.convertDegreeToRad(angleInDegree));
            ctx.translate(-xPosition, -yPosition);
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
