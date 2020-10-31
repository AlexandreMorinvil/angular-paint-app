import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    drawLink: string;
    FILTERS: string[];
    currentFilter: string = 'Aucun';

    constructor(private drawingService: DrawingService, public dialog: MatDialog) {
        this.FILTERS = ['aucun', 'blur', 'grayscale', 'sepia', 'saturate', 'invert'];
    }

    applyFilter(filterName: string): void {
        const oldCanvas = this.drawingService.canvas;
        const newCanvas = document.getElementById('export-preview-canvas') as HTMLCanvasElement;
        newCanvas.width = oldCanvas.width;
        newCanvas.height = oldCanvas.height;
        const ctx = newCanvas.getContext('2d');

        if (ctx) {
            switch (filterName) {
                case 'aucun':
                    break;

                case 'blur':
                    ctx.filter = 'blur(10px)';
                    break;

                case 'grayscale':
                    ctx.filter = 'grayscale(100%)';
                    break;

                case 'sepia':
                    ctx.filter = 'sepia(100%)';
                    break;

                case 'saturate':
                    ctx.filter = 'saturate(100%)';
                    break;

                case 'invert':
                    ctx.filter = 'invert(100%)';
                    break;
            }
            ctx.drawImage(oldCanvas, 0, 0);
        }
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
        const ctx = newCanvas.getContext('2d');

        if (ctx) {
            switch (this.currentFilter) {
                case 'aucun':
                    break;

                case 'blur':
                    ctx.filter = 'blur(10px)';
                    break;

                case 'grayscale':
                    ctx.filter = 'grayscale(100%)';
                    break;

                case 'sepia':
                    ctx.filter = 'sepia(100%)';
                    break;

                case 'saturate':
                    ctx.filter = 'saturate(100%)';
                    break;

                case 'invert':
                    ctx.filter = 'invert(100%)';
                    break;
            }
            ctx.drawImage(oldCanvas, 0, 0);
        }
        const link = document.createElement('a');

        // img.style.display = 'none';*/
        link.href = newCanvas.toDataURL();
        this.drawLink = link.href;
        link.download = drawName + format;
        link.click();
    }

    exportDrawOld(drawName: string, format: string): void {
        const contex = this.drawingService.baseCtx;
        contex.save();

        contex.globalCompositeOperation = 'destination-over';
        contex.fillStyle = 'white';
        contex.fillRect(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        contex.restore();
        const img = new Image();
        const canvas = this.drawingService.canvas;
        const ctx = this.drawingService.baseCtx;
        const link = document.createElement('a');
        ctx.drawImage(img, 0, 0);
        img.style.display = 'none';
        link.href = canvas.toDataURL();
        this.drawLink = link.href;
        link.download = drawName + format;
        link.click();
    }
}
