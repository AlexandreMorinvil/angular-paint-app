import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { NumberSprayTransmissionService } from '@app/services/tool-modifier/numberspraytransmission/numberspraytransmission.service';
import { SprayDiameterService } from '@app/services/tool-modifier/spraydiameter/spray-diameter.service';
import { SprayDropletDiameterService } from '@app/services/tool-modifier/spraydropletdiameter/spraydropletdiameter.service';

@Injectable({
    providedIn: 'root',
})
export class AerosolService extends Tool {
    private readonly NUMBER_MILLISECONDS_IN_SECOND: number = 1000;
    private readonly factorTimeIntervalBeetweenSpray: number = 100;
    private pathData: Vec2[];
    private sprayIntervalId: number;

    constructor(
        drawingService: DrawingService,
        private colorService: ColorService,
        private sprayService: SprayDiameterService,
        private sprayDropletService: SprayDropletDiameterService,
        private numberSprayTransmissionService: NumberSprayTransmissionService,
    ) {
        super(drawingService, new Description('aerosol', 'a', 'aerosol_icon.png'));
        this.modifiers.push(this.sprayService);
        this.modifiers.push(this.sprayDropletService);
        this.modifiers.push(this.numberSprayTransmissionService);
        this.modifiers.push(this.colorService);

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
            this.sprayPaint(this.drawingService.previewCtx, this.pathData);
            this.sprayIntervalId = setInterval(
                () => this.wrapperSprayPaint(),
                this.NUMBER_MILLISECONDS_IN_SECOND / this.factorTimeIntervalBeetweenSpray,
            );
        }
    }

    wrapperSprayPaint(): void {
        this.sprayPaint(this.drawingService.previewCtx, this.pathData);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
        }
        clearInterval(this.sprayIntervalId);
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
        this.setAttribute(ctx);
        const mouseMoveCoord = path[path.length - 1];
        let xposition = mouseMoveCoord.x;
        let yposition = mouseMoveCoord.y;

        if (this.isInCanvas(mouseMoveCoord)) {
            for (let i = 0; i < this.numberSprayTransmissionService.getNumberSprayTransmission() / this.factorTimeIntervalBeetweenSpray; i++) {
                ctx.beginPath();
                const sprayRadius = this.sprayService.getSprayDiameter() / 2;
                let randomAngle = Math.random() * (2 * Math.PI);
                let randomRadius = Math.random() * sprayRadius;
                let xvalueOffset = Math.cos(randomAngle) * randomRadius;
                let yvalueOffset = Math.sin(randomAngle) * randomRadius;
                const x = xposition + xvalueOffset;
                const y = yposition + yvalueOffset;
                ctx.arc(x, y, this.sprayDropletService.getSprayDropletDiameter() / 2, 0, 2 * Math.PI, false);
                ctx.fill();
            }
        }
    }

    private setAttribute(ctx: CanvasRenderingContext2D): void {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 5;
        ctx.fillStyle = this.colorService.getPrimaryColor();
        ctx.strokeStyle = this.colorService.getSecondaryColor();
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.globalAlpha = this.colorService.getSecondaryColorOpacity();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
