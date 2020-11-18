import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';
import { SpacingModifierState } from './spacing-state';

@Injectable({
    providedIn: 'root',
})
export class SpacingService extends ToolModifier {
    readonly MAX_ATTRIBUTE_SPACING: number = 50;
    readonly MIN_ATTRIBUTE_SPACING: number = 5;
    readonly STEP_SIZE: number = 5;
    private spacing: number = this.MIN_ATTRIBUTE_SPACING;

    constructor() {
        super();
    }

    setSpacing(input: number): void {
        if (input >= this.MAX_ATTRIBUTE_SPACING) this.spacing = this.MAX_ATTRIBUTE_SPACING;
        else if (input <= this.MIN_ATTRIBUTE_SPACING) this.spacing = this.MIN_ATTRIBUTE_SPACING;
        else this.spacing = input;
    }

    getSpacing(): number {
        return this.spacing;
    }

    getState(): SpacingModifierState {
        return new SpacingModifierState(this.spacing);
    }

    setState(state: SpacingModifierState): void {
        this.spacing = state.spacing;
    }
}
