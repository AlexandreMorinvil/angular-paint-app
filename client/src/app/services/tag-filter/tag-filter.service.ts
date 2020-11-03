import { Injectable } from '@angular/core';
import { DrawingToDatabase } from '@common/communication/drawingtodatabase';

export interface Tag {
    tagName: string;
}

@Injectable({
    providedIn: 'root',
})
export class TagFilterService {
    private activeTags: Tag[] = [];

    getActiveTags(): Tag[] {
        return this.activeTags;
    }

    addTag(tag: Tag) {
        this.activeTags.push(tag);
    }

    removeTag(tagToRemove: Tag) {
        for (let i = 0; i < this.activeTags.length; i++) {
            if (this.activeTags[i] === tagToRemove) {
                this.activeTags.splice(i, 1);
            }
        }
    }

    filterByTag(listToFilter: DrawingToDatabase[]): DrawingToDatabase[] {
        let filteredDrawings: DrawingToDatabase[] = [];
        //No filter need to be applied
        if (this.activeTags.length === 0) {
            return listToFilter;
        }

        // List is reinitialised and filters are applied
        for (let drawing of listToFilter) {
            //Prevent errors
            if (typeof drawing.tags === 'undefined') drawing.tags = [];
            for (let tag of this.activeTags) {
                if (drawing.tags.includes(tag.tagName)) {
                    filteredDrawings.push(drawing);
                    break;
                }
            }
        }

        return filteredDrawings;
    }
}
