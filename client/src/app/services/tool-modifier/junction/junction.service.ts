import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';

@Injectable({
    providedIn: 'root',
})
export class JunctionService extends ToolModifier {
    readonly DEFAULT_HAS_JONCTION_POINT: boolean = true;
    readonly MAX_JONCTION_DIAMETER: number = 50;
    readonly MIN_JONCTION_DIAMETER: number = 1;
    private diameter: number = this.MIN_JONCTION_DIAMETER;
    private hasJunctionPoint: boolean = this.DEFAULT_HAS_JONCTION_POINT;

    constructor() {
        super();
    }

    setDiameter(input: number): void {
        if (input >= this.MAX_JONCTION_DIAMETER) this.diameter = this.MAX_JONCTION_DIAMETER;
        else if (input <= this.MIN_JONCTION_DIAMETER) this.diameter = this.MIN_JONCTION_DIAMETER;
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

}
