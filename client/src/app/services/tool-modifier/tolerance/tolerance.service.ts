import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';

@Injectable({
    providedIn: 'root',
})
export class ToleranceService extends ToolModifier {
    readonly DEFAULT_TOLERANCE: number = 5;
    readonly MAX_TOLERANCE: number = 100;
    readonly MIN_TOLERANCE: number = 1;
    private numberTolerance: number = this.DEFAULT_TOLERANCE;

    constructor() {
        super();
    }

    setTolerance(input: number): void {
        if (input >= this.MAX_TOLERANCE) this.numberTolerance = this.MAX_TOLERANCE;
        else if (input <= this.MIN_TOLERANCE) this.numberTolerance = this.MIN_TOLERANCE;
        else this.numberTolerance = input;
    }

    getTolerance(): number {
        return this.numberTolerance;
    }
}
