import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, HostListener, Inject } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '@app/classes/dialog-data';
import { FILE_SERVER_BASE_URL } from '@app/services/api/api-drawing/api-drawing.service';
import { LoadService } from '@app/services/load/load.service';
import { RemoteMemoryService } from '@app/services/remote-memory/remote-memory.service.ts';
import { Tag, TagFilterService } from '@app/services/tag-filter/tag-filter.service';
import { DrawingToDatabase } from '@common/communication/drawing-to-database';

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
    private currentActivesIndexes: number[] = [0, 1, 2];
    private filteredDrawings: DrawingToDatabase[] = [];
    readonly NOTHING_IMAGE_LOCATION: string = 'assets/images/nothing.png';
    private drawingSelectedPurpose: PurposeofClick = PurposeofClick.Load;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    private readonly DRAWING_SEARCH_ERROR: string = "Erreur ! Votre dessin n'est pas sur le serveur";
    private readonly IMAGE_SOURCE: string = 'assets/images/nothing.png';

    constructor(
        public memoryService: RemoteMemoryService,
        public tagFilterService: TagFilterService,
        public loadService: LoadService,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {
        for (const i of this.currentActivesIndexes) {
            this.currentDrawings[i] = { _id: null, name: 'En chargement', tags: [] };
        }
        this.memoryService.getAllFromDatabase().then(() => {
            this.setCurrentDrawings();
        });
    }

    setCurrentDrawings(): void {
        this.filteredDrawings = this.tagFilterService.filterByTag(this.memoryService.getDrawingsFromDatabase());
        this.currentDrawings = [];
        this.currentActivesIndexes = [0, 1, 2];
        for (const i of this.currentActivesIndexes) {
            if (typeof this.filteredDrawings[i] === 'undefined') {
                // Insert a placeholder in case there isn't the minimum of 3 data to fill the forms
                this.currentDrawings.push(new DrawingToDatabase());
            } else this.currentDrawings.push(this.filteredDrawings[i]);
        }
    }

    // Get functions

    getFilteredDrawings(): DrawingToDatabase[] {
        return this.filteredDrawings;
    }

    getCurrentDrawings(): DrawingToDatabase[] {
        return this.currentDrawings;
    }

    getActiveTags(): Tag[] {
        return this.tagFilterService.getActiveTags();
    }

    getDrawingUrl(drawing: DrawingToDatabase): string {
        if (!drawing.name) {
            return this.NOTHING_IMAGE_LOCATION;
        }
        return FILE_SERVER_BASE_URL + drawing._id + '.png';
    }

    // Handler in case the server doesnt send image

    onImgError(event: ErrorEvent, drawing: DrawingToDatabase): void {
        (event.target as HTMLImageElement).src = this.IMAGE_SOURCE;
        drawing.name = this.DRAWING_SEARCH_ERROR;
        drawing.tags = [];
    }

    // Tag functions

    addTag(event: MatChipInputEvent): void {
        const INPUT = event.input;
        const VALUE = event.value;

        // Add the tag
        if ((VALUE || '').trim()) {
            this.tagFilterService.addTag({ tagName: VALUE.trim() });
        }

        // Reset the input value
        INPUT.value = '';

        // Update the carousel
        this.setCurrentDrawings();
    }

    removeTag(tag: Tag): void {
        this.tagFilterService.removeTag(tag);

        // Update the carousel
        this.setCurrentDrawings();
    }

    // Navigation functions

    movePrevious(): void {
        // If we have below three drawings, dont do anything
        if (this.currentDrawings[0]._id === null || this.currentDrawings[1]._id === null || this.currentDrawings[2]._id === null) return;

        for (let i = 0; i < this.currentDrawings.length; i++) {
            if (this.currentActivesIndexes[i] - 1 < 0) {
                this.currentDrawings[i] = this.filteredDrawings[this.filteredDrawings.length - 1];
                this.currentActivesIndexes[i] = this.filteredDrawings.length - 1;
            } else {
                this.currentDrawings[i] = this.filteredDrawings[this.currentActivesIndexes[i] - 1];
                this.currentActivesIndexes[i] -= 1;
            }
        }
    }

    moveNext(): void {
        // If we have below three drawings, dont do anything
        if (this.currentDrawings[0]._id === null || this.currentDrawings[1]._id === null || this.currentDrawings[2]._id === null) return;

        for (let i = 0; i < this.currentDrawings.length; i++) {
            if (this.currentActivesIndexes[i] + 1 > this.filteredDrawings.length - 1) {
                this.currentDrawings[i] = this.filteredDrawings[0];
                this.currentActivesIndexes[i] = 0;
            } else {
                this.currentDrawings[i] = this.filteredDrawings[this.currentActivesIndexes[i] + 1];
                this.currentActivesIndexes[i] += 1;
            }
        }
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        const KEY: string = event.key;
        if (event.ctrlKey && KEY.toLowerCase() === 'g') {
            event.preventDefault(); // to prevent key of windows
        } else if (KEY === 'ArrowRight') {
            this.moveNext();
        } else if (KEY === 'ArrowLeft') {
            this.movePrevious();
        }
    }

    // Load and delete functions

    drawingClicked(drawing: DrawingToDatabase): void {
        if (this.drawingSelectedPurpose === PurposeofClick.Load) {
            this.loadService.loadDraw(this.getDrawingUrl(drawing));
            this.tagFilterService.clearTags();
        } else {
            this.memoryService.deleteFromDatabase(drawing._id).then(() => {
                this.memoryService.getAllFromDatabase().then(() => {
                    this.setCurrentDrawings();
                });
            });
            this.drawingSelectedPurpose = PurposeofClick.Load;
        }
    }

    deleteDrawingButtonSelected(): void {
        this.drawingSelectedPurpose = this.drawingSelectedPurpose === PurposeofClick.Load ? PurposeofClick.Delete : PurposeofClick.Load;
    }
}
