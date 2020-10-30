import { Injectable } from '@angular/core';
import { WorkzoneSizeService } from '../workzone-size-service/workzone-size.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    hasBeenDrawnOnto: boolean;
    shortcutEnable: boolean = true;

    constructor(private workzoneSizeService: WorkzoneSizeService) {}

    resetDrawing(): void {
        this.clearCanvas(this.baseCtx);
        this.clearCanvas(this.previewCtx);
        this.hasBeenDrawnOnto = false;
    }

    resetDrawingWithWarning(): void {
        if (!this.hasBeenDrawnOnto) {
            this.resetDrawing();
        } else if (confirm('Voulez-vous abandonner le dessin en cours?')) {
            this.resetDrawing();
        }
    }

    printCanvas(image: ImageData) {
        this.clearCanvas(this.baseCtx);
        // this.baseCtx.globalCompositeOperation = 'destination-over';
        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.baseCtx.putImageData(image, 0, 0);
    }

    resize(width: number, height: number) {
        const imageData = this.baseCtx.getImageData(
            0,
            0,
            this.baseCtx.canvas.width,
            this.baseCtx.canvas.height,
        );
        this.baseCtx.canvas.width = width;
        this.baseCtx.canvas.height = height;
        this.previewCtx.canvas.width = width;
        this.previewCtx.canvas.height = height;
        this.baseCtx.putImageData(imageData, 0, 0);
        this.workzoneSizeService.updateDrawingZoneDimension({ width: width, height: height });
    }

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getWidth(): number {
        return this.canvas.width;
    }

    getHeight(): number {
        return this.canvas.height;
    }
}
