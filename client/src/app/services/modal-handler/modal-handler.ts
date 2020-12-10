import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DrawingCarouselComponent } from '@app/components/modal/modal-drawing-carousel/modal-drawing-carousel.component';
import { ExportComponent } from '@app/components/modal/modal-export/modal-export.component';
import { ModalSaveComponent } from '@app/components/modal/modal-save/modal-save.component';
import { UserGuideModalComponent } from '@app/components/modal/modal-user-guide/modal-user-guide.component';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class ModalHandlerService {
    constructor(private drawingService: DrawingService, public dialog: MatDialog) {}

    openDrawingCarouselDialog(): void {
        this.drawingService.shortcutEnable = false;
        const dialogRef = this.dialog.open(DrawingCarouselComponent, {
            width: '800px',
            height: '800px',
            data: {},
        });
        dialogRef.afterClosed().subscribe(() => {
            this.drawingService.shortcutEnable = true;
        });
    }

    openSaveDialog(): void {
        this.drawingService.shortcutEnable = false; // to disable other command on save dialog open
        const dialogRef = this.dialog.open(ModalSaveComponent, {
            width: '600px',
            height: '500px',
            data: {},
        });
        dialogRef.afterClosed().subscribe((value) => {
            this.drawingService.shortcutEnable = true; // to enable other command on save dialog close
        });
    }

    openExportDialog(): void {
        this.drawingService.shortcutEnable = false; // to disable other command on export dialog open
        const dialogRef = this.dialog.open(ExportComponent, {
            width: '800px',
            height: '650px',
            data: {},
        });
        dialogRef.afterClosed().subscribe((value) => {
            this.drawingService.shortcutEnable = true; // to enable other command on save dialog close
        });
    }

    openUserGuide(): void {
        this.drawingService.shortcutEnable = false;
        const dialogRef = this.dialog.open(UserGuideModalComponent, {
            width: '1000px',
            height: '800px',
            data: {},
        });
        dialogRef.afterClosed().subscribe((value) => {
            this.drawingService.shortcutEnable = true; // to enable other command on save dialog close
        });
    }
}
