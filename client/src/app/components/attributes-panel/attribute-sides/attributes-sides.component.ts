import { Component } from '@angular/core';
import { SidesService } from '@app/services/tool-modifier/sides/sides.service';

@Component({
    selector: 'app-attributes-sides',
    templateUrl: './attributes-sides.component.html',
    styleUrls: ['./attributes-sides.component.scss', '../attributes-section.component.scss'],
})
export class AttributesSidesComponent {
    numberSides: number;

    constructor(private sideServices: SidesService) {
        this.numberSides = this.sideServices.getSide();
    }

    getMaxValue(): number {
        return this.sideServices.MAX_POLYGON_SIDE;
    }

    getMinValue(): number {
        return this.sideServices.MIN_POLYGON_SIDE;
    }

    assign(): void {
        this.sideServices.setSide(this.numberSides);
    }

    revert(): void {
        this.numberSides = this.sideServices.getSide();
    }

    needConfirmation(): boolean {
        return this.numberSides !== this.sideServices.getSide();
    }
}
