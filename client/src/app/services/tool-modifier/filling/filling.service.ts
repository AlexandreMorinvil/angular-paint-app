import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';

@Injectable({
    providedIn: 'root',
})
export class FillingService extends ToolModifier {
    readonly DEFAULT_NEIGHBOUR_PIXELS_ONLY: boolean = true;
    neighboursPixelsOnly: boolean = this.DEFAULT_NEIGHBOUR_PIXELS_ONLY;

    constructor() {
        super();
    }

    setNeighbourPixelsOnly(input: boolean): void {
        this.neighboursPixelsOnly = input;
    }

    getNeighbourPixelsOnly(): boolean {
        return this.neighboursPixelsOnly;
    }
}
