import { Component } from '@angular/core';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';

@Component({
    selector: 'app-attributes-tracing',
    templateUrl: './attributes-tracing.component.html',
    styleUrls: ['./attributes-tracing.component.scss', "../attributes-section.component.scss"],
})
export class AttributeTracingComponent {

    private _contour: boolean;
    private _fill: boolean;

    constructor(private tracingService: TracingService) {
        this._contour = this.tracingService.valueContour;
        this._fill = this.tracingService.valueFill;
    }

    get contour(): boolean {
        return this._contour;
    }

    get fill(): boolean {
        return this._fill;
    }

    set contour(value: boolean) {
        this._contour = value;
    }

    set fill(value: boolean) {
        this._fill = value;
    }

    public assign(): void {
        this.tracingService.setContourValue(this._contour);
        this.tracingService.setFillValue(this._fill);
    }

    public revert(): void {
        this._contour = this.tracingService.valueContour;
        this._fill = this.tracingService.valueFill;
    }

    public needConfirmation(): boolean {
        return (this._contour !== this.tracingService.valueContour) ||
            (this._fill !== this.tracingService.valueFill);
    }
}
