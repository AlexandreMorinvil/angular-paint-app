import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogData } from '@app/classes/dialog-data';
import { ApiImageTransferService } from '@app/services/api/image-transfer/api-image-transfer.service';
import { SaveService } from '@app/services/save/save.service';
import { Image } from '@common/communication/image';

export interface Tag {
    name: string;
}

@Component({
    selector: 'app-modal-save',
    templateUrl: './modal-save.component.html',
    styleUrls: ['./modal-save.component.scss'],
})
export class ModalSaveComponent {
    private readonly MAX_LENGHT_TAG = 20;
    private readonly MAX_NUMBER_OF_TAGS = 15;
    private readonly MAX_LENGHT_DRAW_NAME = 20;
    visible: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    tags: Tag[] = [];
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
            this.tags.push({ name: value.trim() });
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

    saveToServer(): void {
        if (this.validateValue()) {
            // code for saving into server image
            //this.saveService.saveDraw();
            this.sendMessageToServer();
            //this.getMessageFromServer();
            (document.getElementById('buttonSaveServer') as HTMLInputElement).disabled = true;
        }
    }

    private validateValue(): boolean {
        return this.validateDrawName(this.drawName.value) && this.validateAllTags(this.tags);
    }

    private validateDrawName(name: string): boolean {
        const noName = '';
        return name !== noName && name != undefined && name.length <= this.MAX_LENGHT_DRAW_NAME && /^[0-9a-zA-Z]*$/g.test(name);
    }

    private validateTag(tag: Tag) {
        const noTag = '';
        return tag.name !== noTag && tag.name.length <= this.MAX_LENGHT_TAG && /^[0-9a-zA-Z]*$/g.test(tag.name);
    }

    private validateAllTags(tags: Tag[]): boolean {
        let validTag = true;
        this.tags.forEach((tag) => {
            validTag = validTag && this.validateTag(tag) && tags.length <= this.MAX_NUMBER_OF_TAGS;
        });
        return validTag;
    }

    sendMessageToServer(): void {
        const NewURLDrawing: Image = {
            name: this.drawName.value,
            image: this.saveService.savedImage,
        };
        this.apiImageTransferService.basicPost(NewURLDrawing).subscribe();
    }

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
