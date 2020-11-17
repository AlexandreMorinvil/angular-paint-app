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
        super(drawingService, new Description('feather', 'p', 'feather_icon.png'));
        this.modifiers.push(this.colorService);
        this.modifiers.push(this.widthService);
        this.clearPath();
        this.angleInRadian = 0; //angle du debut
        this.isAltDown = false;
    }
    onAltDown(event: KeyboardEvent): void {
        this.isAltDown = true;
    }
    onAltUp(event: KeyboardEvent): void {
        this.isAltDown = false;
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
        this.resetBorder();
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.featherDraw(this.drawingService.baseCtx, this.pathData);
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
                this.featherDraw(this.drawingService.baseCtx, this.pathData);
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.clearPath();
            }
        }
    }

    onMouseScroll(event: MouseEvent): void {
        if (this.angleInRadian == 360) {
            this.angleInRadian = 0; // pour le ramener a 0
        }
        if (this.isAltDown) {
            this.angleInRadian = this.angleInRadian + 1;
        } else {
            this.angleInRadian = this.angleInRadian + 15;
        }
    }

    private featherDraw(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        /* const image = new Image();
        image.src = 'http://www.tricedesigns.com/wp-content/uploads/2012/01/brush2.png';
        const lastPostion: Vec2 = path[path.length - 2];
        const currentPostion: Vec2 = path[path.length - 1];

        const xPosition: number = lastPostion.x;
        const yPosition: number = lastPostion.y;

        image.onload = () => {
            ctx.save();
            ctx.translate(xPosition, yPosition);
            ctx.rotate(this.convertDegreeToRad(this.angleInRadian));
            ctx.translate(-xPosition, -yPosition);
            const distance = this.distanceBetween(lastPostion, currentPostion);
            const angle = this.angleBetween(lastPostion, currentPostion);
            for (var i = 0; i < distance; i++) {
                ctx.drawImage(
                    image,
                    xPosition - this.widthService.getWidth() / 2 + Math.sin(angle) * i,
                    yPosition - this.widthService.getWidth() / 2 + Math.cos(angle) * i,
                    this.widthService.getWidth(),
                    this.widthService.getWidth(),
                );
            }
            ctx.restore();
        }; */
        ctx.beginPath();
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.lineWidth = this.widthService.getWidth(); // width ajustment
        ctx.strokeStyle = this.colorService.getPrimaryColor(); // color of the line
        ctx.fillStyle = this.colorService.getPrimaryColor(); // color of the starting point
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }
    /*  private angleBetween(lastPath: Vec2, currentPath: Vec2): number {
        return Math.atan2(currentPath.x - lastPath.x, currentPath.y - lastPath.y);
    }

    private distanceBetween(lastPath: Vec2, currentPath: Vec2): number {
        return Math.sqrt(Math.pow(lastPath.x - currentPath.x, 2) + Math.pow(lastPath.y - currentPath.y, 2));
    }
    private convertDegreeToRad(angleDegre: number): number {
        return (angleDegre * Math.PI) / 180;
    } */

    private clearPath(): void {
        this.pathData = [];
    }
    private resetBorder(): void {
        this.drawingService.previewCtx.canvas.width = this.drawingService.baseCtx.canvas.width;
        this.drawingService.previewCtx.canvas.height = this.drawingService.baseCtx.canvas.height;
    }

    execute(interaction: InteractionPath): void {
        this.featherDraw(this.drawingService.baseCtx, interaction.path);
    }
}
/* import { Injectable } from '@angular/core';
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
    private angleInRadian: number;
    private isAltDown: boolean;

    constructor(
        public drawingService: DrawingService,
        private stampPickerService: StampPickerService,
        private widthService: WidthService, //private drawingStateTrackingService: DrawingStateTrackerService,
    ) {
        super(drawingService, new Description('stamp', 'd', 'stamp_icon.png'));
        this.modifiers.push(this.stampPickerService);
        this.modifiers.push(this.widthService);
        this.clearPath();
        this.angleInRadian = 0; //angle du debut
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
            this.previewStamp(this.drawingService.previewCtx, this.pathData);
        }
    }

    onMouseScroll(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.previewStamp(this.drawingService.previewCtx, this.pathData);
        if (this.angleInRadian == 360) {
            this.angleInRadian = 0; // pour le ramener a 0
        }
        if (this.isAltDown) {
            this.angleInRadian = this.angleInRadian + 1;
        } else {
            this.angleInRadian = this.angleInRadian + 15;
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

        image.onload = () => {
            ctx.save();
            ctx.translate(xPosition, yPosition);
            ctx.rotate(this.convertDegreeToRad(this.angleInRadian));
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
   
} */
