import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class SaveService {
    imageSource: string;
    constructor(private drawingService: DrawingService, public dialog: MatDialog) {}

    imageSourceWithFilter(filterName: string): string {
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
        const ctx = NEW_CANVAS.getContext('2d') as CanvasRenderingContext2D;

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
        ctx.drawImage(OLD_CANVAS, 0, 0);
        return NEW_CANVAS.toDataURL();
    }

    saveDraw(format: string): void {
        const contex = this.drawingService.baseCtx;
        contex.save();
        contex.globalCompositeOperation = 'destination-over';
        contex.fillStyle = 'white';
        contex.fillRect(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        contex.restore();
        const image = new Image();
        const canvas = this.drawingService.canvas;
        const ctx = this.drawingService.baseCtx;
        const link = document.createElement('a');
        ctx.drawImage(image, 0, 0);
        image.style.display = 'none';
        image.src = canvas.toDataURL();
        if (format === 'jpeg') {
            image.src = canvas.toDataURL('image/jpeg');
        }
        link.download = 'image' + '.' + format;
        this.imageSource = image.src;
    }
}
