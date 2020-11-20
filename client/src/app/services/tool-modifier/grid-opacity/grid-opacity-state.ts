import { ToolModifierState } from '@app/classes/tool-modifier-state';

export class GridOpacityModifierState extends ToolModifierState {
    gridOpacity: number;
    constructor(gridOpacity: number) {
        super();
        this.gridOpacity = gridOpacity;
    }
}
