import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { FillingService } from '@app/services/tool-modifier/filling/filling.service';
import { ToleranceService } from '@app/services/tool-modifier/tolerance/tolerance.service';

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}
@Injectable({
    providedIn: 'root',
})
export class PaintService extends Tool {
    private pathData: Vec2[];
    private startR: number;
    private startG: number;
    private startB: number;

    public startRGBHex: string;
    public pixelRGBHex: string;

    constructor(
        drawingService: DrawingService,
        private colorService: ColorService,
        public toleranceService: ToleranceService,
        public fillingService: FillingService,
    ) {
        super(drawingService, new Description('Paint', 'b', 'paint_icon.png'));
        this.modifiers.push(this.colorService);
        this.modifiers.push(this.toleranceService);
        this.modifiers.push(this.fillingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.getStartColor();
            console.log(this.colorDifference(this.startRGBHex, this.colorService.getPrimaryColor()));
            //console.log(this.startR + '' + this.startG + '' + this.startB);
            if (this.fillingService.getNeighbourPixelsOnly() && this.colorService.getPrimaryColor() != this.startRGBHex) {
                this.floodFill(this.drawingService.baseCtx, this.pathData);
            } else {
                this.sameColorFill(this.drawingService.baseCtx, this.pathData);
            }
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (!this.isInCanvas(mousePosition) && this.mouseDown) {
                if (mousePosition.x >= this.drawingService.baseCtx.canvas.width) {
                    this.drawingService.previewCtx.canvas.width = mousePosition.x;
                }
                if (mousePosition.y >= this.drawingService.baseCtx.canvas.height) {
                    this.drawingService.previewCtx.canvas.height = mousePosition.y;
                }
            }
        }
    }

    sameColorFill(ctx: CanvasRenderingContext2D, pathPixel: Vec2[]) {
        this.setAttribute(ctx);
        let pixelPos: Vec2 = { x: 0, y: 0 };
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
            let pixelPos = pathPixel.pop()!;
            //let x = newPos.x;
            //let y = newPos.y;

            // Get current pixel position
            //let pixelPos = (y * this.drawingService.baseCtx.canvas.width + x) * 4;

            // Go up as long as the color matches and are inside the canvas
            while (pixelPos.y > -1 && this.matchStartColor(pixelPos)) {
                pixelPos.y -= 1;

                //pixelPos -= this.drawingService.baseCtx.canvas.width * 4;
            }
            pixelPos.y += 1;

            //pixelPos += this.drawingService.baseCtx.canvas.width * 4;
            let reachLeft = false;
            let reachRight = false;
            //console.log(this.startR + '' + this.startG + '' + this.startB);
            // Go down as long as the color matches and in inside the canvas
            while (pixelPos.y <= this.drawingService.baseCtx.canvas.height && this.matchStartColor(pixelPos)) {
                this.colorPixel(pixelPos);
                pixelPos.y += 1;
                if (this.matchStartColor(pixelPos) && !reachLeft && pixelPos.x > 0) {
                    // Add pixel to stack
                    pathPixel.push({ x: pixelPos.x - 1, y: pixelPos.y });
                    reachLeft = true;
                } else if (reachLeft) {
                    reachLeft = false;
                }

                if (this.matchStartColor(pixelPos) && !reachRight && pixelPos.x < this.drawingService.baseCtx.canvas.width) {
                    // Add pixel to stack
                    pathPixel.push({ x: pixelPos.x + 1, y: pixelPos.y });
                    reachRight = true;
                } else if (reachRight) {
                    reachRight = false;
                }

                //pixelPos += this.drawingService.baseCtx.canvas.width * 4;
            }
        }
    }

    getStartColor() {
        //get the pixel on the first Path of mouse
        const imageData: ImageData = this.drawingService.baseCtx.getImageData(this.pathData[0].x, this.pathData[0].y, 1, 1);
        this.startR = imageData.data[0];
        this.startG = imageData.data[1];
        this.startB = imageData.data[2];

        let rHex = this.startR.toString(16);
        let gHex = this.startG.toString(16);
        let bHex = this.startB.toString(16);

        if (rHex.length == 1) rHex = '0' + rHex;
        if (gHex.length == 1) gHex = '0' + gHex;
        if (bHex.length == 1) bHex = '0' + bHex;

        this.startRGBHex = '#' + rHex + gHex + bHex;
    }

    getPixelColorHex(pixelPos: Vec2): void {
        //get the pixel on the first Path of mouse
        const imageData: ImageData = this.drawingService.baseCtx.getImageData(pixelPos.x, pixelPos.y, 1, 1);
        let r = imageData.data[0];
        let g = imageData.data[1];
        let b = imageData.data[2];

        let rHex = r.toString(16);
        let gHex = g.toString(16);
        let bHex = b.toString(16);

        if (rHex.length == 1) rHex = '0' + rHex;
        if (gHex.length == 1) gHex = '0' + gHex;
        if (bHex.length == 1) bHex = '0' + bHex;

        this.pixelRGBHex = '#' + rHex + gHex + bHex;
    }

    matchStartColor(pixelPos: Vec2): boolean {
        this.getPixelColorHex(pixelPos);
        return this.similarColor();
        //return r == this.startR && g == this.startG && b == this.startB;
    }
    similarColor(): boolean {
        let difference = this.colorDifference(this.pixelRGBHex, this.startRGBHex)!;
        if (difference <= this.toleranceService.getTolerance()) {
            return true;
        } else return false;
    }

    colorPixel(pixelPos: Vec2): void {
        //Using fillRect method
        this.drawingService.baseCtx.fillRect(pixelPos.x, pixelPos.y, 1, 1);
        //Using putImageData metho
    }

    colorDifference(firstColor: string, secondColor: string) {
        if (!firstColor && !secondColor) return;

        const _firstColor = firstColor.charAt(0) == '#' ? firstColor.substring(1, 7) : firstColor;
        const _secondColor = secondColor.charAt(0) == '#' ? secondColor.substring(1, 7) : secondColor;

        const _r = parseInt(_firstColor.substring(0, 2), 16);
        const _g = parseInt(_firstColor.substring(2, 4), 16);
        const _b = parseInt(_firstColor.substring(4, 6), 16);

        const __r = parseInt(_secondColor.substring(0, 2), 16);
        const __g = parseInt(_secondColor.substring(2, 4), 16);
        const __b = parseInt(_secondColor.substring(4, 6), 16);

        let r1 = (_r / 255) * 100;
        let g1 = (_g / 255) * 100;
        let b1 = (_b / 255) * 100;

        let perc1 = Math.round((r1 + g1 + b1) / 3);

        let r2 = (__r / 255) * 100;
        let g2 = (__g / 255) * 100;
        let b2 = (__b / 255) * 100;

        let perc2 = Math.round((r2 + g2 + b2) / 3);
        return Math.abs(perc1 - perc2);
    }

    setAttribute(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.colorService.getPrimaryColor();
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
    }

    clearPath(): void {
        this.pathData = [];
    }

    isInCanvas(mousePosition: Vec2): boolean {
        return mousePosition.x <= this.drawingService.baseCtx.canvas.width && mousePosition.y <= this.drawingService.baseCtx.canvas.height;
    }
}
