import { Injectable } from '@angular/core';
import { Bound } from '@app/classes/bound';
import { ToolModifier } from '@app/classes/tool-modifier';
import { ModifierHandlerService } from '@app/services/tool-modifier/modifier-handler/modifier-handler.service';
import { GridOpacityModifierState } from './grid-opacity-state';

@Injectable({
    providedIn: 'root',
})
export class GridOpacityService extends ToolModifier {
    readonly MAX_ATTRIBUTE_GRID_OPACITY: number = 1;
    readonly MIN_ATTRIBUTE_GRID_OPACITY: number = 0.2;
    readonly STEP_SIZE: number = 0.01;
    private gridOpacity: number = 0.5;

    constructor(private modifierHandlerService: ModifierHandlerService) {
        super();
    }

    setGridOpacity(input: number): void {
        const LIMIT: number = this.modifierHandlerService.clamp(input, this.MAX_ATTRIBUTE_GRID_OPACITY, this.MIN_ATTRIBUTE_GRID_OPACITY);
        if (LIMIT === Bound.upper) this.gridOpacity = this.MAX_ATTRIBUTE_GRID_OPACITY;
        else if (LIMIT === Bound.lower) this.gridOpacity = this.MIN_ATTRIBUTE_GRID_OPACITY;
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
