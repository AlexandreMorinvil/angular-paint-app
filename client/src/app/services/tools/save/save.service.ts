import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Description } from '@app/classes/description';
import { SaveComponent } from '@app/components/save/save.component';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class SaveService {
    constructor(private drawingService: DrawingService, public dialog: MatDialog) {
        new Description('Sauvegarde', 'Ctrl+S', 'save_icon.png');
    }

    openSaveDialog(): void {
        console.log('A');
        this.drawingService.shortcutEnable = false; //to disable other command on save dialog open
        const dialogRef = this.dialog.open(SaveComponent, {
            width: '600px',
            height: '500px',
            data: {},
        });
        dialogRef.afterClosed().subscribe((value) => {
            this.drawingService.shortcutEnable = true; //to enable other command on save dialog close
        });
    }

    saveDrawToPNG(drawName: string): void {
        const contex = this.drawingService.baseCtx;
        contex.save();
        contex.globalCompositeOperation = 'destination-over';
        contex.fillStyle = 'white';
        contex.fillRect(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        contex.restore();
        let img = new Image();
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
