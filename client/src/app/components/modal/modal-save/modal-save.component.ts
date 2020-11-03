import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogData } from '@app/classes/dialog-data';
import { ApiImageTransferService } from '@app/services/api/image-transfer/api-image-transfer.service';
import { SaveService } from '@app/services/save/save.service';
import { Drawing } from '@common/communication/drawing';

@Component({
    selector: 'app-modal-save',
    templateUrl: './modal-save.component.html',
    styleUrls: ['./modal-save.component.scss'],
})
export class ModalSaveComponent {
    private readonly MAX_NUMBER_OF_TAGS: number = 15;
    private readonly MAX_LENGHT_DRAW_NAME: number = 50;
    private readonly MAX_LENGHT_NAME_TAG: number = 25;
    // private readonly ERROR_NO_DRAWING_NAME = 'Les dessins doivent contenir un nom';
    // private readonly ERROR_NUMBER_TAG_GREATER_MAXIMUM = 'Le nombre détiquettes est supérieur à la limite de 15';
    // private readonly ERROR_NO_TAG_NAME = 'Les étiquettes assignées ne peuvent pas être vides';
    // private readonly ERROR_MAX_LENGTH_NAME_TAG = 'Les étiquettes des dessions doivent contenir un maximum de 25 caractères';
    // private readonly ERROR_NO_IMAGE_SOURCE = 'Le dessin a pas une image source';
    // private readonly ERROR_MAX_LENGTH_NAME_DRAWING = 'Les noms des dessions doivent contenir un maximum de 50 caractères';
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    tags: string[] = [];
    drawName: FormControl = new FormControl('', Validators.required);
    constructor(
        public dialogRef: MatDialogRef<ModalSaveComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        d: MatTabsModule,
        dialog: MatDialog,
        public saveService: SaveService,
        private apiImageTransferService: ApiImageTransferService,
    ) {}

    add(event: MatChipInputEvent): void {
        const input: HTMLInputElement = event.input;
        const value: string = event.value;

        // Add the tag
        if ((value || '').trim() && this.validateTag(value)) {
            this.tags.push(value.trim());
        }

        // Reset the input value
        input.value = '';
    }

    remove(tag: string): void {
        const index = this.tags.indexOf(tag);

        if (index >= 0 && this.tags.length > 0 && index < this.tags.length) {
            this.tags.splice(index, 1);
        }
    }

    saveToServer(): void {
        console.log(this.saveService.imageSource);
        if (this.validateValue(this.drawName.value, this.tags, this.saveService.imageSource)) {
            this.saveService.saveDraw();
            this.sendMessageToServer();
            (document.getElementById('buttonSaveServer') as HTMLInputElement).disabled = true;
        }
    }

    private validateValue(name: string, tags: string[], imageSource: string): boolean {
        return this.validateDrawName(name) && this.validateAllTags(tags) && this.validateImageSRC(imageSource);
    }

    private validateDrawName(name: string): boolean {
        const noName = '';
        return name !== noName && name.length <= this.MAX_LENGHT_DRAW_NAME && /^[0-9a-zA-Z]*$/g.test(name);
    }

    private validateTag(tag: string): boolean {
        return tag !== '' && tag.length <= this.MAX_LENGHT_NAME_TAG && /^[0-9a-zA-Z]*$/g.test(tag);
    }

    private validateImageSRC(imageSrc: string): boolean {
        return imageSrc !== '';
    }

    private validateAllTags(tags: string[]): boolean {
        let validTag = true;
        tags.forEach((tag) => {
            validTag = validTag && this.validateTag(tag);
        });
        if (tags.length > this.MAX_NUMBER_OF_TAGS) {
            validTag = false;
        }
        return validTag;
    }

    sendMessageToServer(): void {
        const newDrawingToSend: Drawing = {
            _id: '',
            name: this.drawName.value,
            tags: this.tags,
            imageSrc: this.saveService.imageSource,
        };
        this.apiImageTransferService.basicPost(newDrawingToSend).subscribe();
    }
}
