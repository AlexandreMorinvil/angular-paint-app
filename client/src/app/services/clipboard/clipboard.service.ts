import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ClipBoardService {
    clipboardCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    private image: HTMLImageElement;

    constructor(private drawingService: DrawingService) {}

    memorize(startCoord: Vec2, dimension: Vec2): void {
        this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
        this.clearClipboard();
        this.canvas.width = dimension.x;
        this.canvas.height = dimension.y;
        this.clipboardCtx.drawImage(this.image, startCoord.x, startCoord.y, dimension.x, dimension.y, 0, 0, dimension.x, dimension.y);
    }

    provide(): void {}

    private clearClipboard() {
        this.clipboardCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
