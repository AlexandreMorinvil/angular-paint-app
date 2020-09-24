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
    private primaryOpacity: number;
    private secondaryOpacity: number;

    constructor(private colorService: ColorService) {
        this.primaryColor = this.colorService.getPrimaryColor();
        this.secondaryColor = this.colorService.getSecondaryColor();
        this.primaryOpacity = this.colorService.getPrimaryColorOpacity();
        this.secondaryOpacity = this.colorService.getSecondaryColorOpacity();
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

    get primaryOpacityDisplayed(): number {
        return this.primaryOpacity;
    }

    set primaryOpacityDisplayed(value: number) {
        this.primaryOpacity = value;
    }

    get secondaryOpacityDisplayed(): number {
        return this.secondaryOpacity;
    }

    set secondaryOpacityDisplayed(value: number) {
        this.secondaryOpacity = value;
    }

    assign(): void {
        this.colorService.setPrimaryColor(this.primaryColor);
        this.colorService.setSecondaryColor(this.secondaryColor);
        this.colorService.setPrimaryColorOpacity(this.primaryOpacity);
        this.colorService.setSecondaryColorOpacity(this.secondaryOpacity);
    }

    revert(): void {
        this.primaryColor = this.colorService.getPrimaryColor();
        this.secondaryColor = this.colorService.getSecondaryColor();
        this.primaryOpacity = this.colorService.getPrimaryColorOpacity();
        this.secondaryOpacity = this.colorService.getSecondaryColorOpacity();
    }

    needConfirmation(): boolean {
        const hasPrimaryColorChanged = this.primaryColor !== this.colorService.getPrimaryColor();
        const hasSecondaryColorChanged = this.secondaryColor !== this.colorService.getSecondaryColor();
        const hasPrimaryOpacityChanged = this.primaryOpacity !== this.colorService.getPrimaryColorOpacity();
        const hasSecondaryOpacityChanged = this.secondaryOpacity !== this.colorService.getSecondaryColorOpacity();
        return hasPrimaryColorChanged || hasSecondaryColorChanged || hasPrimaryOpacityChanged || hasSecondaryOpacityChanged;
    }
}
