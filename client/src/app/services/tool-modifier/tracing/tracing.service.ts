import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';

@Injectable({
    providedIn: 'root',
})
export class TracingService extends ToolModifier {
    readonly DEFAULT_HAS_CONTOUR: boolean = true;
    readonly DEFAULT_HAS_FILL: boolean = true;
    private hasContour: boolean = this.DEFAULT_HAS_CONTOUR;
    private hasFill: boolean = this.DEFAULT_HAS_FILL;

    constructor() {
        super();
    }

    setHasFill(input: boolean): void {
        this.hasFill = input;
    }

    getHasFill(): boolean {
        return this.hasFill;
    }

    getHasContour(): boolean {
        return this.hasContour;
    }

    setHasContour(input: boolean): void {
        this.hasContour = input;
    }
}
