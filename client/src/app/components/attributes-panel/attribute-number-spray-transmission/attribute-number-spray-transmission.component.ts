import { Component } from '@angular/core';
import { NumberSprayTransmissionService } from '@app/services/tool-modifier/numberspraytransmission/numberspraytransmission.service';

@Component({
    selector: 'app-attribute-number-spray-transmission',
    templateUrl: './attribute-number-spray-transmission.component.html',
    styleUrls: ['./attribute-number-spray-transmission.component.scss', '../attributes-section.component.scss'],
})
export class AttributeNumberSprayTransmissionComponent {
    numberSprayTransmission: number;

    constructor(private numberSprayTransmissionService: NumberSprayTransmissionService) {
        this.numberSprayTransmission = this.numberSprayTransmissionService.getNumberSprayTransmission();
    }

    getMaxValue(): number {
        return this.numberSprayTransmissionService.MAX_NUMBER_SPRAY_TRANSMISSION;
    }

    getMinValue(): number {
        return this.numberSprayTransmissionService.MIN_NUMBER_SPRAY_TRANSMISSION;
    }

    assign(): void {
        this.numberSprayTransmissionService.setNumberSprayTransmission(this.numberSprayTransmission);
    }

    revert(): void {
        this.numberSprayTransmission = this.numberSprayTransmissionService.getNumberSprayTransmission();
    }

    needConfirmation(): boolean {
        return this.numberSprayTransmission !== this.numberSprayTransmissionService.getNumberSprayTransmission();
    }
}
