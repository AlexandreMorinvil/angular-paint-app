import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

export interface DialogData {
    height: number;
    width: number;
}

@Component({
    selector: 'app-user-guide-modal',
    templateUrl: './user-guide-modal.component.html',
    styleUrls: ['./user-guide-modal.component.scss'],
})
export class UserGuideModalComponent {
    constructor(
        public dialogRef: MatDialogRef<UserGuideModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        d: MatTabsModule,
        dialog: MatDialog,
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}
