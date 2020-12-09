import { Component } from '@angular/core';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle-selection.service';
import { SelectionToolService } from '@app/services/tools/selection/selection-tool.service';
@Component({
    selector: 'app-attribute-selection-manipulation',
    templateUrl: './attribute-selection-manipulation.component.html',
    styleUrls: ['./attribute-selection-manipulation.component.scss', '../attributes-section.component.scss'],
})
export class AttributeSelectionManipulationComponent {
    constructor(private toolboxService: ToolboxService, private rectangleSelectionService: RectangleSelectionService) {}

    copy(): void {
        if (this.toolboxService.getCurrentTool() instanceof SelectionToolService)
            (this.toolboxService.getCurrentTool() as SelectionToolService).copy();
    }

    paste(): void {
        if (this.toolboxService.getCurrentTool() instanceof SelectionToolService)
            this.toolboxService.setSelectedTool(this.rectangleSelectionService);
            (this.toolboxService.getCurrentTool() as SelectionToolService).paste();
    }

    cut(): void {
        if (this.toolboxService.getCurrentTool() instanceof SelectionToolService)
            (this.toolboxService.getCurrentTool() as SelectionToolService).cut();
    }

    delete(): void {
        if (this.toolboxService.getCurrentTool() instanceof SelectionToolService)
            (this.toolboxService.getCurrentTool() as SelectionToolService).delete();
    }

    isAvailable(): boolean {
        if (this.toolboxService.getCurrentTool() instanceof SelectionToolService)
            return (this.toolboxService.getCurrentTool() as SelectionToolService).selectionCreated;
        return false;
    }
}
