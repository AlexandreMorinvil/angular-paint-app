import { Component } from '@angular/core';
import { GridOpacityService } from '@app/services/tool-modifier/grid-opacity/grid-opacity.service';
import { GridService } from '@app/services/tools/grid/grid.service';

@Component({
    selector: 'app-attributes-grid-opacity',
    templateUrl: './attributes-grid-opacity.component.html',
    styleUrls: ['./attributes-grid-opacity.component.scss', '../attributes-section.component.scss'],
})
export class AttributeGridOpacityComponent {
    private gridOpacity: number;

    constructor(private gridOpacityService: GridOpacityService, private gridService: GridService) {
        this.gridOpacity = this.gridOpacityService.getGridOpacity();
    }

    set gridOpacityDisplayed(value: number) {
        this.gridOpacity = value;
    }

    get gridOpacityDisplayed(): number {
        return this.gridOpacity;
    }

    get stepSize(): number {
        return this.gridOpacityService.STEP_SIZE;
    }

    convertToPercentage(value: number): number {
        // The 100 is a multiplication factor for percentage conversion
        // tslint:disable-next-line:no-magic-numbers
        return Math.round(value * 100);
    }

    getMaxValue(): number {
        return this.gridOpacityService.MAX_ATTRIBUTE_GRID_OPACITY;
    }

    getMinValue(): number {
        return this.gridOpacityService.MIN_ATTRIBUTE_GRID_OPACITY;
    }

    assign(): void {
        this.gridOpacityService.setGridOpacity(this.gridOpacity);
        this.gridService.resetGrid();
    }

    revert(): void {
        this.gridOpacity = this.gridOpacityService.getGridOpacity();
    }

    needConfirmation(): boolean {
        return this.gridOpacity !== this.gridOpacityService.getGridOpacity();
    }
}
