import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, HostListener, Inject } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '@app/classes/dialog-data';
import { FILE_SERVER_BASE_URL } from '@app/services/api/api-drawing/api-drawing.service';
import { RemoteMemoryService } from '@app/services/remote-memory/remote-memory.service.ts';
import { Tag, TagFilter } from '@app/services/tag-filter/tag-filter.service';
import { DrawingToDatabase } from '@common/communication/drawingtodatabase';

enum PurposeofClick {
    Delete,
    Load,
}

@Component({
    selector: 'app-modal-drawing-carousel',
    templateUrl: './modal-drawing-carousel.html',
    styleUrls: ['./modal-drawing-carousel.scss'],
})
export class DrawingCarouselComponent {
    private currentDrawings: DrawingToDatabase[] = [];
    private currentActivesIndexes: number[];
    private drawingSelectedPurpose: PurposeofClick = PurposeofClick.Load;
    visible: boolean = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(public memoryService: RemoteMemoryService, public tagFilterService: TagFilter, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        this.memoryService.getAllFromDatabase();
        this.tagFilterService.filterByTag(this.memoryService.drawingsFromDatabase);
        this.setCurrentImages();
    }

    getCurrentDrawings(): DrawingToDatabase[] {
        return this.currentDrawings;
    }

    getTags() {
        return this.tagFilterService.activeTags;
    }

    getDrawingUrl(drawing: DrawingToDatabase) {
        if (!drawing.name) return 'assets/images/nothing.png';
        return FILE_SERVER_BASE_URL + 'home_icon.png';
    }

    setCurrentImages() {
        console.log(this.memoryService.drawingsFromDatabase);
        this.currentDrawings = [];
        this.currentActivesIndexes = [0, 1, 2];
        for (let i of this.currentActivesIndexes) {
            if (typeof this.tagFilterService.filteredDrawings[i] === 'undefined') {
                // Insert a placeholder in case there isn't the minimum of 3 data to fill the forms
                this.currentDrawings.push(new DrawingToDatabase());
            } else this.currentDrawings.push(this.tagFilterService.filteredDrawings[i]);
        }
    }

    addTag(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add the tag
        if ((value || '').trim()) {
            this.tagFilterService.activeTags.push({ tagName: value.trim() });
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }

        // Update the carousel
        this.tagFilterService.filterByTag(this.memoryService.drawingsFromDatabase);
        this.setCurrentImages();
    }

    removeTag(tag: Tag): void {
        const index = this.tagFilterService.activeTags.indexOf(tag);

        if (index >= 0) {
            this.tagFilterService.activeTags.splice(index, 1);
        }

        // Update the carousel
        this.tagFilterService.filterByTag(this.memoryService.drawingsFromDatabase);
        this.setCurrentImages();
    }

    movePrevious() {
        // If there is no more drawings, do nothing

        for (let i = 0; i < this.currentDrawings.length; i++) {
            if (this.currentActivesIndexes[i] - 1 < 0) {
                this.currentDrawings[i] = this.tagFilterService.filteredDrawings[this.tagFilterService.filteredDrawings.length - 1];
                this.currentActivesIndexes[i] = this.tagFilterService.filteredDrawings.length - 1;
            }
            this.currentDrawings[i] = this.tagFilterService.filteredDrawings[this.currentActivesIndexes[i] - 1];
            this.currentActivesIndexes[i] -= 1;
        }
    }

    moveNext() {
        for (let i = 0; i < this.currentDrawings.length; i++) {
            if (this.currentActivesIndexes[i] + 1 > this.tagFilterService.filteredDrawings.length - 1) {
                this.currentDrawings[i] = this.tagFilterService.filteredDrawings[0];
                this.currentActivesIndexes[i] = 0;
            }
            this.currentDrawings[i] = this.tagFilterService.filteredDrawings[this.currentActivesIndexes[i] + 1];
            this.currentActivesIndexes[i] += 1;
        }
    }

    @HostListener('window:keydown', ['$event'])
    onShiftDown(event: KeyboardEvent): void {
        if (event.key === 'ArrowRight') {
            this.moveNext();
        } else if (event.key === 'ArrowLeft') {
            this.movePrevious();
        }
    }

    drawingClicked(drawing: DrawingToDatabase) {
        if (this.drawingSelectedPurpose === PurposeofClick.Load) {
            //load drawing
            console.log('dessin charge');
        } else if (this.drawingSelectedPurpose === PurposeofClick.Delete) {
            //deletedrawing
            console.log('dessin supprime');
            this.drawingSelectedPurpose = PurposeofClick.Load;
        }
    }

    deleteDrawingSelected() {
        if (this.drawingSelectedPurpose === PurposeofClick.Load) {
            this.drawingSelectedPurpose = PurposeofClick.Delete;
            //afficher message que le user doit choisir un message a supprimé
        } else if (this.drawingSelectedPurpose === PurposeofClick.Delete) {
            this.drawingSelectedPurpose = PurposeofClick.Load;
        }
    }
}
