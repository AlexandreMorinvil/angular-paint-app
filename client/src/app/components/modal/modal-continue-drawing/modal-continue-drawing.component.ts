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
            const src = this.autoSaveService.getAutoSavedDrawingURL();

            const ctx = this.canvas.nativeElement.getContext('2d');

            const image = new Image();
            image.onload = () => {
                if (ctx) {
                    this.canvas.nativeElement.width = image.width;
                    this.canvas.nativeElement.height = image.height;
                    ctx.drawImage(image, 0, 0);
                }
            };
            image.src = src;
        }
    }

    clickedDrawing(): void {
        if (!this.autoSaveService.hasSavedDrawing()) {
            return;
        }
        const src = this.autoSaveService.getAutoSavedDrawingURL();
        const image = new Image();
        image.onload = () => {
            this.drawingService.baseCtx.canvas.width = image.width;
            this.drawingService.baseCtx.canvas.height = image.height;

            this.drawingService.previewCtx.canvas.width = image.width;
            this.drawingService.previewCtx.canvas.height = image.height;

            this.drawingService.baseCtx.drawImage(image, 0, 0);
        };
        image.src = src;

        this.router.navigate(['/editor']);
        this.dialogRef.close();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
