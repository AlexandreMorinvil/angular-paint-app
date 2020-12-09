import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

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

    memorize(startCoord: Vec2, dimension: Vec2): void {
        this.startCoord.x = startCoord.x;
        this.startCoord.y = startCoord.y;
        this.canvas.width = dimension.x;
        this.canvas.height = dimension.y;
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
}
