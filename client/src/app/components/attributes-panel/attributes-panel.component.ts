import { Component } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ColorPickerViewerService } from '@app/services/tool-modifier/color-picker-viewer/color-picker-viewer.service';
import { GridOpacityService } from '@app/services/tool-modifier/grid-opacity/grid-opacity.service';
import { JunctionService } from '@app/services/tool-modifier/junction/junction.service';
import { NumberSprayTransmissionService } from '@app/services/tool-modifier/numberspraytransmission/numberspraytransmission.service';
import { SidesService } from '@app/services/tool-modifier/sides/sides.service';
import { SpacingService } from '@app/services/tool-modifier/spacing/spacing.service';
import { SprayDiameterService } from '@app/services/tool-modifier/spraydiameter/spray-diameter.service';
import { SprayDropletDiameterService } from '@app/services/tool-modifier/spraydropletdiameter/spraydropletdiameter.service';
import { StampPickerService } from '@app/services/tool-modifier/stamp-picker/stamp-picker.service';
import { TextureService } from '@app/services/tool-modifier/texture/texture.service';
import { ToleranceService } from '@app/services/tool-modifier/tolerance/tolerance.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';
import { SelectionToolService } from '@app/services/tools/selection/selection-tool.service';

@Component({
    selector: 'app-attributes-panel',
    templateUrl: './attributes-panel.component.html',
    styleUrls: ['./attributes-panel.component.scss'],
})
export class AttributesPanelComponent {
    constructor(
        private toolboxService: ToolboxService,
        private spacingService: SpacingService,
        private gridOpacityService: GridOpacityService,
        private widthService: WidthService,
        private junctionService: JunctionService,
        private sideService: SidesService,
        private sprayService: SprayDiameterService,
        private sprayDropletService: SprayDropletDiameterService,
        private numberSprayTransmissionService: NumberSprayTransmissionService,
        private textureService: TextureService,
        private tracingService: TracingService,
        private colorPickerViewerService: ColorPickerViewerService,
        private toleranceService: ToleranceService,
        private stampPickerService: StampPickerService,
    ) {}

    get currentTool(): Tool {
        return this.toolboxService.getCurrentTool();
    }

    capitalizeFirstLetter(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    needsSpacingAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.spacingService);
    }

    needsGridOpacityAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.gridOpacityService);
    }

    needsWidthAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.widthService);
    }

    needsJunctionAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.junctionService);
    }

    needsTextureAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.textureService);
    }

    needsTracingAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.tracingService);
    }
    needsSidesAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.sideService);
    }
    needsSprayDiameterAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.sprayService);
    }
    needsSprayDropletDiameterAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.sprayDropletService);
    }
    needsNumberSprayTransmissionAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.numberSprayTransmissionService);
    }

    needsColorPickerViewerAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.colorPickerViewerService);
    }

    needsToleranceAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.toleranceService);
    }
    needsStampPickerAttribute(): boolean {
        return this.currentTool.needsModifierManager(this.stampPickerService);
    }

    needsSelectionAttribute(): boolean {
        return this.currentTool instanceof SelectionToolService;
    }

    needsGridDisplayAttribute(): boolean {
        return this.currentTool.name === 'grille';
    }
}
