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
    drawingName: FormControl = new FormControl('', Validators.required);
    email: FormControl = new FormControl('', Validators.required);
    private readonly SUCCESSFUL_CREATION: string = 'Le dessin a �t� envoyer avec succ�s';
    private readonly VALIDATE_EMAIL_CHAR: string = '@';
    private readonly EMAIL_INVALID_ERROR: string = "L'émail est invalide";

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
            const drawingName = this.drawingName.value;
            const format = 'png';
            this.exportDrawingService.exportDraw(drawingName, format);
        }
    }
    exportToJPG(): void {
        if (this.validateValue()) {
            const drawingName = this.drawingName.value;
            const format = 'jpeg';
            this.exportDrawingService.exportDraw(drawingName, format);
        }
    }

    sendEmailToPNG(): void {
        this.saveImageSRC('png');
        let sourceBase64 = this.saveService.imageSourceWithFilter(this.exportDrawingService.currentFilter).replace('data:image/png;base64,', '');
        sourceBase64 = sourceBase64.split(/\s/).join('');
        // tslint:disable-next-line: no-magic-numbers
        const firstPNGnumber = sourceBase64.substring(0, 11);
        if (firstPNGnumber === 'iVBORw0KGgo') {
            // png start with 89 50 4E 47 0D 0A 1A 0A
            this.sendEmailToServer('png');
        }
    }

    sendEmailToJPG(): void {
        this.saveImageSRC('jpeg');
        let sourceBase64 = this.saveService.imageSourceWithFilter(this.exportDrawingService.currentFilter).replace('data:image/png;base64,', '');
        sourceBase64 = sourceBase64.split(/\s/).join('');
        // tslint:disable-next-line: no-magic-numbers
        const firstJPGnumber = sourceBase64.substring(0, 16);
        if (firstJPGnumber === '/9j/4AAQSkZJRgAB') {
            // format jpeg start with FF D8 FF E0 00 10 4A 46 49 46 00 01
            this.sendEmailToServer('jpeg');
        }
    }

    saveImageSRC(format: string): void {
        this.saveService.saveDraw(format);
    }

    sendEmailToServer(format: string): void {
        // verifie bon format de l'email
        if (this.validateEmail(this.email.value) && this.validateValue()) {
            const newDrawingToSend: DrawingToEmail = new DrawingToEmail(
                this.email.value,
                this.drawingName.value,
                format,
                this.saveService.imageSourceWithFilter(this.exportDrawingService.currentFilter),
            );
            this.apiDrawingService.sendEmail(newDrawingToSend).subscribe(() => {
                alert(this.SUCCESSFUL_CREATION);
            });
        }
    }

    private validateEmail(email: string): boolean {
        const NO_EMAIL = '';
        const VALID_EMAIL: boolean = email.includes(this.VALIDATE_EMAIL_CHAR);
        if (!VALID_EMAIL) {
            alert(this.EMAIL_INVALID_ERROR);
            return false;
        }
        return email !== NO_EMAIL && email !== undefined;
    }
    private validateValue(): boolean {
        return this.validateDrawName(this.drawingName.value);
    }

    private validateDrawName(name: string): boolean {
        const noName = '';
        return name !== noName && name != undefined;
    }
}
