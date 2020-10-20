import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '@app/components/user-guide-modal/user-guide-modal.component';

export interface Tag {
    tagName: string;
}

@Component({
    selector: 'app-drawing-carousel',
    templateUrl: './drawing-carousel.html',
    styleUrls: ['./drawing-carousel.scss'],
})
export class DrawingCarouselComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
