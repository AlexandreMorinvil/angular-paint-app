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
        // If the object doesn't contain an image
        if (imageSrc === 'assets/images/nothing.png') {
            alert("Il n'y a pas de dessin ! Veuillez en choisir un autre");
            return;
        }

        const base = this.drawingService.baseCtx;
        const preview = this.drawingService.previewCtx;
        console.log(imageSrc);
        let img = new Image();
        img.src = imageSrc;
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            if (!base.getImageData(1, 1, base.canvas.width - 1, base.canvas.height - 1).data.every((x) => x === 255)) {
                if (confirm('Attention ! Il y a déja un dessin sur le canvas. Voulez-vous continuer ?')) {
                    base.canvas.width = img.width;
                    base.canvas.height = img.height;
                    preview.canvas.width = img.width;
                    preview.canvas.height = img.height;
                    base.drawImage(img, 0, 0);
                }
            } else {
                base.canvas.width = img.width;
                base.canvas.height = img.height;
                preview.canvas.width = img.width;
                preview.canvas.height = img.height;
                base.drawImage(img, 0, 0);
            }
        };
    }
}
