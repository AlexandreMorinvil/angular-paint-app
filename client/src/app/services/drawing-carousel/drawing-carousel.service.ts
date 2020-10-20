import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingCarouselComponent } from '@app/components/drawing-carousel/drawing-carousel.component';
// import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingCarouselService {
    constructor(/*private drawingService: DrawingService,*/ public dialog: MatDialog) {}

    openDrawingCarouselDialog(): void {
        // this.drawingService.shortcutEnable = false;
        const dialogRef = this.dialog.open(DrawingCarouselComponent, {
            width: '800px',
            height: '700px',
            data: {},
        });
        dialogRef.afterClosed().subscribe(() => {
            //    this.drawingService.shortcutEnable = true;
        });
    }

    // saveDrawToPNG(drawName: string): void {
    //     const contex = this.drawingService.baseCtx;
    //     contex.save();
    //     contex.globalCompositeOperation = 'destination-over';
    //     contex.fillStyle = 'white';
    //     contex.fillRect(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
    //     contex.restore();
    //     let img = new Image();
    //     const canvas = this.drawingService.canvas;
    //     const ctx = this.drawingService.baseCtx;
    //     const link = document.createElement('a');
    //     ctx.drawImage(img, 0, 0);
    //     img.style.display = 'none';
    //     link.href = canvas.toDataURL();
    //     link.download = drawName + '.png';
    //     link.click();
    // }
}
