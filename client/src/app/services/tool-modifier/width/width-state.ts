import { ToolModifierState } from '@app/classes/tool-modifier-state';

export class WidthModifierState extends ToolModifierState {
    width: number;
    constructor(width: number) {
        super();
        this.width = width;
    }
}
