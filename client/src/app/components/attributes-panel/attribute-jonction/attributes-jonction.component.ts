import { Component } from '@angular/core';
import { JonctionService } from '@app/services/tool-modifier/jonction/jonction.service';

@Component({
    selector: 'app-attributes-jonction',
    templateUrl: './attributes-jonction.component.html',
    styleUrls: ['./attributes-jonction.component.scss', '../attributes-section.component.scss'],
})
export class AttributeJonctionComponent {
    // The interfacing of the with as a private variable is ncessary to force the input element of
    // the DOM to be reactive to the modifications of the value, the max value and the min value
    //  because of the getter and setter.
    private diameter: number;

    constructor(private diameterService: JonctionService) {
        this.diameter = this.diameterService.getDiameter();
    }

    set diameterDisplayed(value: number) {
        this.diameter = value;
    }

    get diameterDisplayed(): number {
        return this.diameter;
    }

    getMaxValue(): number {
        return this.diameterService.MAX_JONCTION_DIAMETER;
    }

    getMinValue(): number {
        return this.diameterService.MIN_JONCTION_DIAMETER;
    }

    assign(): void {
        this.diameterService.setDiameter(this.diameter);
    }

    revert(): void {
        this.diameter = this.diameterService.getDiameter();
    }

    needConfirmation(): boolean {
        return this.diameter !== this.diameterService.getDiameter();
    }
}
