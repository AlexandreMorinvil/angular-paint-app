import { Component } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { FillingService } from '@app/services/tool-modifier/filling/filling.service';
import { JunctionService } from '@app/services/tool-modifier/junction/junction.service';
import { TextureService } from '@app/services/tool-modifier/texture/texture.service';
import { ToleranceService } from '@app/services/tool-modifier/tolerance/tolerance.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';

@Component({
    selector: 'app-attributes-panel',
    templateUrl: './attributes-panel.component.html',
    styleUrls: ['./attributes-panel.component.scss'],
})
export class AttributesPanelComponent {
    constructor(
        private toolboxService: ToolboxService,
        private widthService: WidthService,
        private junctionService: JunctionService,
        private fillingServive: FillingService,
        private textureService: TextureService,
        private tracingService: TracingService,
        private toleranceService: ToleranceService,
    ) {}

    get currentTool(): Tool {
        return this.toolboxService.getCurrentTool();
    }

    capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    needsWidthAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.widthService);
    }

    needsJunctionAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.junctionService);
    }

    needsFillingAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.fillingServive);
    }

    needsTextureAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.textureService);
    }

    needsTracingAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.tracingService);
    }

    needsToleranceAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.toleranceService);
    }
}
