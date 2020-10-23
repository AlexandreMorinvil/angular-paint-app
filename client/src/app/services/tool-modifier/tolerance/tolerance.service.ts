import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';

@Injectable({
    providedIn: 'root',
})
export class ToleranceService extends ToolModifier {
    readonly DEFAULT_TOLERANCE: number = 0;
    readonly MAX_TOLERANCE: number = 100;
    readonly MIN_TOLERANCE: number = 0;
    private percentTolerance: number = this.DEFAULT_TOLERANCE;
    private pixelTolerance: number = 0;

    constructor() {
        super();
    }

    setTolerance(input: number): void {
        if (input >= this.MAX_TOLERANCE) this.percentTolerance = this.MAX_TOLERANCE;
        else if (input <= this.MIN_TOLERANCE) this.percentTolerance = this.MIN_TOLERANCE;
        else this.percentTolerance = input;
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
}
