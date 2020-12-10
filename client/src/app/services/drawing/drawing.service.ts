import { Injectable } from '@angular/core';
import { GridService } from '@app/services/tools/grid/grid.service';
import { WorkzoneSizeService } from '@app/services/workzone-size-service/workzone-size.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    selectionCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    hasBeenDrawnOnto: boolean;
    shortcutEnable: boolean = true;

    constructor(private workzoneSizeService: WorkzoneSizeService, private gridService: GridService) {}

    resetDrawing(): void {
        this.clearCanvas(this.baseCtx);
        this.clearCanvas(this.previewCtx);
        this.clearCanvas(this.selectionCtx);
        this.baseCtx.fillStyle = '#FFFFFF';
        this.baseCtx.fillRect(0, 0, this.baseCtx.canvas.width, this.baseCtx.canvas.height);
        this.hasBeenDrawnOnto = false;
    }

    resetDrawingWithWarning(): void {
        if (!this.hasBeenDrawnOnto) {
            this.resetDrawing();
        } else if (confirm('Voulez-vous abandonner le dessin en cours?')) {
            this.resetDrawing();
        }
    }

    printCanvas(image: ImageData): void {
        this.clearCanvas(this.baseCtx);
        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.baseCtx.putImageData(image, 0, 0);
    }

    resize(width: number, height: number): void {
        const IMAGE_DATA = this.baseCtx.getImageData(0, 0, this.baseCtx.canvas.width, this.baseCtx.canvas.height);
        this.baseCtx.canvas.width = width;
        this.baseCtx.canvas.height = height;
        this.previewCtx.canvas.width = width;
        this.previewCtx.canvas.height = height;
        this.selectionCtx.canvas.height = height;
        this.selectionCtx.canvas.width = width;
        this.gridService.resize(width, height);
        this.printCanvas(IMAGE_DATA);
        this.workzoneSizeService.updateDrawingZoneDimension({ width, height });
    }

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getGridContex(): CanvasRenderingContext2D {
        return this.gridService.gridCtx;
    }

    getWidth(): number {
        return this.canvas.width;
    }

    getHeight(): number {
        return this.canvas.height;
    }
}
