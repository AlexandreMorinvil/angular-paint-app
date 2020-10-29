import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';
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

    constructor() {
        super();
    }

    setDiameter(input: number): void {
        if (input >= this.MAX_JUNCTION_DIAMETER) this.diameter = this.MAX_JUNCTION_DIAMETER;
        else if (input <= this.MIN_JUNCTION_DIAMETER) this.diameter = this.MIN_JUNCTION_DIAMETER;
        else this.diameter = input;
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
