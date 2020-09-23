import { Component } from '@angular/core';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';

@Component({
    selector: 'app-attributes-tracing',
    templateUrl: './attributes-tracing.component.html',
    styleUrls: ['./attributes-tracing.component.scss', '../attributes-section.component.scss'],
})
export class AttributeTracingComponent {
    private hasContour: boolean;
    private hasFill: boolean;

    constructor(private tracingService: TracingService) {
        this.contour = this.tracingService.getHasContour();
        this.fill = this.tracingService.getHasFill();
    }

    get contour(): boolean {
        return this.hasContour;
    }

    set contour(value: boolean) {
        this.hasContour = value;
    }

    get fill(): boolean {
        return this.hasFill;
    }

    set fill(value: boolean) {
        this.hasFill = value;
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
