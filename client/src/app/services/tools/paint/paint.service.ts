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
        // early return if the click is outside the drawing zone
        if (!this.isInCanvas(this.mouseDownCoord)) {
            return;
        }
        this.setStartColor();
        this.setFillColor();
        let hasFilled = false;
        const NEW_POSITION: Vec2 = { x: this.pathData[0].x, y: this.pathData[0].y };
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
                    NEW_POSITION,
                    this.startR,
                    this.startG,
                    this.startB,
                    this.fillColorR,
                    this.fillColorG,
                    this.fillColorB,
                ),
            );
    }

    private sameColorFill(ctx: CanvasRenderingContext2D): void {
        this.setAttribute(ctx);
        this.scanCanvas();
        const PIXEL_POSITION: Vec2 = { x: 0, y: 0 };
        while (PIXEL_POSITION.y < ctx.canvas.height) {
            while (PIXEL_POSITION.x < ctx.canvas.width) {
                if (this.matchStartColor(PIXEL_POSITION)) {
                    this.colorPixel(PIXEL_POSITION);
                }
                PIXEL_POSITION.x++;
            }
            PIXEL_POSITION.y++;
            PIXEL_POSITION.x = 0;
        }
    }

    private floodFill(ctx: CanvasRenderingContext2D, pathPixel: Vec2[]): void {
        this.setAttribute(ctx);
        this.scanCanvas();
        while (pathPixel.length) {
            const PIXEL_POSITION = pathPixel.pop() as Vec2;
            const X_POSITION = PIXEL_POSITION.x;
            let yPosition = PIXEL_POSITION.y;
            // Get current pixel position
            // Go up as long as the color matches and are inside the canvas
            const POINT_BEYOND_CANVAS = -1;
            while (yPosition-- > POINT_BEYOND_CANVAS && this.matchStartColor(PIXEL_POSITION)) {
                PIXEL_POSITION.y -= 1;
            }
            PIXEL_POSITION.y += 1;
            ++yPosition;

            let reachLeft = false;
            let reachRight = false;

            while (yPosition++ <= this.drawingService.baseCtx.canvas.height - 2 && this.matchStartColor(PIXEL_POSITION)) {
                this.colorPixel(PIXEL_POSITION);
                if (X_POSITION > 0) {
                    if (this.matchStartColor({ x: PIXEL_POSITION.x - 1, y: PIXEL_POSITION.y })) {
                        if (!reachLeft) {
                            pathPixel.push({ x: X_POSITION - 1, y: yPosition });
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }
                if (X_POSITION < this.drawingService.baseCtx.canvas.width) {
                    if (this.matchStartColor({ x: PIXEL_POSITION.x + 1, y: PIXEL_POSITION.y })) {
                        if (!reachRight) {
                            pathPixel.push({ x: X_POSITION + 1, y: yPosition });
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                    PIXEL_POSITION.y += 1;
                }
            }
        }
    }

    private setStartColor(): void {
        // get the pixel on the first Path of mouse
        const IMAGE_DATA: ImageData = this.drawingService.baseCtx.getImageData(this.pathData[0].x, this.pathData[0].y, 1, 1);
        this.startR = IMAGE_DATA.data[0];
        this.startG = IMAGE_DATA.data[1];
        this.startB = IMAGE_DATA.data[2];
    }

    private setFillColor(): void {
        const RGB = this.convertHexToRGB(this.colorService.getPrimaryColor());
        this.fillColorR = RGB[0];
        this.fillColorG = RGB[1];
        this.fillColorB = RGB[2];
    }
    private matchStartColor(pixelPos: Vec2): boolean {
        const STEP_SIZE = 4;
        const TARGET_R = this.canvasData[STEP_SIZE * (pixelPos.y * this.drawingService.baseCtx.canvas.width + pixelPos.x)];
        const TARGET_G = this.canvasData[STEP_SIZE * (pixelPos.y * this.drawingService.baseCtx.canvas.width + pixelPos.x) + 1];
        const TARGET_B = this.canvasData[STEP_SIZE * (pixelPos.y * this.drawingService.baseCtx.canvas.width + pixelPos.x) + 2];
        const DIVISOR = 3;
        const AVERAGE = (Math.abs(this.startR - TARGET_R) + Math.abs(this.startG - TARGET_G) + Math.abs(this.startB - TARGET_B)) / DIVISOR;

        if (
            AVERAGE <= this.toleranceService.getPixelTolerance() &&
            !(TARGET_R === this.fillColorR && TARGET_G === this.fillColorG && TARGET_B === this.fillColorB)
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
        const STEP_SIZE = 4;
        this.canvasData[STEP_SIZE * (pixelPos.y * this.drawingService.baseCtx.canvas.width + pixelPos.x)] = this.fillColorR;
        this.canvasData[STEP_SIZE * (pixelPos.y * this.drawingService.baseCtx.canvas.width + pixelPos.x) + 1] = this.fillColorG;
        this.canvasData[STEP_SIZE * (pixelPos.y * this.drawingService.baseCtx.canvas.width + pixelPos.x) + 2] = this.fillColorB;
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
        const VALUES = hex.split('');
        const R = parseInt(VALUES[0].toString() + VALUES[1].toString(), 16);
        const G = parseInt(VALUES[2].toString() + VALUES[3].toString(), 16);
        const B = parseInt(VALUES[4].toString() + VALUES[5].toString(), 16);
        return [R, G, B];
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
