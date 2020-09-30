import { Component } from '@angular/core';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';

@Component({
    selector: 'app-attributes-width',
    templateUrl: './attributes-width.component.html',
    styleUrls: ['./attributes-width.component.scss', '../attributes-section.component.scss'],
})
export class AttributeWidthComponent {
    // The interfacing of the with as a private variable is ncessary to force the input element of
    // the DOM to be reactive to the modifications of the value, the max value and the min value
    //  because of the getter and setter.
    private width: number;

    constructor(private widthService: WidthService, private toolboxService: ToolboxService) {
        this.width = this.widthService.getWidth();
    }

    set widthDisplayed(value: number) {
        this.width = value;
    }

    get widthDisplayed(): number {
        return Math.max(this.width, this.toolboxService.getCurrentTool().minWidth);
    }

    getMaxValue(): number {
        return this.widthService.MAX_ATTRIBUTE_WIDTH;
    }

    getMinValue(): number {
        return Math.max(this.toolboxService.getCurrentTool().minWidth, this.widthService.MIN_ATTRIBUTE_WIDTH);
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
}
