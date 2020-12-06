import { Injectable } from '@angular/core';
import { InteractionPath } from '@app/classes/action/interaction-path';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { NumberSprayTransmissionService } from '@app/services/tool-modifier/numberspraytransmission/numberspraytransmission.service';
import { SprayDiameterService } from '@app/services/tool-modifier/spray-diameter/spray-diameter.service';
import { SprayDropletDiameterService } from '@app/services/tool-modifier/spray-droplet-diameter/spray-droplet-diameter.service';
@Injectable({
    providedIn: 'root',
})
export class AerosolService extends Tool {
    private readonly NUMBER_MILLISECONDS_IN_SECOND: number = 1000;
    private readonly FACTOR_TIME_INTERVAL_BETWEEN_SPRAY: number = 100;
    private pathData: Vec2[];
    private savedPathData: Vec2[]; // Path using for undo redo
    // tslint:disable:no-any
    private sprayIntervalId: any;
    private sprayDropletDiameter: number;

    constructor(
        drawingService: DrawingService,
        private colorService: ColorService,
        private sprayService: SprayDiameterService,
        private sprayDropletService: SprayDropletDiameterService,
        private numberSprayTransmissionService: NumberSprayTransmissionService,
        private drawingStateTrackingService: DrawingStateTrackerService,
    ) {
        super(drawingService, new Description('aerosol', 'a', 'aerosol_icon.png'));
        this.modifiers.push(this.sprayService);
        this.modifiers.push(this.sprayDropletService);
        this.modifiers.push(this.numberSprayTransmissionService);
        this.modifiers.push(this.colorService);

        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.sprayPaint(this.drawingService.baseCtx, this.pathData);
            this.sprayIntervalId = setInterval(
                () => this.wrapperSprayPaint(),
                this.NUMBER_MILLISECONDS_IN_SECOND / this.FACTOR_TIME_INTERVAL_BETWEEN_SPRAY,
            );
        }
    }

    private wrapperSprayPaint(): void {
        this.sprayPaint(this.drawingService.baseCtx, this.pathData);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
        }
        clearInterval(this.sprayIntervalId);
        this.drawingStateTrackingService.addAction(this, new InteractionPath(this.savedPathData));
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
        }
    }

    private sprayPaint(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        const mouseMoveCoord: Vec2 = path[path.length - 1];
        if (this.isInCanvas(mouseMoveCoord)) {
            this.setAttribute(ctx);
            const X_POSITION = mouseMoveCoord.x;
            const Y_POSITION = mouseMoveCoord.y;
            const numberSprayTransmission =
                this.numberSprayTransmissionService.getNumberSprayTransmission() / this.FACTOR_TIME_INTERVAL_BETWEEN_SPRAY;
            for (let i = 0; i < numberSprayTransmission; i++) {
                ctx.beginPath();
                const X_VALUE_OFFSET = this.getRandomPoint().x;
                const Y_VALUE_OFFSET = this.getRandomPoint().y;
                const X_VALUE = X_POSITION + X_VALUE_OFFSET;
                const Y_VALUE = Y_POSITION + Y_VALUE_OFFSET;
                this.sprayDropletDiameter = this.sprayDropletService.getSprayDropletDiameter();
                const DROPLET_RADIUS = this.sprayDropletDiameter / 2;
                const SAVED_DATA: Vec2 = { x: X_VALUE, y: Y_VALUE }; // Saving Data For Undo Redo
                this.savedPathData.push(SAVED_DATA);
                ctx.arc(X_VALUE, Y_VALUE, DROPLET_RADIUS, 0, 2 * Math.PI, false);
                ctx.fill();
            }
        }
    }

    private getRandomPoint(): Vec2 {
        const SPRAY_RADIUS = this.sprayService.getSprayDiameter() / 2;
        const RANDOM_ANGLE = Math.random() * (2 * Math.PI); // Get Random Angle Between 0 and 2pi
        const RANDOM_RADIUS = Math.random() * SPRAY_RADIUS; // Get Randum Radius Between  0 and radius
        return { x: Math.cos(RANDOM_ANGLE) * RANDOM_RADIUS, y: Math.sin(RANDOM_ANGLE) * RANDOM_RADIUS };
    }
    private setAttribute(ctx: CanvasRenderingContext2D): void {
        const LINE_CAP: CanvasLineCap = 'round';
        const LINE_JOIN: CanvasLineJoin = 'round';
        ctx.lineCap = LINE_CAP;
        ctx.lineJoin = LINE_JOIN;
        const LINE_WIDTH = 5;
        ctx.lineWidth = LINE_WIDTH;
        ctx.fillStyle = this.colorService.getPrimaryColor();
        ctx.strokeStyle = this.colorService.getSecondaryColor();
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.globalAlpha = this.colorService.getSecondaryColorOpacity();
    }

    private redoSprayPaint(ctx: CanvasRenderingContext2D, interaction: InteractionPath): void {
        this.setAttribute(this.drawingService.baseCtx);
        for (const point of interaction.path) {
            this.drawingService.baseCtx.beginPath();
            this.drawingService.baseCtx.arc(point.x, point.y, this.sprayDropletService.getSprayDropletDiameter() / 2, 0, 2 * Math.PI, false);
            this.drawingService.baseCtx.fill();
        }
    }

    execute(interaction: InteractionPath): void {
        this.redoSprayPaint(this.drawingService.baseCtx, interaction);
    }

    private clearPath(): void {
        this.pathData = [];
        this.savedPathData = [];
    }
}
