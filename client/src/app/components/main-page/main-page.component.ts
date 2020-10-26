import { Component } from '@angular/core';
import { ModalHandlerService } from '@app/services/modal-handler/modal-handler';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    constructor(private modalHandler: ModalHandlerService) {}

    openUserGuide(): void {
        this.modalHandler.openUserGuide();
    }
}
