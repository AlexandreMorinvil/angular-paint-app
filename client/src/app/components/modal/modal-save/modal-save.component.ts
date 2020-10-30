import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogData } from '@app/classes/dialog-data';
import { SaveService } from '@app/services/save/save.service';

export interface Tag {
    tagName: string;
}

@Component({
    selector: 'app-modal-save',
    templateUrl: './modal-save.component.html',
    styleUrls: ['./modal-save.component.scss'],
})
export class ModalSaveComponent {
    // private alreadySavePNG = false;
    // private alreadySaveServer = false;
    visible: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    tags: Tag[] = [];
    drawName: FormControl = new FormControl('', Validators.required);
    constructor(
        public saveService: SaveService,
        public dialogRef: MatDialogRef<ModalSaveComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        d: MatTabsModule,
        dialog: MatDialog,
    ) {}

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add the tag
        if ((value || '').trim()) {
            this.tags.push({ tagName: value.trim() });
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    remove(tag: Tag): void {
        const index = this.tags.indexOf(tag);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }

    saveToPNG(): void {
        if (this.validateValue()) {
            (document.getElementById('buttonSavePNG') as HTMLInputElement).disabled = true;
            const drawName = this.drawName.value;
            this.saveService.saveDrawToPNG(drawName);
        }
    }

    saveToServer(): void {
        if (this.validateValue()) {
            // code for saving into server image
            (document.getElementById('buttonSaveServer') as HTMLInputElement).disabled = true;
        }
    }

    validateValue(): boolean {
        const noName = '';
        if (this.drawName.value === noName) {
            return false;
        }
        return true;
    }
}
