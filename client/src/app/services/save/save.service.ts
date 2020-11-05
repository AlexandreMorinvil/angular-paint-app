import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class SaveService {
    imageSource: string;
    constructor(private drawingService: DrawingService, public dialog: MatDialog) {}

    saveDraw(): void {
        const contex = this.drawingService.baseCtx;
        contex.save();
        contex.globalCompositeOperation = 'source-over';
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
        link.download = 'image' + '.png';
        this.imageSource = image.src;
    }
}
