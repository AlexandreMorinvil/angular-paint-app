import { Component } from '@angular/core';
import { FillingService } from '@app/services/tool-modifier/filling/filling.service';

@Component({
    selector: 'app-attributes-filling',
    templateUrl: './attributes-filling.component.html',
    styleUrls: ['./attributes-filling.component.scss', '../attributes-section.component.scss'],
})
export class AttributeFillingComponent {
    neighboursPixelsOnly: boolean;

    constructor(private fillingService: FillingService) {
        this.neighboursPixelsOnly = this.fillingService.getNeighbourPixelsOnly();
    }

    assign(): void {
        this.fillingService.setNeighbourPixelsOnly(this.neighboursPixelsOnly);
    }

    revert(): void {
        this.neighboursPixelsOnly = this.fillingService.getNeighbourPixelsOnly();
    }

    needConfirmation(): boolean {
        return this.neighboursPixelsOnly !== this.fillingService.getNeighbourPixelsOnly();
    }
}
