import { Component } from '@angular/core';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';

@Component({
    selector: 'app-attribute-selection',
    templateUrl: './attribute-selection.component.html',
    styleUrls: ['./attribute-selection.component.scss', '../attributes-section.component.scss'],
})
export class AttributeSelectionComponent {
    constructor(private toolboxService: ToolboxService) {}

    onClick(): void {
        this.toolboxService.getCurrentTool().onCtrlADown();
    }
}
