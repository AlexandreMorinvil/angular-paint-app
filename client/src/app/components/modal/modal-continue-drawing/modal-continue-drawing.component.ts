import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { DialogData } from '@app/classes/dialog-data';
import { AutoSaveService } from '@app/services/auto-save/auto-save.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Component({
    selector: 'app-modal-continue-drawing',
    templateUrl: './modal-continue-drawing.component.html',
    styleUrls: ['./modal-continue-drawing.component.scss'],
})
export class ContinueDrawingModalComponent implements AfterViewInit {
    @ViewChild('continuedrawingcanvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;
    constructor(
        public dialogRef: MatDialogRef<ContinueDrawingModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        d: MatTabsModule,
        dialog: MatDialog,
        private autoSaveService: AutoSaveService,
        private drawingService: DrawingService,
        private router: Router,
    ) {}

    ngAfterViewInit(): void {
        this.getAutoSavedDrawings();
    }

    getAutoSavedDrawings(): void {
        if (this.autoSaveService.hasSavedDrawing()) {
            const SOURCE = this.autoSaveService.getAutoSavedDrawingURL();
            const CONTEXT = this.canvas.nativeElement.getContext('2d');

            const image = new Image();
            image.onload = () => {
                if (CONTEXT) {
                    this.canvas.nativeElement.width = image.width;
                    this.canvas.nativeElement.height = image.height;
                    CONTEXT.drawImage(image, 0, 0);
                }
            };
            image.src = SOURCE;
        }
    }

    clickedDrawing(): void {
        if (!this.autoSaveService.hasSavedDrawing()) {
            return;
        }
        const SOURCE = this.autoSaveService.getAutoSavedDrawingURL();
        const IMAGE = new Image();
        IMAGE.onload = () => {
            this.drawingService.baseCtx.canvas.width = IMAGE.width;
            this.drawingService.baseCtx.canvas.height = IMAGE.height;

            this.drawingService.previewCtx.canvas.width = IMAGE.width;
            this.drawingService.previewCtx.canvas.height = IMAGE.height;

            this.drawingService.baseCtx.drawImage(IMAGE, 0, 0);
        };
        IMAGE.src = SOURCE;

        this.router.navigate(['/editor']);
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
