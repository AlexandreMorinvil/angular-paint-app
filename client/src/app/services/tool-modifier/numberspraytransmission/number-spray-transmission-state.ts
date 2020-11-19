// tslint:disable:prettier
import { ToolModifierState } from '@app/classes/tool-modifier-state';

// The disablement of the "any" tslint rule is justified in this situation as the prototype
// of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
// tslint:disable:no-any
export class NumberSprayTransmissionModifierState extends ToolModifierState {
    numberSprayTransmission: number;
    constructor(sprayDiameter: number) {
        super();
        this.numberSprayTransmission = sprayDiameter;
    }
}
