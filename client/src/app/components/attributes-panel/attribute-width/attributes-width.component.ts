import { Component } from '@angular/core';
import { WidthService } from '@app/services/tool-modifier/width/width.service';

@Component({
    selector: 'app-attributes-width',
    templateUrl: './attributes-width.component.html',
    styleUrls: ['./attributes-width.component.scss', "../attributes-section.component.scss"],
})
export class AttributeWidthComponent {
    
    private _width:number;

    constructor(private widthService: WidthService) {
        this._width = this.widthService.value;
    }

    set width(value:number){
        this._width = value;
    }

    get width(): number {
        return this._width;
    }

    public getMaxValue() {
        return this.widthService.MAX_ATTRIBUTE_WIDTH;
    }

    public getMinValue() {
        return this.widthService.MIN_ATTRIBUTE_WIDTH;
    }

    public assign(): void {
        this.widthService.setValue(this._width);
    }

    public revert(): void {
        this._width = this.widthService.value;
    }

    public needConfirmation(): boolean {
        return this._width !== this.widthService.value;
    }
}
