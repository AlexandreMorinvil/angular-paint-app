import { Injectable } from '@angular/core';
import { Drawing } from '@common/communication/drawing';

export interface Tag {
    tagName: string;
}

@Injectable({
    providedIn: 'root',
})
export class TagFilter {
    filteredDrawings: Drawing[] = [];
    activeTags: Tag[] = [];

    constructor() {}

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

    filterByTag(listToFilter: Drawing[]) {
        //No filter need to be applied
        if (this.activeTags.length === 0) {
            this.filteredDrawings = listToFilter;
            return;
        }

        // List is reinitialised and filters are applied
        this.filteredDrawings = [];
        for (let drawingtodatabase of listToFilter) {
            for (let tag of this.activeTags) {
                if (drawingtodatabase.tags.includes(tag.tagName)) {
                    this.filteredDrawings.push(drawingtodatabase);
                    break;
                }
            }
        }
    }
}
