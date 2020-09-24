import { Component } from '@angular/core';
import { ColorService } from '@app/services/tool-modifier/color/color.service';

@Component({
    selector: 'app-attributes-color',
    templateUrl: './attributes-color.component.html',
    styleUrls: ['./attributes-color.component.scss', '../attributes-section.component.scss'],
})
export class AttributeColorComponent {
    private primaryColor: string;
    private secondaryColor: string;

    constructor(private colorService: ColorService) {
        this.primaryColor = this.colorService.getPrimaryColor();
        this.secondaryColor = this.colorService.getSecondaryColor();
    }

    get primaryColorDisplayed(): string {
        return this.primaryColor;
    }

    set primaryColorDisplayed(value: string) {
        this.primaryColor = value;
    }

    get secondaryColorDisplayed(): string {
        return this.secondaryColor;
    }

    set secondaryColorDisplayed(value: string) {
        this.secondaryColor = value;
    }

    assign(): void {
        this.colorService.setPrimaryColor(this.primaryColor);
        this.colorService.setSecondaryColor(this.secondaryColor);
    }

    revert(): void {
        this.primaryColor = this.colorService.getPrimaryColor();
        this.secondaryColor = this.colorService.getSecondaryColor();
    }

    needConfirmation(): boolean {
        const hasPrimaryColorChanged = this.primaryColor !== this.colorService.getPrimaryColor();
        const hasSecondaryColorChanged = this.secondaryColor !== this.colorService.getSecondaryColor();
        return hasPrimaryColorChanged || hasSecondaryColorChanged;
    }
}
