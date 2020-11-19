import { Component, OnDestroy } from '@angular/core';
import { SpacingService } from '@app/services/tool-modifier/spacing/spacing.service';
import { GridService } from '@app/services/tools/grid/grid.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-attributes-spacing',
    templateUrl: './attributes-spacing.component.html',
    styleUrls: ['./attributes-spacing.component.scss', '../attributes-section.component.scss'],
})
export class AttributeSpacingComponent implements OnDestroy {
    private spacing: number;
    private subscription: Subscription;

    constructor(private spacingService: SpacingService, private gridService: GridService) {
        this.spacing = this.spacingService.getSpacing();
        this.subscription = spacingService.spacingChange.subscribe((value) => {
            this.spacing = value;
        });
    }

    set spacingDisplayed(value: number) {
        this.spacing = value;
    }

    get spacingDisplayed(): number {
        return this.spacing;
    }

    get stepSize(): number {
        return this.spacingService.STEP_SIZE;
    }

    getMaxValue(): number {
        return this.spacingService.MAX_ATTRIBUTE_SPACING;
    }

    getMinValue(): number {
        return this.spacingService.MIN_ATTRIBUTE_SPACING;
    }

    assign(): void {
        this.spacingService.setSpacing(this.spacing);
        this.gridService.resetGrid();
    }

    revert(): void {
        this.spacing = this.spacingService.getSpacing();
    }

    needConfirmation(): boolean {
        return this.spacing !== this.spacingService.getSpacing();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
