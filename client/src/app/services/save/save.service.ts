import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class SaveService {
    imageSource: string;
    constructor(private drawingService: DrawingService, public dialog: MatDialog) {}

<<<<<<< HEAD
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
        if (format == 'jpeg') {
            image.src = canvas.toDataURL('image/jpeg');
        }
        link.download = 'image' + '.' + format;
        this.imageSource = image.src;
=======
    saveDraw(): void {
        const CONTEXT = this.drawingService.baseCtx;
        CONTEXT.save();
        CONTEXT.globalCompositeOperation = 'destination-over';
        CONTEXT.fillStyle = 'white';
        CONTEXT.fillRect(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        CONTEXT.restore();
        const IMAGE = new Image();
        const CANVAS = this.drawingService.canvas;
        const LINK = document.createElement('a');
        CONTEXT.drawImage(IMAGE, 0, 0);
        IMAGE.style.display = 'none';
        IMAGE.src = CANVAS.toDataURL();
        LINK.download = 'image' + '.png';
        this.imageSource = IMAGE.src;
>>>>>>> integration/development
    }
}
