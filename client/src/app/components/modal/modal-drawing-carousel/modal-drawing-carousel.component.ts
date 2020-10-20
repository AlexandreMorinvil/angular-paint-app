import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '@app/classes/dialog-data';

export interface Tag {
    tagName: string;
}

@Component({
    selector: 'app-modal-drawing-carousel',
    templateUrl: './modal-drawing-carousel.html',
    styleUrls: ['./modal-drawing-carousel.scss'],
})
export class DrawingCarouselComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
