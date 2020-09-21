import { Component } from '@angular/core';
import { WidthService } from '@app/services/tool-modifier/width/width.service';

@Component({
    selector: 'app-attributes-width',
    templateUrl: './attributes-width.component.html',
    styleUrls: ['./attributes-width.component.scss'],
})
export class AttributesWidthomponent {
    
    constructor(private widthService: WidthService) {
    }

    set width(value:number){
        this.widthService.value = value;
    }

    get width(): number {
        return this.widthService.value;
    }

    public getMaxValue() {
        return this.widthService.MAX_ATTRIBUTE_WIDTH;
    }

    public getMinValue() {
        return this.widthService.MIN_ATTRIBUTE_WIDTH;
    }
}
