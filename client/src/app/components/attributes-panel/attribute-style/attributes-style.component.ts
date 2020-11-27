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

    constructor(private styleService: StyleService) {
        this.hasBold = this.styleService.getHasBold();
        this.hasItalic = this.styleService.getHasItalic();
    }

    assign(): void {
        this.styleService.setHasBold(this.hasBold);
        this.styleService.setHasItalic(this.hasItalic);
    }

    revert(): void {
        this.hasBold = this.styleService.getHasBold();
        this.hasItalic = this.styleService.getHasItalic();
    }

    needConfirmation(): boolean {
        return this.hasItalic !== this.styleService.getHasItalic() || this.hasBold !== this.styleService.getHasBold();
    }
}
