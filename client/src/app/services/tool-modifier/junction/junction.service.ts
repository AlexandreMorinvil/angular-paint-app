import { Injectable } from '@angular/core';
import { Bound } from '@app/classes/bound';
import { ToolModifier } from '@app/classes/tool-modifier';
import { ModifierHandlerService } from '../modifier-handler/modifier-handler.service';
import { JunctionModifierState } from './junction-state';

@Injectable({
    providedIn: 'root',
})
export class JunctionService extends ToolModifier {
    readonly DEFAULT_HAS_JONCTION_POINT: boolean = true;
    readonly DEFAULT_JUNCTION_DIAMETER: number = 5;
    readonly MAX_JUNCTION_DIAMETER: number = 50;
    readonly MIN_JUNCTION_DIAMETER: number = 1;
    private diameter: number = this.DEFAULT_JUNCTION_DIAMETER;
    private hasJunctionPoint: boolean = this.DEFAULT_HAS_JONCTION_POINT;

    constructor(private modifierHandlerService: ModifierHandlerService) {
        super();
    }

    setDiameter(input: number): void {
        const LIMIT: number = this.modifierHandlerService.clamp(input, this.MAX_JUNCTION_DIAMETER, this.MIN_JUNCTION_DIAMETER);
        if (LIMIT === Bound.upper) this.diameter = this.MAX_JUNCTION_DIAMETER;
        else if (LIMIT === Bound.lower) this.diameter = this.MIN_JUNCTION_DIAMETER;
        else if (LIMIT === Bound.inside) this.diameter = input;
    }

    getDiameter(): number {
        return this.diameter;
    }

    setHasJunctionPoint(input: boolean): void {
        this.hasJunctionPoint = input;
    }

    getHasJunctionPoint(): boolean {
        return this.hasJunctionPoint;
    }

    getState(): JunctionModifierState {
        return new JunctionModifierState(this.diameter, this.hasJunctionPoint);
    }

    setState(state: JunctionModifierState): void {
        this.diameter = state.diameter;
        this.hasJunctionPoint = state.hasJunctionPoint;
    }
}
