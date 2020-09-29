import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserGuideModalComponent } from '@app/components/user-guide-modal/user-guide-modal.component';

@Injectable({
    providedIn: 'root',
})
export class UserGuideModalService {
    constructor(public dialog: MatDialog) {}

    openUserGuide(): void {
        const dialogRef = this.dialog.open(UserGuideModalComponent, {
            width: '800px',
            height: '600px',
            data: {},
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
        });
    }
}
