import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    drawingLink: string;
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
        const OLD_CANVAS = this.drawingService.canvas;
        const NEW_CANVAS = document.getElementById('export-preview-canvas') as HTMLCanvasElement;
        NEW_CANVAS.width = OLD_CANVAS.width;
        NEW_CANVAS.height = OLD_CANVAS.height;
        this.ctx = NEW_CANVAS.getContext('2d') as CanvasRenderingContext2D;

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
        this.ctx.drawImage(OLD_CANVAS, 0, 0);
    }

    exportDraw(drawingName: string, format: string): void {
        const CONTEX = this.drawingService.baseCtx;
        CONTEX.save();

        CONTEX.globalCompositeOperation = 'destination-over';
        CONTEX.fillStyle = 'white';
        CONTEX.fillRect(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        CONTEX.restore();

        const OLD_CANVAS = this.drawingService.canvas;
        const NEW_CANVAS = document.createElement('canvas');
        NEW_CANVAS.width = OLD_CANVAS.width;
        NEW_CANVAS.height = OLD_CANVAS.height;
        this.ctx = NEW_CANVAS.getContext('2d') as CanvasRenderingContext2D;

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
        this.ctx.drawImage(OLD_CANVAS, 0, 0);
        this.downloadImage(drawingName, format, NEW_CANVAS);
    }

    private downloadImage(drawName: string, format: string, newCanvas: HTMLCanvasElement): void {
        const link = document.createElement('a');
        link.href = newCanvas.toDataURL('image/' + format);
        this.drawingLink = link.href;
        link.download = drawName + '.' + format;
        link.click();
    }
}
