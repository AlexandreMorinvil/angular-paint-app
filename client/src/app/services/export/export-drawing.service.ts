import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ExportDrawingService {
    constructor(private drawingService: DrawingService, public dialog: MatDialog) {}
    saveDrawToPNG(drawName: string): void {
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
        link.download = drawName + '.png';
        link.click();
    }
}
