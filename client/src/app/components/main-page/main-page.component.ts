import { Component } from '@angular/core';
import { CreateNewDrawingDialogService } from '@app/services/create-new-drawing-dialog/create-new-drawing-dialog.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    constructor(public createNewDrawingDialogService: CreateNewDrawingDialogService) {}

    openUserGuide(): void {
        this.createNewDrawingDialogService.openDialog();
    }
}
