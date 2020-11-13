import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';
import { SprayDiameterModifierState } from '@app/services/tool-modifier/spraydiameter/spray-diameter-state';

@Injectable({
    providedIn: 'root',
})
export class SprayDiameterService extends ToolModifier {
    readonly DEFAULT_SPRAY_DIAMETER: number = 100;
    readonly MAX_SPRAY_DIAMETER: number = 200;
    readonly MIN_SPRAY_DIAMETER: number = 10;
    private sprayDiameter: number = this.DEFAULT_SPRAY_DIAMETER;

    constructor() {
        super();
    }

    setSprayDiameter(input: number): void {
        if (input >= this.MAX_SPRAY_DIAMETER) this.sprayDiameter = this.MAX_SPRAY_DIAMETER;
        else if (input <= this.MIN_SPRAY_DIAMETER) this.sprayDiameter = this.MIN_SPRAY_DIAMETER;
        else this.sprayDiameter = input;
    }

    getSprayDiameter(): number {
        return this.sprayDiameter;
    }

    getState(): SprayDiameterModifierState {
        return new SprayDiameterModifierState(this.sprayDiameter);
    }

    setState(state: SprayDiameterModifierState): void {
        this.sprayDiameter = state.sprayDiameter;
    }
}
