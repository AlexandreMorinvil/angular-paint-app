import { Injectable } from '@angular/core';
import { Bound } from '@app/classes/bound';
import { ToolModifier } from '@app/classes/tool-modifier';
import { ModifierHandlerService } from '@app/services/tool-modifier/modifier-handler/modifier-handler.service';
import { SidesModifierState } from './sides-state';

@Injectable({
    providedIn: 'root',
})
export class SidesService extends ToolModifier {
    readonly DEFAULT_POLYGON_SIDE: number = 5;
    readonly MAX_POLYGON_SIDE: number = 12;
    readonly MIN_POLYGON_SIDE: number = 3;
    private numberSides: number = this.DEFAULT_POLYGON_SIDE;

    constructor(private modifierHandlerService: ModifierHandlerService) {
        super();
    }

    setSide(input: number): void {
        const LIMIT: number = this.modifierHandlerService.clamp(input, this.MAX_POLYGON_SIDE, this.MIN_POLYGON_SIDE);
        if (LIMIT === Bound.upper) this.numberSides = this.MAX_POLYGON_SIDE;
        else if (LIMIT === Bound.lower) this.numberSides = this.MIN_POLYGON_SIDE;
        else this.numberSides = input;
    }

    getSide(): number {
        return this.numberSides;
    }

    getState(): SidesModifierState {
        return new SidesModifierState(this.numberSides);
    }

    setState(state: SidesModifierState): void {
        this.numberSides = state.numberSides;
    }
}
