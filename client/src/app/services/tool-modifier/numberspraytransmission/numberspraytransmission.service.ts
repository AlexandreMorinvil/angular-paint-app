import { Injectable } from '@angular/core';
import { Bound } from '@app/classes/bound';
import { ToolModifier } from '@app/classes/tool-modifier';
import { NumberSprayTransmissionModifierState } from '@app/services/tool-modifier/numberspraytransmission/number-spray-transmission-state';
import { ModifierHandlerService } from '../modifier-handler/modifier-handler.service';

@Injectable({
    providedIn: 'root',
})
export class NumberSprayTransmissionService extends ToolModifier {
    readonly DEFAULT_NUMBER_SPRAY_TRANSMISSION: number = 50;
    readonly MAX_NUMBER_SPRAY_TRANSMISSION: number = 200;
    readonly MIN_NUMBER_SPRAY_TRANSMISSION: number = 10;
    private numberSprayTransmission: number = this.DEFAULT_NUMBER_SPRAY_TRANSMISSION;

    constructor(private modifierHandlerService: ModifierHandlerService) {
        super();
    }

    setNumberSprayTransmission(input: number): void {
        const LIMIT: number = this.modifierHandlerService.clamp(input, this.MAX_NUMBER_SPRAY_TRANSMISSION, this.MIN_NUMBER_SPRAY_TRANSMISSION);
        if (LIMIT === Bound.upper) this.numberSprayTransmission = this.MAX_NUMBER_SPRAY_TRANSMISSION;
        else if (LIMIT === Bound.lower) this.numberSprayTransmission = this.MIN_NUMBER_SPRAY_TRANSMISSION;
        else if (LIMIT === Bound.inside) this.numberSprayTransmission = input;
    }

    getNumberSprayTransmission(): number {
        return this.numberSprayTransmission;
    }

    getState(): NumberSprayTransmissionModifierState {
        return new NumberSprayTransmissionModifierState(this.numberSprayTransmission);
    }

    setState(state: NumberSprayTransmissionModifierState): void {
        this.numberSprayTransmission = state.numberSprayTransmission;
    }
}
