import { Injectable } from '@angular/core';
import { InteractionPaint } from '@app/classes/action/interaction-paint';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { ToleranceService } from '@app/services/tool-modifier/tolerance/tolerance.service';

@Injectable({
    providedIn: 'root',
})
export class PaintService extends Tool {
    private pathData: Vec2[];

    private fillColorR: number;
    private fillColorG: number;
    private fillColorB: number;

    private startR: number;
    private startG: number;
    private startB: number;
    private canvasData: Uint8ClampedArray;

    constructor(
        drawingService: DrawingService,
        private drawingStateTrackingService: DrawingStateTrackerService,
        private colorService: ColorService,
        public toleranceService: ToleranceService,
    ) {
        super(drawingService, new Description('Paint', 'b', 'paint_icon.png'));
        this.modifiers.push(this.colorService);
        this.modifiers.push(this.toleranceService);
    }

    onMouseDown(event: MouseEvent): void {
        this.clearPath();
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.pathData.push(this.mouseDownCoord);
        this.setStartColor();
        this.setFillColor();
        if (this.isInCanvas(this.mouseDownCoord)) {
            let hasFilled = false;
            const newPosition: Vec2 = { x: this.pathData[0].x, y: this.pathData[0].y };
            if (event.button === MouseButton.Left) {
                this.floodFill(this.drawingService.baseCtx, this.pathData);
                hasFilled = true;
            } else if (event.button === MouseButton.Right) {
                this.sameColorFill(this.drawingService.baseCtx);
                hasFilled = true;
            }
            if (hasFilled)
                this.drawingStateTrackingService.addAction(
                    this,
                    new InteractionPaint(
                        event.button,
                        newPosition,
                        this.startR,
                        this.startG,
                        this.startB,
                        this.fillColorR,
                        this.fillColorG,
                        this.fillColorB,
                    ),
                );
        }
    }

    private sameColorFill(ctx: CanvasRenderingContext2D): void {
        this.setAttribute(ctx);
        this.scanCanvas();
        const pixelPos: Vec2 = { x: 0, y: 0 };
        while (pixelPos.y < ctx.canvas.height) {
            while (pixelPos.x < ctx.canvas.width) {
                if (this.matchStartColor(pixelPos)) {
                    this.colorPixel(pixelPos);
                }
                pixelPos.x++;
            }
            pixelPos.y++;
            pixelPos.x = 0;
        }
    }

    private floodFill(ctx: CanvasRenderingContext2D, pathPixel: Vec2[]): void {
        this.setAttribute(ctx);
        this.scanCanvas();
        // tslint:disable:no-non-null-assertion
        while (pathPixel.length) {
            const pixelPos = pathPixel.pop()!;
            const xPosition = pixelPos.x;
            let yPosition = pixelPos.y;
            // Get current pixel position
            // Go up as long as the color matches and are inside the canvas
            // tslint:disable-next-line:no-magic-numbers
            while (yPosition-- > -1 && this.matchStartColor(pixelPos)) {
                pixelPos.y -= 1;
            }
            pixelPos.y += 1;
            ++yPosition;

            let reachLeft = false;
            let reachRight = false;

            while (yPosition++ <= this.drawingService.baseCtx.canvas.height - 2 && this.matchStartColor(pixelPos)) {
                this.colorPixel(pixelPos);
                if (xPosition > 0) {
                    if (this.matchStartColor({ x: pixelPos.x - 1, y: pixelPos.y })) {
                        if (!reachLeft) {
                            pathPixel.push({ x: xPosition - 1, y: yPosition });
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }
                if (xPosition < this.drawingService.baseCtx.canvas.width) {
                    if (this.matchStartColor({ x: pixelPos.x + 1, y: pixelPos.y })) {
                        if (!reachRight) {
                            pathPixel.push({ x: xPosition + 1, y: yPosition });
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                    pixelPos.y += 1;
                }
            }
        }
    }

    private setStartColor(): void {
        // get the pixel on the first Path of mouse
        const imageData: ImageData = this.drawingService.baseCtx.getImageData(this.pathData[0].x, this.pathData[0].y, 1, 1);
        this.startR = imageData.data[0];
        this.startG = imageData.data[1];
        this.startB = imageData.data[2];
    }

    private setFillColor(): void {
        const rgb = this.convertHexToRGB(this.colorService.getPrimaryColor());
        this.fillColorR = rgb[0];
        this.fillColorG = rgb[1];
        this.fillColorB = rgb[2];
    }
    private matchStartColor(pixelPos: Vec2): boolean {
        const stepSize = 4;

        const targetR = this.canvasData[stepSize * (pixelPos.y * this.drawingService.baseCtx.canvas.width + pixelPos.x)];
        const targetG = this.canvasData[stepSize * (pixelPos.y * this.drawingService.baseCtx.canvas.width + pixelPos.x) + 1];
        const targetB = this.canvasData[stepSize * (pixelPos.y * this.drawingService.baseCtx.canvas.width + pixelPos.x) + 2];
        // tslint:disable-next-line:no-magic-numbers
        const average = (Math.abs(this.startR - targetR) + Math.abs(this.startG - targetG) + Math.abs(this.startB - targetB)) / 3;

        if (
            average <= this.toleranceService.getPixelTolerance() &&
            !(targetR === this.fillColorR && targetG === this.fillColorG && targetB === this.fillColorB)
        ) {
            return true; // target to surface within tolerance
        }
        return false;
    }

    private scanCanvas(): void {
        this.canvasData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.drawingService.baseCtx.canvas.width,
            this.drawingService.baseCtx.canvas.height - 2,
        ).data;
    }

    private colorPixel(pixelPos: Vec2): void {
        this.drawingService.baseCtx.fillRect(pixelPos.x, pixelPos.y, 1, 1);
        const stepSize = 4;
        this.canvasData[stepSize * (pixelPos.y * this.drawingService.baseCtx.canvas.width + pixelPos.x)] = this.fillColorR;
        this.canvasData[stepSize * (pixelPos.y * this.drawingService.baseCtx.canvas.width + pixelPos.x) + 1] = this.fillColorG;
        this.canvasData[stepSize * (pixelPos.y * this.drawingService.baseCtx.canvas.width + pixelPos.x) + 2] = this.fillColorB;
    }

    private setAttribute(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.colorService.getPrimaryColor();
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
    }

    private clearPath(): void {
        this.pathData = [];
    }

    private convertHexToRGB(hex: string): number[] {
        hex = hex.substr(1);
        const values = hex.split('');
        const r = parseInt(values[0].toString() + values[1].toString(), 16);
        const g = parseInt(values[2].toString() + values[3].toString(), 16);
        const b = parseInt(values[4].toString() + values[5].toString(), 16);
        return [r, g, b];
    }

    isInCanvas(mousePosition: Vec2): boolean {
        return mousePosition.x <= this.drawingService.previewCtx.canvas.width && mousePosition.y <= this.drawingService.previewCtx.canvas.height;
    }

    execute(interaction: InteractionPaint): void {
        this.clearPath();
        this.pathData.push(interaction.mouseDownCoord);
        this.startR = interaction.startR;
        this.startG = interaction.startG;
        this.startB = interaction.startB;
        this.fillColorR = interaction.fillColorR;
        this.fillColorG = interaction.fillColorG;
        this.fillColorB = interaction.fillColorB;
        const mouseButton = interaction.mouseButton;
        if (mouseButton === MouseButton.Left) this.floodFill(this.drawingService.baseCtx, this.pathData);
        else if (mouseButton === MouseButton.Right) this.sameColorFill(this.drawingService.baseCtx);
    }
}
