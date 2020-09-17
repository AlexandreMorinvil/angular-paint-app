import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewDrawingDialogComponent } from '@app/components/create-new-drawing-dialog/create-new-drawing-dialog.component';

@Injectable({
    providedIn: 'root',
})
export class CreateNewDrawingDialogService {
    height: number = 250; // should be working zone dimensions
    width: number = 250; // should be working zone dimensions

    constructor(public dialog: MatDialog) {}

    openDialog(): void {
        const dialogRef = this.dialog.open(CreateNewDrawingDialogComponent, {
            width: '500px',
            height: '600px',
            data: { height: this.height, width: this.width },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
        });
    }
}
