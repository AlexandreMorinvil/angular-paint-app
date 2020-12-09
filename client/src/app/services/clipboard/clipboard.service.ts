import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ClipBoardService {
    clipboardCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    
    private image: HTMLImageElement;
    private width: number;
    private height: number;

    constructor(private drawingService: DrawingService) {
        this.image = new Image();
    }

    memorize(image: HTMLImageElement, startCoord: Vec2, dimension: Vec2): void {
        this.image.src = this.drawingService.previewCtx.canvas.toDataURL();
        this.height = dimension.x;
        this.width = dimension.y;
        // this.image = image;
        // this.clearClipboard();
        // this.canvas.width = dimension.x;
        // this.canvas.height = dimension.y;
        // this.clipboardCtx.drawImage(this.image, startCoord.x, startCoord.y, dimension.x, dimension.y, 0, 0, dimension.x, dimension.y);
    }

    getHeight(): number {
        return this.height;
    }

    getWidth(): number {
        return this.width;
    }

    provide(): HTMLImageElement {
        return this.image;
    }

    // private clearClipboard(): void {
    //     this.clipboardCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // }
}
