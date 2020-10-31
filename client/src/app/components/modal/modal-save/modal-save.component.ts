import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogData } from '@app/classes/dialog-data';
import { ApiImageTransferService } from '@app/services/api/image-transfer/api-image-transfer.service';
import { SaveService } from '@app/services/save/save.service';
import { Drawing } from '@common/schema/drawing';

@Component({
    selector: 'app-modal-save',
    templateUrl: './modal-save.component.html',
    styleUrls: ['./modal-save.component.scss'],
})
export class ModalSaveComponent {
    private readonly MAX_NUMBER_OF_TAGS = 15;
    private readonly MAX_LENGHT_DRAW_NAME = 50;
    private readonly MAX_LENGHT_NAME_TAG = 25;
    private readonly ERROR_NO_DRAWING_NAME = 'Les dessins doivent contenir un nom';
    private readonly ERROR_NO_TAG = 'Un dessin doit contenir au moins un tag';
    private readonly ERROR_NUMBER_TAG_GREATER_MAXIMUM = 'Le nombre détiquettes est supérieur à la limite de 15';
    private readonly ERROR_NO_TAG_NAME = 'Les étiquettes assignées ne peuvent pas être vides';
    private readonly ERROR_MAX_LENGTH_NAME_TAG = 'Les étiquettes des dessions doivent contenir un maximum de 25 caractères';
    private readonly ERROR_NO_IMAGE_SOURCE = 'Le dessin a pas une image source';
    private readonly ERROR_MAX_LENGTH_NAME_DRAWING = 'Les noms des dessions doivent contenir un maximum de 50 caractères';
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    tags: string[] = [];
    drawName: FormControl = new FormControl('', Validators.required);

    constructor(
        private apiImageTransferService: ApiImageTransferService,
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
            this.tags.push(value.trim());
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    remove(tag: string): void {
        const index = this.tags.indexOf(tag);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }

    saveToServer(): void {
        if (this.validateValue()) {
            this.saveService.saveDraw();
            this.sendMessageToServer();
            (document.getElementById('buttonSaveServer') as HTMLInputElement).disabled = true;
        }
    }

    private validateValue(): boolean {
        return this.validateDrawName(this.drawName.value) && this.validateAllTags(this.tags) && this.validateImageSRC(this.saveService.imageSource);
    }

    private validateDrawName(name: string): boolean {
        const noName = '';
        if (name == undefined || name == noName) {
            console.log(this.ERROR_NO_DRAWING_NAME);
        }
        if (name.length > this.MAX_LENGHT_DRAW_NAME) {
            console.log(this.ERROR_MAX_LENGTH_NAME_DRAWING);
        }
        if (name !== noName && name != undefined && name.length <= this.MAX_LENGHT_DRAW_NAME && /^[0-9a-zA-Z]*$/g.test(name)) {
            return true;
        }
        return false;
    }

    private validateTag(tag: string) {
        const noTag = '';
        if (tag === noTag) {
            console.log(this.ERROR_NO_TAG_NAME);
        }
        if (tag.length > this.MAX_LENGHT_NAME_TAG) {
            this.ERROR_MAX_LENGTH_NAME_TAG;
        }
        if (tag.length != 0) {
            this.ERROR_NO_TAG_NAME;
        }
        return tag !== noTag && tag.length != 0 && tag.length <= this.MAX_LENGHT_NAME_TAG && /^[0-9a-zA-Z]*$/g.test(tag);
    }

    private validateImageSRC(imageSrc: string): boolean {
        const noImage = '';
        if (imageSrc != noImage) {
            return true;
        }
        console.log(this.ERROR_NO_IMAGE_SOURCE);
        return false;
    }

    private validateAllTags(tags: string[]): boolean {
        let validTag = true;
        this.tags.forEach((tag) => {
            if (tags.length > this.MAX_NUMBER_OF_TAGS) {
                console.log(this.ERROR_NUMBER_TAG_GREATER_MAXIMUM);
            }
            validTag = validTag && this.validateTag(tag) && tags.length <= this.MAX_NUMBER_OF_TAGS;
        });
        if (tags.length === 0) {
            console.log(this.ERROR_NO_TAG);
            validTag = false;
        }
        return validTag;
    }

    sendMessageToServer(): void {
        const NewURLDrawing: Drawing = {
            name: this.drawName.value,
            tags: this.tags,
            imageSrc: this.saveService.imageSource,
        };
        this.apiImageTransferService.basicPost(NewURLDrawing).subscribe();
    }
    /*Fonction utile pour recevoir linfo du serveur*/
    /*getMessageFromServer(): void {
        this.apiImageTransferService
            .basicGet()

            .pipe(
                map((drawing: Image) => {
                    return '${drawing.name}${drawing.image}';
                }),
            );
    }*/
}
