import { ToolModifierState } from '@app/classes/tool-modifier-state';

export class FillingModifierState extends ToolModifierState {
    neighboursPixelsOnly: boolean;

    constructor(neighboursPixelsOnly: boolean) {
        super();
        this.neighboursPixelsOnly = neighboursPixelsOnly;
    }
}
