import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AutoSaveService } from '@app/services/auto-save/auto-save.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ModalHandlerService } from '@app/services/modal-handler/modal-handler';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    constructor(
        private modalHandler: ModalHandlerService,
        private autoSaveService: AutoSaveService,
        private drawingService: DrawingService,
        private router: Router,
    ) {}

    openDrawingCarousel(): void {
        this.modalHandler.openDrawingCarouselDialog();
    }

    openUserGuide(): void {
        this.modalHandler.openUserGuide();
    }

    openContinueDrawing(): void {
        const src = this.autoSaveService.getAutoSavedDrawingURL();
        const image = new Image();
        image.onload = () => {
            this.drawingService.baseCtx.canvas.width = image.width;
            this.drawingService.baseCtx.canvas.height = image.height;

            this.drawingService.previewCtx.canvas.width = image.width;
            this.drawingService.previewCtx.canvas.height = image.height;

            this.drawingService.baseCtx.drawImage(image, 0, 0);
        };
        image.src = src;

        this.router.navigate(['/editor']);
    }

    hasSavedDrawing(): boolean {
        return this.autoSaveService.hasSavedDrawing();
    }
}
