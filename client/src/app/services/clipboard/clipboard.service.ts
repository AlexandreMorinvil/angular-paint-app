import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

const HALF_CIRCLE_IN_DEGREES = 180;
@Injectable({
    providedIn: 'root',
})
export class ClipBoardService {
    clipboardCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    private canvasImage: HTMLImageElement;
    private image: HTMLImageElement;
    private startCoord: Vec2;

    constructor(private drawingService: DrawingService) {
        this.image = new Image();
        this.canvasImage = new Image();
        this.startCoord = { x: 0, y: 0 };
        this.canvasImage.addEventListener('load', () => {
            this.clipboardCtx.drawImage(
                this.canvasImage,
                this.startCoord.x,
                this.startCoord.y,
                this.canvas.width,
                this.canvas.height,
                0,
                0,
                this.canvas.width,
                this.canvas.height,
            );
            this.image.src = this.clipboardCtx.canvas.toDataURL();
        });
    }

    memorize(startCoord: Vec2, dimensions: Vec2, angle: number): void {
        const INITIAL_CENTER_POSITION: Vec2 = this.computeCenter(startCoord, dimensions);
        const NEW_DIMENSIONS: Vec2 = this.computeDimensions(dimensions, angle);
        const NEW_STARTDOWN_COORD: Vec2 = this.computeUpperLeftCorner(INITIAL_CENTER_POSITION, NEW_DIMENSIONS);

        this.canvas.width = NEW_DIMENSIONS.x;
        this.canvas.height = NEW_DIMENSIONS.y;
        this.startCoord.x = NEW_STARTDOWN_COORD.x;
        this.startCoord.y = NEW_STARTDOWN_COORD.y;
        this.clearClipboard();
        this.canvasImage.src = this.drawingService.previewCtx.canvas.toDataURL();
    }

    provide(): string {
        return this.image.src;
    }

    getHeight(): number {
        return this.canvas.height;
    }

    getWidth(): number {
        return this.canvas.width;
    }

    private clearClipboard(): void {
        this.clipboardCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private computeDimensions(dimensions: Vec2, angle: number): Vec2 {
        const HYPOTENUSE = Math.sqrt((dimensions.x / 2) ** 2 + (dimensions.y / 2) ** 2);
        const INITIAL_ANGLE = Math.atan(dimensions.y / dimensions.x);
        const ANGLE = (angle * Math.PI) / HALF_CIRCLE_IN_DEGREES;

        const ANGLE_1 = INITIAL_ANGLE + ANGLE;
        const ANGLE_2 = Math.PI / 2 - INITIAL_ANGLE + ANGLE;

        return {
            x: Math.abs(2 * HYPOTENUSE * Math.max(Math.cos(ANGLE_1), Math.sin(ANGLE_2))),
            y: Math.abs(2 * HYPOTENUSE * Math.max(Math.sin(ANGLE_1), Math.cos(ANGLE_2))),
        };
    }

    private computeCenter(startCoord: Vec2, dimensions: Vec2): Vec2 {
        return {
            x: startCoord.x + dimensions.x / 2,
            y: startCoord.y + dimensions.y / 2,
        };
    }

    private computeUpperLeftCorner(oldCenter: Vec2, newDimentsions: Vec2): Vec2 {
        return {
            x: oldCenter.x - newDimentsions.x / 2,
            y: oldCenter.y - newDimentsions.y / 2,
        };
    }
}
