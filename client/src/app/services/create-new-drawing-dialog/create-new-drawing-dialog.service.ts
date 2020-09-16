import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewDrawingDialogComponent } from '@app/components/create-new-drawing-dialog/create-new-drawing-dialog.component';

@Injectable({
    providedIn: 'root',
})
export class CreateNewDrawingDialogService {
    animal: string;
    name: string;
    constructor(public dialog: MatDialog) {}

    openDialog(): void {
        const dialogRef = this.dialog.open(CreateNewDrawingDialogComponent, {
            width: '500px',
            height: '400px',
            data: { name: this.name, animal: this.animal },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');
            this.animal = result;
        });
    }
}
