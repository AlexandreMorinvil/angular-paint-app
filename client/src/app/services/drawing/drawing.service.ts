import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    hasBeenDrawnOnto: boolean;

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

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
