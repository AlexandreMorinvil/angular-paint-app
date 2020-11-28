import { Component } from '@angular/core';
import { StyleService } from '@app/services/tool-modifier/style/style.service';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';

@Component({
    selector: 'app-attributes-style',
    templateUrl: './attributes-style.component.html',
    styleUrls: ['./attributes-style.component.scss', '../attributes-section.component.scss'],
})
export class AttributeStyleComponent {
    hasBold: boolean;
    hasItalic: boolean;
    alignment: string;
    font: string;
    fontSize: number;

    constructor(private styleService: StyleService, private toolbox: ToolboxService) {
        this.hasBold = this.styleService.getHasBold();
        this.hasItalic = this.styleService.getHasItalic();
        this.alignment = this.styleService.getAlignment();
        this.font = this.styleService.getFont();
        this.fontSize = this.styleService.getFontSize();
    }

    getListAlignments(): string[] {
        return this.styleService.getListAlignments();
    }

    getListFonts(): string[] {
        return this.styleService.getListFonts();
    }

    assign(): void {
        this.styleService.setHasBold(this.hasBold);
        this.styleService.setHasItalic(this.hasItalic);
        this.styleService.setAlignment(this.alignment);
        this.styleService.setFont(this.font);
        this.styleService.setFontSize(this.fontSize);
        this.toolbox.getCurrentTool().onAttributeChange();
    }

    revert(): void {
        this.hasBold = this.styleService.getHasBold();
        this.hasItalic = this.styleService.getHasItalic();
        this.alignment = this.styleService.getAlignment();
        this.font = this.styleService.getFont();
        this.fontSize = this.styleService.getFontSize();
    }

    needConfirmation(): boolean {
        return (
            this.hasItalic !== this.styleService.getHasItalic() ||
            this.hasBold !== this.styleService.getHasBold() ||
            this.alignment !== this.styleService.getAlignment() ||
            this.font !== this.styleService.getFont() ||
            this.fontSize !== this.styleService.getFontSize()
        );
    }
}
