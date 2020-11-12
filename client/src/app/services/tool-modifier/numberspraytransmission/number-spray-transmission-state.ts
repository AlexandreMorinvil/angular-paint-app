import { ToolModifierState } from '@app/classes/tool-modifier-state';

export class NumberSprayTransmissionModifierState extends ToolModifierState {
    numberSprayTransmission: number;

    constructor(sprayDiameter: number) {
        super();
        this.numberSprayTransmission = sprayDiameter;
    }
}
