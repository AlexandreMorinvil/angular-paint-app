import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';
import { SprayDropletDiameterModifierState } from '@app/services/tool-modifier/spraydropletdiameter/spray-droplet-diameter-state';

@Injectable({
    providedIn: 'root',
})
export class SprayDropletDiameterService extends ToolModifier {
    readonly DEFAULT_SPRAY_DROPLET_DIAMETER: number = 2;
    readonly MAX_SPRAY_DROPLET_DIAMETER: number = 15;
    readonly MIN_SPRAY_DROPLET_DIAMETER: number = 1;
    private sprayDropletDiameter: number = this.DEFAULT_SPRAY_DROPLET_DIAMETER;

    constructor() {
        super();
    }

    setSprayDropletDiameter(input: number): void {
        if (input >= this.MAX_SPRAY_DROPLET_DIAMETER) this.sprayDropletDiameter = this.MAX_SPRAY_DROPLET_DIAMETER;
        else if (input <= this.MIN_SPRAY_DROPLET_DIAMETER) this.sprayDropletDiameter = this.MIN_SPRAY_DROPLET_DIAMETER;
        else this.sprayDropletDiameter = input;
    }

    getSprayDropletDiameter(): number {
        return this.sprayDropletDiameter;
    }

    getState(): SprayDropletDiameterModifierState {
        return new SprayDropletDiameterModifierState(this.sprayDropletDiameter);
    }

    setState(state: SprayDropletDiameterModifierState): void {
        this.sprayDropletDiameter = state.sprayDropletDiameter;
    }
}
