import { Component } from '@angular/core';
import { StyleService } from '@app/services/tool-modifier/style/style.service';

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

    constructor(private styleService: StyleService) {
        this.hasBold = this.styleService.getHasBold();
        this.hasItalic = this.styleService.getHasItalic();
        this.alignment = this.styleService.getAlignment();
        this.font = this.styleService.getFont();
        this.fontSize = this.styleService.getFontSize();
    }

    getListAlignments() {
        return this.styleService.getListAlignments();
    }
    getListFonts() {
        return this.styleService.getListFonts();
    }
    assign(): void {
        this.styleService.setHasBold(this.hasBold);
        this.styleService.setHasItalic(this.hasItalic);
        this.styleService.setAlignment(this.alignment);
        this.styleService.setFont(this.font);
        this.styleService.setFontSize(this.fontSize);
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
