import { Component } from '@angular/core';
import { SprayDiameterService } from '@app/services/tool-modifier/spray-diameter/spray-diameter.service';

@Component({
    selector: 'app-attribute-spray-diameter',
    templateUrl: './attribute-spray-diameter.component.html',
    styleUrls: ['./attribute-spray-diameter.component.scss', '../attributes-section.component.scss'],
})
export class AttributeSprayDiameterComponent {
    sprayDiameter: number;

    constructor(private sprayService: SprayDiameterService) {
        this.sprayDiameter = this.sprayService.getSprayDiameter();
    }

    getMaxValue(): number {
        return this.sprayService.MAX_SPRAY_DIAMETER;
    }

    getMinValue(): number {
        return this.sprayService.MIN_SPRAY_DIAMETER;
    }

    assign(): void {
        this.sprayService.setSprayDiameter(this.sprayDiameter);
    }

    revert(): void {
        this.sprayDiameter = this.sprayService.getSprayDiameter();
    }

    needConfirmation(): boolean {
        return this.sprayDiameter !== this.sprayService.getSprayDiameter();
    }
}
