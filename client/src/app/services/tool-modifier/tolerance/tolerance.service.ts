import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';

@Injectable({
    providedIn: 'root',
})
export class ToleranceService extends ToolModifier {
    readonly DEFAULT_TOLERANCE: number = 0;
    readonly MAX_TOLERANCE: number = 100;
    readonly MIN_TOLERANCE: number = 0;
    private numberTolerance: number = this.DEFAULT_TOLERANCE;
    private percentageTolerance : number =  0;

    constructor() {
        super();
    }

    setTolerance(input: number): void {
        if (input >= this.MAX_TOLERANCE) this.numberTolerance = this.MAX_TOLERANCE;
        else if (input <= this.MIN_TOLERANCE) this.numberTolerance = this.MIN_TOLERANCE;
        else this.numberTolerance = input;
        this.setPercentageTolerance();
    }

    setPercentageTolerance(){
        this.percentageTolerance = Math.round(this.numberTolerance * 255 / 100);
    }

    getPercentageTolerance(): number {
        return this.percentageTolerance
    }

    getTolerance(): number {
        return this.numberTolerance;
    }
}
