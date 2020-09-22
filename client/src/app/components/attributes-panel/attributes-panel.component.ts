import { Component } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';

@Component({
    selector: 'app-attributes-panel',
    templateUrl: './attributes-panel.component.html',
    styleUrls: ['./attributes-panel.component.scss'],
})
export class AttributesPanelComponent {
    colorUse = "#000000";

    constructor(private toolboxService: ToolboxService) {

    }

    get currentTool(): Tool {
        return this.toolboxService.getCurrentTool();
    }

    public capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    set color(item: string) {
        this.colorUse = item;
        this.toolboxService.getCurrentTool().onColorChange(this.colorUse);
    }

    get color(): string {
        return this.colorUse;
    }
}
