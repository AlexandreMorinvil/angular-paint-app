import { Injectable } from '@angular/core';
import { Bound } from '@app/classes/bound';
import { ToolModifier } from '@app/classes/tool-modifier';
import { ModifierHandlerService } from '@app/services/tool-modifier/modifier-handler/modifier-handler.service';
import { SprayDropletDiameterModifierState } from '@app/services/tool-modifier/spray-droplet-diameter/spray-droplet-diameter-state';

@Injectable({
    providedIn: 'root',
})
export class SprayDropletDiameterService extends ToolModifier {
    readonly DEFAULT_SPRAY_DROPLET_DIAMETER: number = 2;
    readonly MAX_SPRAY_DROPLET_DIAMETER: number = 15;
    readonly MIN_SPRAY_DROPLET_DIAMETER: number = 1;
    private sprayDropletDiameter: number = this.DEFAULT_SPRAY_DROPLET_DIAMETER;

    constructor(private modifierHandlerService: ModifierHandlerService) {
        super();
    }

    setSprayDropletDiameter(input: number): void {
        const LIMIT: number = this.modifierHandlerService.clamp(input, this.MAX_SPRAY_DROPLET_DIAMETER, this.MIN_SPRAY_DROPLET_DIAMETER);
        if (LIMIT === Bound.upper) this.sprayDropletDiameter = this.MAX_SPRAY_DROPLET_DIAMETER;
        else if (LIMIT === Bound.lower) this.sprayDropletDiameter = this.MIN_SPRAY_DROPLET_DIAMETER;
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
