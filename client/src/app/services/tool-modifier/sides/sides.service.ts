import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';

@Injectable({
    providedIn: 'root',
})
export class SidesService extends ToolModifier {
    readonly DEFAULT_POLYGON_SIDE: number = 5;
    readonly MAX_POLYGON_SIDE: number = 12;
    readonly MIN_POLYGON_SIDE: number = 3;
    private numberSides: number = this.DEFAULT_POLYGON_SIDE;

    constructor() {
        super();
    }

    setSide(input: number): void {
        if (input >= this.MAX_POLYGON_SIDE) this.numberSides = this.MAX_POLYGON_SIDE;
        else if (input <= this.MIN_POLYGON_SIDE) this.numberSides = this.MIN_POLYGON_SIDE;
        else this.numberSides = input;
    }

    getSide(): number {
        return this.numberSides;
    }
}
