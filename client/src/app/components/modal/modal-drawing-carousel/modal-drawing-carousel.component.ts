import { Component, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '@app/classes/dialog-data';
//import { MatChipInputEvent } from '@angular/material/chips';
import { RemoteMemoryService } from '@app/services/remote-memory/remote-memory.service.ts';
import { Drawing } from '@common/schema/drawing';
import { FILE_SERVER_BASE_URL } from '@app/services/api/drawing/api-drawing.service';

export interface Tag {
    tagName: string;
}

@Component({
    selector: 'app-modal-drawing-carousel',
    templateUrl: './modal-drawing-carousel.html',
    styleUrls: ['./modal-drawing-carousel.scss'],
})
export class DrawingCarouselComponent {
    private currentImages: Drawing[] = [];
    visible: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    tags: Tag[] = [];

    constructor(public memoryService: RemoteMemoryService, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        this.memoryService.getAllFromDatabase();
        this.currentImages.push(new Drawing());
        this.currentImages.push(new Drawing());
        this.currentImages.push(new Drawing());
    }

    getCurrentImages(): Drawing[] {
        return this.currentImages;
    }

    // add(event: MatChipInputEvent): void {
    //     const input = event.input;
    //     const value = event.value;

    //     // Add the tag
    //     if ((value || '').trim()) {
    //         this.tags.push({ tagName: value.trim() });
    //     }

    //     // Reset the input value
    //     if (input) {
    //         input.value = '';
    //     }
    // }

    // remove(tag: Tag): void {
    //     const index = this.tags.indexOf(tag);

    //     if (index >= 0) {
    //         this.tags.splice(index, 1);
    //     }
    // }

    getDrawingUrl(drawing: Drawing) {
        if (!drawing.name) return 'assets/images/nothing.png';
        return FILE_SERVER_BASE_URL + 'home_icon.png';
    }

    movePrevious(slides: string[], i: number) {}

    moveNext(slides: string[], i: number) {}
}
