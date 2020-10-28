import { Component, Inject } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '@app/classes/dialog-data';
import { MatChipInputEvent } from '@angular/material/chips';
import { RemoteMemoryService } from '@app/services/remote-memory/remote-memory.service.ts'

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


    constructor(
        public memoryService : RemoteMemoryService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

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

    getDrawingImage(name: string){

    }

    public slides: string [] = ['./assets/SBI_Slide_1.jpg', './assets/Eagle_Slide_2.jpg', './assets/Knot_Slide_3.jpg' ]
    i: number;


    showSlide(slides: string [], i: number) {
        let slide = slides[i];
        return slide;
    }

    getPrev(slides: string [], i: number) {
        this.i = this.i - 1;
        this.showSlide(slides, i)
    }

    getNext(slides: string [], i: number) {
        this.i = this.i + 1;
        this.showSlide(slides, i)
    }



    ngOnInit() {
      this.i = 1;
      this.memoryService.getAllFromDatabase();
    }
}
