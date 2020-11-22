import { AfterViewInit, Component, HostListener, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogData } from '@app/classes/dialog-data';
import { ApiDrawingService } from '@app/services/api/api-drawing/api-drawing.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportDrawingService } from '@app/services/export/export-drawing.service';
import { SaveService } from '@app/services/save/save.service';
import { DrawingToEmail } from '@common/communication/drawing-to-email';

@Component({
    selector: 'app-modal-export',
    templateUrl: './modal-export.component.html',
    styleUrls: ['./modal-export.component.scss'],
})
export class ExportComponent implements AfterViewInit {
    visible: boolean = true;
    drawName: FormControl = new FormControl('', Validators.required);
    email: FormControl = new FormControl('', Validators.required);
    private readonly SUCCESSFUL_CREATION: string = 'Le dessin a été envoyer avec succès';

    constructor(
        private apiDrawingService: ApiDrawingService,
        public exportDrawingService: ExportDrawingService,
        public drawingService: DrawingService,
        public saveService: SaveService,
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

    sendEmailToPNG() {
        //verification du bon format a ajouter
        this.saveImageSRC();
        this.sendEmailToServer('PNG');
    }

    sendEmailToJPG() {
        //verification du bon format a ajouter
        this.saveImageSRC();
        this.sendEmailToServer('JPG');
    }

    saveImageSRC() {
        this.saveService.saveDraw();
    }

    sendEmailToServer(format: string) {
        //verifie bon format de l'email
        if (this.validateEmail(this.email.value) && this.validateValue()) {
            console.log(this.saveService.imageSource);
            const newDrawingToSend: DrawingToEmail = new DrawingToEmail(this.email.value, this.drawName.value, format, this.saveService.imageSource);
            this.apiDrawingService.sendEmail(newDrawingToSend).subscribe(() => {
                alert(this.SUCCESSFUL_CREATION);
            });
        }
    }

    private validateEmail(email: string): boolean {
        const noEmail = '';
        return email != noEmail && email != undefined;
    }
    private validateValue(): boolean {
        return this.validateDrawName(this.drawName.value);
    }

    private validateDrawName(name: string): boolean {
        const noName = '';
        return name !== noName && name != undefined;
    }
}
