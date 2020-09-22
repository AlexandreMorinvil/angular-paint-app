import { Component } from '@angular/core';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';

@Component({
    selector: 'app-attributes-tracing',
    templateUrl: './attributes-tracing.component.html',
    styleUrls: ['./attributes-tracing.component.scss', "../attributes-section.component.scss"],
})
export class AttributeTracingComponent {

    constructor(private tracingService: TracingService) {
    }

    get contour(): boolean {
        return this.tracingService.valueContour;
    }
    
    get fill(): boolean {
        return this.tracingService.valueFill;
    }
    
    set contour(value:boolean){
        this.tracingService.valueContour = value;
    }

    set fill(value: boolean) {
        this.tracingService.valueFill = value;
    }
}
