// tslint:disable:prettier
import { ToolModifierState } from '@app/classes/tool-modifier-state';

export class SprayDropletDiameterModifierState extends ToolModifierState {
    sprayDropletDiameter: number;

    constructor(sprayDropletDiameter: number) {
        super();
        this.sprayDropletDiameter = sprayDropletDiameter;
    }
}
