import { ToolModifierState } from '@app/classes/tool-modifier-state';

export class SidesModifierState extends ToolModifierState {
    numberSides: number;

    constructor(numberSides: number) {
        super();
        this.numberSides = numberSides;
    }
}
