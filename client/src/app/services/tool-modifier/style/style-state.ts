import { ToolModifierState } from '@app/classes/tool-modifier-state';

export class StyleModifierState extends ToolModifierState {
    alignment: string;
    font: string;
    hasBold: boolean;
    hasItalic: boolean;
    fontSize: number;
    constructor(alignment: string, font: string, hasBold: boolean, hasItalic: boolean, fontSize: number) {
        super();
        this.alignment = alignment;
        this.font = font;
        this.hasBold = hasBold;
        this.hasItalic = hasItalic;
        this.fontSize = fontSize;
    }
}
