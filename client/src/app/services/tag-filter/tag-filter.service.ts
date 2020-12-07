import { Injectable } from '@angular/core';
import { DrawingToDatabase } from '@common/communication/drawing-to-database';

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

    addTag(tag: Tag): void {
        this.activeTags.push(tag);
    }

    removeTag(tagToRemove: Tag): void {
        for (let i = 0; i < this.activeTags.length; i++) {
            if (this.activeTags[i] === tagToRemove) {
                this.activeTags.splice(i, 1);
            }
        }
    }

    filterByTag(listToFilter: DrawingToDatabase[]): DrawingToDatabase[] {
        const FILTERED_DRAWINGS: DrawingToDatabase[] = [];
        // No filter need to be applied
        if (this.activeTags.length === 0) {
            return listToFilter;
        }

        // List is reinitialised and filters are applied
        for (const drawing of listToFilter) {
            for (const tag of this.activeTags) {
                if (drawing.tags.includes(tag.tagName)) {
                    FILTERED_DRAWINGS.push(drawing);
                    break;
                }
            }
        }

        return FILTERED_DRAWINGS;
    }

    clearTags(): void {
        this.activeTags = [];
    }
}
