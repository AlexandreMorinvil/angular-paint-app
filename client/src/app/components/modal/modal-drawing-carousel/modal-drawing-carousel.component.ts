import { Component, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '@app/classes/dialog-data';
import { MatChipInputEvent } from '@angular/material/chips';

export interface Tag {
    tagName: string;
}

@Component({
    selector: 'app-modal-drawing-carousel',
    templateUrl: './modal-drawing-carousel.html',
    styleUrls: ['./modal-drawing-carousel.scss'],
})
export class DrawingCarouselComponent {
    visible: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    tags: Tag[] = [];
    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

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

}
