import { ToolModifierState } from '@app/classes/tool-modifier-state';

export class ColorModifierState extends ToolModifierState {
    primaryColor: string;
    primaryColorOpacity: number;
    secondaryColor: string;
    secondaryColorOpacity: number;

    constructor(primaryColor: string, primaryColorOpacity: number, secondaryColor: string, secondaryColorOpacity: number) {
        super();
        this.primaryColor = primaryColor;
        this.primaryColorOpacity = primaryColorOpacity;
        this.secondaryColor = secondaryColor;
        this.secondaryColorOpacity = secondaryColorOpacity;
    }
}
