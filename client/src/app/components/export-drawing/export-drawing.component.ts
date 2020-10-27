import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogData } from '../user-guide-modal/user-guide-modal.component';
@Component({
    selector: 'app-export-drawing',
    templateUrl: './export-drawing.component.html',
    styleUrls: ['./export-drawing.component.scss'],
})
export class ExportDrawingComponent {
    visible: boolean = true;
    drawName: FormControl = new FormControl('', Validators.required);
    constructor(
        public exportDrawingService: ExportDrawingService,
        public dialogRef: MatDialogRef<ExportDrawingComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        d: MatTabsModule,
        dialog: MatDialog,
    ) {}

    saveToPNG(): void {
        if (this.validateValue()) {
            (document.getElementById('buttonSavePNG') as HTMLInputElement).disabled = true;
            const drawName = this.drawName.value;
            this.exportDrawingService.saveDrawToPNG(drawName);
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
