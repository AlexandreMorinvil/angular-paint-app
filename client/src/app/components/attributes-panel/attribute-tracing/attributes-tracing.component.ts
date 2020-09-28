import { Component } from '@angular/core';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';

@Component({
    selector: 'app-attributes-tracing',
    templateUrl: './attributes-tracing.component.html',
    styleUrls: ['./attributes-tracing.component.scss', '../attributes-section.component.scss'],
})
export class AttributeTracingComponent {
    hasContour: boolean;
    hasFill: boolean;

    constructor(private tracingService: TracingService) {
        this.hasContour = this.tracingService.getHasContour();
        this.hasFill = this.tracingService.getHasFill();
    }

    assign(): void {
        this.tracingService.setHasContour(this.hasContour);
        this.tracingService.setHasFill(this.hasFill);
    }

    revert(): void {
        this.hasContour = this.tracingService.getHasContour();
        this.hasFill = this.tracingService.getHasFill();
    }

    needConfirmation(): boolean {
        return this.hasContour !== this.tracingService.getHasContour() || this.hasFill !== this.tracingService.getHasFill();
    }
}
