import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LoadService {
    constructor(private drawingService: DrawingService, public dialog: MatDialog) {}
    private img : HTMLImageElement;
    private base: CanvasRenderingContext2D;
    private preview : CanvasRenderingContext2D;



    loadDraw(imageSrc: string): void {
        // If the object doesn't contain an image
        if (imageSrc === 'assets/images/nothing.png') {
            alert("Il n'y a pas de dessin ! Veuillez en choisir un autre");
            return;
        }
        this.base = this.drawingService.baseCtx;
        this.preview = this.drawingService.previewCtx;
        this.img = new Image();
        this.img.src = imageSrc;
        this.img.crossOrigin = 'Anonymous';
        this.img.onload = () => this.fillDraw();
    }

    fillDraw(): void {
        const whiteRGB = 255;
        if (!this.base.getImageData(1, 1, this.base.canvas.width - 1, this.base.canvas.height - 1).data.every((x) => x === whiteRGB)) {
            if (confirm('Attention ! Il y a déja un dessin sur le canvas. Voulez-vous continuer ?')) {
                this.modifyCanvas()
            }
        } else {
          this.modifyCanvas()
        }
    }

    modifyCanvas(){
      this.base.canvas.width = this.img.width;
      this.base.canvas.height = this.img.height;
      this.preview.canvas.width = this.img.width;
      this.preview.canvas.height = this.img.height;
      this.base.drawImage(this.img, 0, 0);
      this.dialog.closeAll();
    }


}
