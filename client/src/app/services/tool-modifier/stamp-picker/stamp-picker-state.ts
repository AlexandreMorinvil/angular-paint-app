import { ToolModifierState } from '@app/classes/tool-modifier-state';

export class StampPickerModifierState extends ToolModifierState {
    stamp: string;
    constructor(stamp: string) {
        super();
        this.stamp = stamp;
    }
}
