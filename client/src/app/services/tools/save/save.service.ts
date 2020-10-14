import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { SaveComponent } from '@app/components/save/save.component';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class SaveService extends Tool {
    constructor(drawingService: DrawingService, public dialog: MatDialog) {
        super(drawingService, new Description('Sauvegarde', 'Ctrl+S', 'save_icon.png'));
    }

    openSaveDialog(): void {
        const dialogRef = this.dialog.open(SaveComponent, {
            width: '600px',
            height: '500px',
            data: {},
        });

        dialogRef.afterClosed();
    }

    onCtrlS(name: string): void {
        const canvas = this.drawingService.canvas;
        const a = document.createElement('a');
        a.href = canvas.toDataURL();
        console.log(name);
        a.download = name + '.png';
        a.click();
    }
}
