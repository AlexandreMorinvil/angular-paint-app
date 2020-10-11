import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
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

    constructor(drawingService: DrawingService, private colorService: ColorService, public toleranceService: ToleranceService) {
        super(drawingService, new Description('Paint', 'b', 'paint_icon.png'));
        this.modifiers.push(this.colorService);
        this.modifiers.push(this.toleranceService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.getStartColor();

            //console.log(this.startR + '' + this.startG + '' + this.startB);
            //this.colorPixel({ x: this.pathData[0].x, y: this.pathData[0].y });

            this.floodFill(this.drawingService.baseCtx, this.pathData);
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

    floodFill(ctx: CanvasRenderingContext2D, pathPixel: Vec2[]) {
        this.setAttribute(ctx);
        while (pathPixel.length) {
            let pixelPos = pathPixel.pop()!;
            //let x = newPos.x;
            //let y = newPos.y;

            // Get current pixel position
            //let pixelPos = (y * this.drawingService.baseCtx.canvas.width + x) * 4;

            // Go up as long as the color matches and are inside the canvas
            while (pixelPos.y > 0 && this.matchStartColor(pixelPos)) {
                pixelPos.y -= 1;
                //pixelPos -= this.drawingService.baseCtx.canvas.width * 4;
            }
            ++pixelPos.y;
            //pixelPos += this.drawingService.baseCtx.canvas.width * 4;
            let reachLeft = false;
            let reachRight = false;
            // Go down as long as the color matches and in inside the canvas
            while (pixelPos.y < this.drawingService.baseCtx.canvas.height - 1 && this.matchStartColor(pixelPos)) {
                this.colorPixel(pixelPos);
                pixelPos.y += 1;

                if (pixelPos.x > 0) {
                    if (this.matchStartColor(pixelPos)) {
                        if (!reachLeft) {
                            // Add pixel to stack
                            pathPixel.push({ x: pixelPos.x - 1, y: pixelPos.y });
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }

                if (pixelPos.x < this.drawingService.baseCtx.canvas.width - 1) {
                    if (this.matchStartColor(pixelPos)) {
                        if (!reachRight) {
                            // Add pixel to stack
                            pathPixel.push({ x: pixelPos.x + 1, y: pixelPos.y });
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
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
    }

    matchStartColor(pixelPos: Vec2): boolean {
        const imageData: ImageData = this.drawingService.baseCtx.getImageData(pixelPos.x, pixelPos.y, 1, 1);

        let r = imageData.data[0];
        let g = imageData.data[1];
        let b = imageData.data[2];
        return r == this.startR && g == this.startG && b == this.startB;
    }

    colorPixel(pixelPos: Vec2): void {
        this.drawingService.baseCtx.fillRect(pixelPos.x, pixelPos.y, 1, 1);
    }

    setAttribute(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.colorService.getPrimaryColor();
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
    }

    private clearPath(): void {
        this.pathData = [];
    }

    private isInCanvas(mousePosition: Vec2): boolean {
        return mousePosition.x <= this.drawingService.baseCtx.canvas.width && mousePosition.y <= this.drawingService.baseCtx.canvas.height;
    }
}
