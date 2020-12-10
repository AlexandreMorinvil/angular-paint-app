import { Injectable } from '@angular/core';
import { Bound } from '@app/classes/bound';
import { ToolModifier } from '@app/classes/tool-modifier';
import { ModifierHandlerService } from '@app/services/tool-modifier/modifier-handler/modifier-handler.service';
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

    constructor(private modifierHandlerService: ModifierHandlerService) {
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
        const LIMIT: number = this.modifierHandlerService.clamp(input, this.MAX_ATTRIBUTE_SPACING, this.MIN_ATTRIBUTE_SPACING);
        if (LIMIT === Bound.upper) this.spacing = this.MAX_ATTRIBUTE_SPACING;
        else if (LIMIT === Bound.lower) this.spacing = this.MIN_ATTRIBUTE_SPACING;
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
