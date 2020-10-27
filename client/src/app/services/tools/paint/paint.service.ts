import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
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

    constructor(drawingService: DrawingService, private colorService: ColorService, public toleranceService: ToleranceService) {
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
            if (event.button === MouseButton.Left) {
                this.floodFill(this.drawingService.baseCtx, this.pathData);
            } else if (event.button === MouseButton.Right) {
                this.sameColorFill(this.drawingService.baseCtx);
            }
        }
    }

    sameColorFill(ctx: CanvasRenderingContext2D): void {
        this.setAttribute(ctx);
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

    floodFill(ctx: CanvasRenderingContext2D, pathPixel: Vec2[]): void {
        this.setAttribute(ctx);
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

            // Go down as long as the color matches and in inside the canvas
            while (yPosition++ <= this.drawingService.baseCtx.canvas.height - 2 && this.matchStartColor(pixelPos)) {
                this.colorPixel(pixelPos);
                if (xPosition > 0) {
                    if (this.matchStartColor({ x: pixelPos.x - 1, y: pixelPos.y })) {
                        if (!reachLeft) {
                            // Add pixel to stack
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
                            // Add pixel to stack
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

    setStartColor(): void {
        // get the pixel on the first Path of mouse
        const imageData: ImageData = this.drawingService.baseCtx.getImageData(this.pathData[0].x, this.pathData[0].y, 1, 1);
        this.startR = imageData.data[0];
        this.startG = imageData.data[1];
        this.startB = imageData.data[2];
    }

    setFillColor(): void {
        const rgb = this.convertHexToRGB(this.colorService.getPrimaryColor());
        this.fillColorR = rgb[0];
        this.fillColorG = rgb[1];
        this.fillColorB = rgb[2];
    }

    matchStartColor(pixelPos: Vec2): boolean {
        const imageData: ImageData = this.drawingService.baseCtx.getImageData(pixelPos.x, pixelPos.y, 1, 1);

        const average = // tslint:disable-next-line:no-magic-numbers
            (Math.abs(this.startR - imageData.data[0]) + Math.abs(this.startG - imageData.data[1]) + Math.abs(this.startB - imageData.data[2])) / 3;

        if (
            average <= this.toleranceService.getPixelTolerance() &&
            !(imageData.data[0] === this.fillColorR && imageData.data[1] === this.fillColorG && imageData.data[2] === this.fillColorB)
        ) {
            return true; // target to surface within tolerance
        }
        return false;
    }

    colorPixel(pixelPos: Vec2): void {
        this.drawingService.baseCtx.fillRect(pixelPos.x, pixelPos.y, 1, 1);
    }

    setAttribute(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.colorService.getPrimaryColor();
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
    }

    clearPath(): void {
        this.pathData = [];
    }

    convertHexToRGB(hex: string): number[] {
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
}
