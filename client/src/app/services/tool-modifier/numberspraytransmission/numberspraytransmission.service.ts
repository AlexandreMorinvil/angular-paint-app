import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';
import { NumberSprayTransmissionModifierState } from '@app/services/tool-modifier/numberspraytransmission/number-spray-transmission-state';

@Injectable({
    providedIn: 'root',
})
export class NumberSprayTransmissionService extends ToolModifier {
    readonly DEFAULT_NUMBER_SPRAY_TRANSMISSION: number = 50;
    readonly MAX_NUMBER_SPRAY_TRANSMISSION: number = 150;
    readonly MIN_NUMBER_SPRAY_TRANSMISSION: number = 40;
    private numberSprayTransmission: number = this.DEFAULT_NUMBER_SPRAY_TRANSMISSION;

    constructor() {
        super();
    }

    setNumberSprayTransmission(input: number): void {
        if (input >= this.MAX_NUMBER_SPRAY_TRANSMISSION) this.numberSprayTransmission = this.MAX_NUMBER_SPRAY_TRANSMISSION;
        else if (input <= this.MIN_NUMBER_SPRAY_TRANSMISSION) this.numberSprayTransmission = this.MIN_NUMBER_SPRAY_TRANSMISSION;
        else this.numberSprayTransmission = input;
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
