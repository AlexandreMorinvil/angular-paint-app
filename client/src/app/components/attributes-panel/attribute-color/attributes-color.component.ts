import { Component } from '@angular/core';
import { ColorService } from '@app/services/tool-modifier/color/color.service';

@Component({
    selector: 'app-attributes-color',
    templateUrl: './attributes-color.component.html',
    styleUrls: ['./attributes-color.component.scss', '../attributes-section.component.scss'],
})
export class AttributeColorComponent {
    primaryColor: string;
    secondaryColor: string;
    primaryOpacity: number;
    secondaryOpacity: number;

    constructor(private colorService: ColorService) {
        this.primaryColor = this.colorService.getPrimaryColor();
        this.secondaryColor = this.colorService.getSecondaryColor();
        this.primaryOpacity = this.colorService.getPrimaryColorOpacity();
        this.secondaryOpacity = this.colorService.getSecondaryColorOpacity();
    }

    getListOfPreviousColors() {
        return this.colorService.getPreviousColors();
    }

    intertwineColors() {
        this.colorService.intertwineColors();

        this.primaryColor = this.colorService.getPrimaryColor();
        this.primaryOpacity = this.colorService.getPrimaryColorOpacity();

        this.secondaryColor = this.colorService.getSecondaryColor();
        this.secondaryOpacity = this.colorService.getSecondaryColorOpacity();
    }

    selectPrimaryColorsQuick(color:string) {
        this.colorService.setPrimaryColor(color);
        this.primaryColor = this.colorService.getPrimaryColor();
    }

    selectSecondaryColorQuick(color:string) {
        this.colorService.setSecondaryColor(color);
        this.secondaryColor = this.colorService.getSecondaryColor();
    }

    assign(): void {
        this.colorService.setPrimaryColor(this.primaryColor);
        this.colorService.setSecondaryColor(this.secondaryColor);
        this.colorService.setPrimaryColorOpacity(this.primaryOpacity);
        this.colorService.setSecondaryColorOpacity(this.secondaryOpacity);
        this.primaryColor = this.colorService.getPrimaryColor();
        this.secondaryColor = this.colorService.getSecondaryColor();
        this.primaryOpacity = this.colorService.getPrimaryColorOpacity();
        this.secondaryOpacity = this.colorService.getSecondaryColorOpacity();
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
