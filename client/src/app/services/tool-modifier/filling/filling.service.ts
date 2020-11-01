import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';
import { FillingModifierState } from './filling-state';

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

    getState(): FillingModifierState {
        return new FillingModifierState(this.neighboursPixelsOnly);
    }

    setState(state: FillingModifierState): void {
        this.neighboursPixelsOnly = state.neighboursPixelsOnly;
    }
}
