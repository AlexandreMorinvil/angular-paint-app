import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LoadService {
    imageSource: string;
    constructor(private drawingService: DrawingService, public dialog: MatDialog) {}

    loadDraw(imageSrc: string): void {
        const contex = this.drawingService.baseCtx;
        let img = new Image();
        img.src = imageSrc;
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            if (!contex.getImageData(1, 1, contex.canvas.width, contex.canvas.height).data.every((x) => x === 255)) {
                //alert il y a deja un dessin sur le canvas
                contex.drawImage(img, 0, 0);
            } else {
                contex.drawImage(img, 0, 0);
            }
        };
    }
}
