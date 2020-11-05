import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    drawLink: string;
    FILTERS: string[];
    private currFilter: string;
    private ctx: CanvasRenderingContext2D;

    constructor(private drawingService: DrawingService, public dialog: MatDialog) {
        this.FILTERS = ['aucun', 'blur', 'grayscale', 'sepia', 'saturate', 'invert'];
        this.currentFilter = 'Aucun';
    }

    get currentFilter(): string {
        return this.currFilter;
    }

    set currentFilter(value: string) {
        this.currFilter = value;
    }

    applyFilter(filterName: string): void {
        const oldCanvas = this.drawingService.canvas;
        const newCanvas = document.getElementById('export-preview-canvas') as HTMLCanvasElement;
        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;
        this.ctx = newCanvas.getContext('2d') as CanvasRenderingContext2D;

        switch (filterName) {
            case 'aucun':
                break;

            case 'blur':
                this.ctx.filter = 'blur(10px)';
                break;

            case 'grayscale':
                this.ctx.filter = 'grayscale(100%)';
                break;

            case 'sepia':
                this.ctx.filter = 'sepia(100%)';
                break;

            case 'saturate':
                this.ctx.filter = 'saturate(100%)';
                break;

            case 'invert':
                this.ctx.filter = 'invert(100%)';
                break;
        }
        this.ctx.drawImage(oldCanvas, 0, 0);
    }

    exportDraw(drawName: string, format: string): void {
        const contex = this.drawingService.baseCtx;
        contex.save();

        contex.globalCompositeOperation = 'destination-over';
        contex.fillStyle = 'white';
        contex.fillRect(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        contex.restore();

        const oldCanvas = this.drawingService.canvas;
        const newCanvas = document.createElement('canvas');
        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;
        this.ctx = newCanvas.getContext('2d') as CanvasRenderingContext2D;

        switch (this.currentFilter) {
            case 'aucun':
                break;

            case 'blur':
                this.ctx.filter = 'blur(10px)';
                break;

            case 'grayscale':
                this.ctx.filter = 'grayscale(100%)';
                break;

            case 'sepia':
                this.ctx.filter = 'sepia(100%)';
                break;

            case 'saturate':
                this.ctx.filter = 'saturate(100%)';
                break;

            case 'invert':
                this.ctx.filter = 'invert(100%)';
                break;
        }
        this.ctx.drawImage(oldCanvas, 0, 0);
        this.downloadImage(drawName, format, newCanvas);
    }

    private downloadImage(drawName: string, format: string, newCanvas: HTMLCanvasElement): void {
        const link = document.createElement('a');

        link.href = newCanvas.toDataURL('image/' + format);
        this.drawLink = link.href;
        link.download = drawName + '.' + format;
        link.click();
    }
}
