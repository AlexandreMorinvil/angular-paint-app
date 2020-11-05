import { AfterViewInit, Component, HostListener, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogData } from '@app/classes/dialog-data';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportDrawingService } from '@app/services/export/export-drawing.service';

@Component({
    selector: 'app-modal-export',
    templateUrl: './modal-export.component.html',
    styleUrls: ['./modal-export.component.scss'],
})
export class ExportComponent implements AfterViewInit {
    visible: boolean = true;
    drawName: FormControl = new FormControl('', Validators.required);
    constructor(
        public exportDrawingService: ExportDrawingService,
        public drawingService: DrawingService,
        public dialogRef: MatDialogRef<ExportComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        d: MatTabsModule,
        dialog: MatDialog,
    ) {}

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.ctrlKey && event.key.toLowerCase() === 'e') {
            event.preventDefault(); // to prevent key of windows
        }
    }

    ngAfterViewInit(): void {
        this.exportDrawingService.applyFilter('Aucun');
    }

    applyFilter(currentFilter: string): void {
        this.exportDrawingService.applyFilter(this.exportDrawingService.currentFilter);
    }

    exportToPNG(): void {
        if (this.validateValue()) {
            const drawName = this.drawName.value;
            const format = 'png';
            this.exportDrawingService.exportDraw(drawName, format);
        }
    }
    exportToJPG(): void {
        if (this.validateValue()) {
            const drawName = this.drawName.value;
            const format = 'jpeg';
            this.exportDrawingService.exportDraw(drawName, format);
        }
    }
    private validateValue(): boolean {
        return this.validateDrawName(this.drawName.value);
    }

    private validateDrawName(name: string): boolean {
        const noName = '';
        return name !== noName && name != undefined;
    }
}
