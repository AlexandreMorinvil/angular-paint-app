import { Component } from '@angular/core';
import { AutoSaveService } from '@app/services/auto-save/auto-save.service';
import { ModalHandlerService } from '@app/services/modal-handler/modal-handler';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    constructor(private modalHandler: ModalHandlerService, private autoSaveService: AutoSaveService) {}

    openDrawingCarousel(): void {
        this.modalHandler.openDrawingCarouselDialog();
    }

    openUserGuide(): void {
        this.modalHandler.openUserGuide();
    }

    openContinueDrawing(): void {
        this.modalHandler.openContinueDrawingDialog();
    }

    hasSavedDrawing(): boolean {
        return this.autoSaveService.hasSavedDrawing();
    }
}
