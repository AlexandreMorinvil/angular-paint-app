import { Component } from '@angular/core';
import { SprayDropletDiameterService } from '@app/services/tool-modifier/spray-droplet-diameter/spray-droplet-diameter.service';

@Component({
    selector: 'app-attribute-spray-droplet-diameter',
    templateUrl: './attribute-spray-droplet-diameter.component.html',
    styleUrls: ['./attribute-spray-droplet-diameter.component.scss', '../attributes-section.component.scss'],
})
export class AttributeSprayDropletDiameterComponent {
    sprayDropletDiameter: number;

    constructor(private sprayDropletService: SprayDropletDiameterService) {
        this.sprayDropletDiameter = this.sprayDropletService.getSprayDropletDiameter();
    }

    getMaxValue(): number {
        return this.sprayDropletService.MAX_SPRAY_DROPLET_DIAMETER;
    }

    getMinValue(): number {
        return this.sprayDropletService.MIN_SPRAY_DROPLET_DIAMETER;
    }

    assign(): void {
        this.sprayDropletService.setSprayDropletDiameter(this.sprayDropletDiameter);
    }

    revert(): void {
        this.sprayDropletDiameter = this.sprayDropletService.getSprayDropletDiameter();
    }

    needConfirmation(): boolean {
        return this.sprayDropletDiameter !== this.sprayDropletService.getSprayDropletDiameter();
    }
}
