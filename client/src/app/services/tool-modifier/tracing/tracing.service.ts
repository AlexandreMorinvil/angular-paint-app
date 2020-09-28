import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';

@Injectable({
    providedIn: 'root',
})
export class TracingService extends ToolModifier {
    private hasContour: boolean = true;
    private hasFill: boolean = true;

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
