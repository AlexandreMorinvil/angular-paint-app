import { Injectable } from '@angular/core';
import { Bound } from '@app/classes/bound';
import { ToolModifier } from '@app/classes/tool-modifier';
import { ModifierHandlerService } from '@app/services/tool-modifier/modifier-handler/modifier-handler.service';
import { SprayDiameterModifierState } from '@app/services/tool-modifier/spray-diameter/spray-diameter-state';

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
        const LIMIT: number = this.modifierHandlerService.clamp(input, this.MAX_SPRAY_DIAMETER, this.MIN_SPRAY_DIAMETER);
        switch (LIMIT) {
            case Bound.upper:
                this.sprayDiameter = this.MAX_SPRAY_DIAMETER;
                break;
            case Bound.lower:
                this.sprayDiameter = this.MIN_SPRAY_DIAMETER;
                break;
            case Bound.inside:
                this.sprayDiameter = input;
                break;
        }
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
