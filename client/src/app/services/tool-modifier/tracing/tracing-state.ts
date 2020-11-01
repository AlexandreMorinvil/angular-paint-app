import { ToolModifierState } from '@app/classes/tool-modifier-state';

export class TracingModifierState extends ToolModifierState {
    hasContour: boolean;
    hasFill: boolean;
    constructor(hasContour: boolean, hasFill: boolean) {
        super();
        this.hasContour = hasContour;
        this.hasFill = hasFill;
    }
}
