import { Component } from '@angular/core';
import { UserGuideModalService } from '@app/services/user-guide-modal/user-guide-modal.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    constructor(public userGuideModalService: UserGuideModalService) {}

    openNewUserGuide(): void {
        this.userGuideModalService.openUserGuide();
    }
}
