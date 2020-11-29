import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';
import { Subject } from 'rxjs';
import { SpacingModifierState } from './spacing-state';

@Injectable({
    providedIn: 'root',
})
export class SpacingService extends ToolModifier {
    spacingChange: Subject<number> = new Subject<number>();
    readonly MAX_ATTRIBUTE_SPACING: number = 100;
    readonly MIN_ATTRIBUTE_SPACING: number = 5;
    readonly STEP_SIZE: number = 5;
    private spacing: number = 20;

    constructor() {
        super();
    }

    stepUp(): void {
        this.setSpacing(this.spacing + this.STEP_SIZE);
        this.spacingChange.next(this.spacing);
    }

    stepDown(): void {
        this.setSpacing(this.spacing - this.STEP_SIZE);
        this.spacingChange.next(this.spacing);
    }

    setSpacing(input: number): void {
        if (input >= this.MAX_ATTRIBUTE_SPACING) this.spacing = this.MAX_ATTRIBUTE_SPACING;
        else if (input <= this.MIN_ATTRIBUTE_SPACING) this.spacing = this.MIN_ATTRIBUTE_SPACING;
        else this.spacing = input;
        this.spacingChange.next(this.spacing);
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
