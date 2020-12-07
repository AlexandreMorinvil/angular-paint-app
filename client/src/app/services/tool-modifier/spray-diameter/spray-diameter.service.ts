import { Injectable } from '@angular/core';
import { Bound } from '@app/classes/bound';
import { ToolModifier } from '@app/classes/tool-modifier';
import { SprayDiameterModifierState } from '@app/services/tool-modifier/spray-diameter/spray-diameter-state';
import { ModifierHandlerService } from '../modifier-handler/modifier-handler.service';

@Injectable({
    providedIn: 'root',
})
export class SprayDiameterService extends ToolModifier {
    readonly DEFAULT_SPRAY_DIAMETER: number = 100;
    readonly MAX_SPRAY_DIAMETER: number = 200;
    readonly MIN_SPRAY_DIAMETER: number = 10;
    private sprayDiameter: number = this.DEFAULT_SPRAY_DIAMETER;

    constructor(private modifierHandlerService: ModifierHandlerService) {
        super();
    }

    setSprayDiameter(input: number): void {
        const LIMIT: number = this.modifierHandlerService.clamp(input, this.MAX_SPRAY_DIAMETER, this.MAX_SPRAY_DIAMETER);
        if (LIMIT === Bound.upper) this.sprayDiameter = this.MAX_SPRAY_DIAMETER;
        else if (LIMIT === Bound.lower) this.sprayDiameter = this.MIN_SPRAY_DIAMETER;
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
