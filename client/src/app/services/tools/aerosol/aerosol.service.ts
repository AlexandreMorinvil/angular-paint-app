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
    private pathData: Vec2[];
    private sprayDiameter: number;
    private sprayDropletDiameter: number;
    private numberTransmissionPerSecond: number;
    private sprayIntervalId: number;

    constructor(
        drawingService: DrawingService,
        private colorService: ColorService,
        private sprayService: SprayDiameterService,
        private sprayDropletService: SprayDropletDiameterService,
        private numberSprayTransmissionService: NumberSprayTransmissionService,
    ) {
        super(drawingService, new Description('aerosol', 'a', 'aerosol_icon.png'));
        this.modifiers.push(this.colorService);
        this.modifiers.push(this.sprayService);
        this.modifiers.push(this.sprayDropletService);
        this.modifiers.push(this.numberSprayTransmissionService);

        this.sprayDiameter = 100;
        //this.sprayService.getSprayDiameter();
        this.sprayDropletDiameter = 1;
        this.numberTransmissionPerSecond = 50;
        //this.sprayService.getSprayDiameter();
        //this.numberSprayTransmissionService.getNumberSprayTransmission();
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
            this.sprayPaint(this.drawingService.baseCtx, this.pathData);
        }
        clearInterval(this.sprayIntervalId);
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.sprayPaint(this.drawingService.previewCtx, this.pathData);
            this.sprayIntervalId = setInterval(this.sprayPaint.bind(this), this.NUMBER_MILLISECONDS_IN_SECOND);
        }
    }

    private sprayPaint(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        this.setAttribute(ctx);
        const mouseMoveCoord = path[path.length - 1];
        let xposition = (mouseMoveCoord.x + this.mouseDownCoord.x) / 2;
        let yposition = (mouseMoveCoord.y + this.mouseDownCoord.y) / 2;

        for (let i = 0; i < this.numberTransmissionPerSecond; i++) {
            const sprayRadius = this.sprayDiameter / 2;
            let randomAngle = Math.random() * (2 * Math.PI);
            let randomRadius = Math.random() * sprayRadius;
            let xvalueOffset = Math.cos(randomAngle) * randomRadius;
            let yvalueOffset = Math.sin(randomAngle) * randomRadius;
            xposition = xposition + xvalueOffset;
            yposition = yposition + yvalueOffset;
            ctx.fillRect(xposition, yposition, this.sprayDropletDiameter, this.sprayDropletDiameter);
            ctx.stroke();
        }
    }

    private setAttribute(ctx: CanvasRenderingContext2D): void {
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = this.colorService.getPrimaryColor();
        ctx.fillStyle = this.colorService.getPrimaryColor();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
