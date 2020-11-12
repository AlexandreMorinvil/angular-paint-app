import { ToolModifierState } from '@app/classes/tool-modifier-state';

export class SprayDiameterModifierState extends ToolModifierState {
    sprayDiameter: number;

    constructor(sprayDiameter: number) {
        super();
        this.sprayDiameter = sprayDiameter;
    }
}
