import { Injectable } from '@angular/core';
import { Bound } from '@app/classes/bound';
import { ToolModifier } from '@app/classes/tool-modifier';
import { ModifierHandlerService } from '../modifier-handler/modifier-handler.service';
import { ToleranceModifierState } from './tolerance-state';

@Injectable({
    providedIn: 'root',
})
export class ToleranceService extends ToolModifier {
    readonly DEFAULT_TOLERANCE: number = 0;
    readonly MAX_TOLERANCE: number = 100;
    readonly MIN_TOLERANCE: number = 0;
    private percentTolerance: number = this.DEFAULT_TOLERANCE;
    private pixelTolerance: number = 0;

    constructor(private modifierHandlerService: ModifierHandlerService) {
        super();
    }

    setTolerance(input: number): void {
        const LIMIT: number = this.modifierHandlerService.clamp(input, this.MAX_TOLERANCE, this.MIN_TOLERANCE);
        if (LIMIT === Bound.upper) this.percentTolerance = this.MAX_TOLERANCE;
        else if (LIMIT === Bound.lower) this.percentTolerance = this.MIN_TOLERANCE;
        else if (LIMIT == Bound.inside) this.percentTolerance = input;
        // We use magic number to calculate the convert the percentage limit in pixel
        // tslint:disable:no-magic-numbers
        this.pixelTolerance = Math.round((this.percentTolerance * 255) / 100);
    }

    getPixelTolerance(): number {
        return this.pixelTolerance;
    }

    getPercentTolerance(): number {
        return this.percentTolerance;
    }

    getState(): ToleranceModifierState {
        return new ToleranceModifierState(this.percentTolerance, this.pixelTolerance);
    }

    setState(state: ToleranceModifierState): void {
        this.percentTolerance = state.percentTolerance;
        this.pixelTolerance = state.percentTolerance;
    }
}
