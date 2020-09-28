import { Component } from '@angular/core';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { ToolboxService } from '@app/services/toolbox/toolbox.service'

@Component({
    selector: 'app-attributes-width',
    templateUrl: './attributes-width.component.html',
    styleUrls: ['./attributes-width.component.scss', '../attributes-section.component.scss'],
})
export class AttributeWidthComponent {
    private width: number;

    constructor(private widthService: WidthService, private toolboxService: ToolboxService) {
        this.width = this.widthService.getWidth();
    }

    set widthDisplayed(value: number) {
        this.width = value;
    }

    get widthDisplayed(): number {
        return this.boundWidth(this.width);
    }

    getMaxValue(): number {
        return this.widthService.MAX_ATTRIBUTE_WIDTH;
    }

    getMinValue(): number {
        return this.toolboxService.getCurrentTool().getMinWidth;
    }

    assign(): void {
        this.widthService.setWidth(this.width);
    }

    revert(): void {
        this.width = this.widthService.getWidth();
    }

    needConfirmation(): boolean {
        return this.width !== this.widthService.getWidth();
    }

    private boundWidth(value: number): number{
        if (value <= this.getMinValue()) return this.getMinValue();
        else if (value >= this.getMaxValue()) return this.getMaxValue();
        else return value;
    }
}

