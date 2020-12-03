import { ToolModifierState } from '@app/classes/tool-modifier-state';

export class SpacingModifierState extends ToolModifierState {
    spacing: number;
    constructor(spacing: number) {
        super();
        this.spacing = spacing;
    }
}
