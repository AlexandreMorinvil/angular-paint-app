import { ToolModifierState } from '@app/classes/tool-modifier-state';

export class ToleranceModifierState extends ToolModifierState {
    percentTolerance: number;
    pixelTolerance: number;
    constructor(percentTolerance: number, pixelTolerance: number) {
        super();
        this.percentTolerance = percentTolerance;
        this.pixelTolerance = pixelTolerance;
    }
}
