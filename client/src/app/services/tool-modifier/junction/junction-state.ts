import { ToolModifierState } from '@app/classes/tool-modifier-state';

export class JunctionModifierState extends ToolModifierState {
    diameter: number;
    hasJunctionPoint: boolean;

    constructor(diameter: number, hasJunctionPoint: boolean) {
        super();
        this.diameter = diameter;
        this.hasJunctionPoint = hasJunctionPoint;
    }
}
