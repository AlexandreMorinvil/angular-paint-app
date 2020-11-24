import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';
import { GridOpacityModifierState } from './grid-opacity-state';

@Injectable({
    providedIn: 'root',
})
export class GridOpacityService extends ToolModifier {
    readonly MAX_ATTRIBUTE_GRID_OPACITY: number = 1;
    readonly MIN_ATTRIBUTE_GRID_OPACITY: number = 0.2;
    readonly STEP_SIZE: number = 0.01;
    private gridOpacity: number = 0.5;

    constructor() {
        super();
    }

    setGridOpacity(input: number): void {
        if (input >= this.MAX_ATTRIBUTE_GRID_OPACITY) this.gridOpacity = this.MAX_ATTRIBUTE_GRID_OPACITY;
        else if (input <= this.MIN_ATTRIBUTE_GRID_OPACITY) this.gridOpacity = this.MIN_ATTRIBUTE_GRID_OPACITY;
        else this.gridOpacity = input;
    }

    getGridOpacity(): number {
        return this.gridOpacity;
    }

    getState(): GridOpacityModifierState {
        return new GridOpacityModifierState(this.gridOpacity);
    }

    setState(state: GridOpacityModifierState): void {
        this.gridOpacity = state.gridOpacity;
    }
}
