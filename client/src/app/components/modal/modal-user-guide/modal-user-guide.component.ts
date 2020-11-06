import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogData } from '@app/classes/dialog-data';

@Component({
    selector: 'app-modal-user-guide',
    templateUrl: './modal-user-guide.component.html',
    styleUrls: ['./modal-user-guide.component.scss'],
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
