import { Component } from '@angular/core';
import { DrawingCarouselService } from '@app/services/drawing-carousel/drawing-carousel.service';
import { UserGuideModalService } from '@app/services/user-guide-modal/user-guide-modal.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    constructor(private userGuideModalService: UserGuideModalService, private drawingCarouselService: DrawingCarouselService) {}

    openDrawingCarousel(): void {
        this.drawingCarouselService.openDrawingCarouselDialog();
    }

    openUserGuide(): void {
        this.userGuideModalService.openUserGuide();
    }
}
