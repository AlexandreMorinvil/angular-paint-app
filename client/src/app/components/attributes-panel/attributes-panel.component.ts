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

    set color(item:string){
        this.colorUse = item;
        this.toolboxService.getCurrentTool().onColorChange(this.colorUse);
    }

    get color(): string {
        return this.colorUse;
    }
}
