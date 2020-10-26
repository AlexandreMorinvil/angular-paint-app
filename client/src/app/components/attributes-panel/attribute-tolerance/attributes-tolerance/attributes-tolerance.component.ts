import { Component } from '@angular/core';
import { ToleranceService } from '@app/services/tool-modifier/tolerance/tolerance.service';

@Component({
    selector: 'app-attributes-tolerance',
    templateUrl: './attributes-tolerance.component.html',
    styleUrls: ['./attributes-tolerance.component.scss'],
})
export class AttributesToleranceComponent {
    tolerance: number;

    constructor(private toleranceService: ToleranceService) {
        this.tolerance = this.toleranceService.getPercentTolerance();
    }

    getMaxValue(): number {
        return this.toleranceService.MAX_TOLERANCE;
    }

    getMinValue(): number {
        return this.toleranceService.MIN_TOLERANCE;
    }

    assign(): void {
        this.toleranceService.setTolerance(this.tolerance);
    }

    revert(): void {
        this.tolerance = this.toleranceService.getPercentTolerance();
    }

    needConfirmation(): boolean {
        return this.tolerance !== this.toleranceService.getPercentTolerance();
    }
}
