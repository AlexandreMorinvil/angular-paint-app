import { Component } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {

    constructor(private toolboxSevice: ToolboxService) {}

    public getListOfTools(): Tool[] {
        return this.toolboxSevice.getAvailableTools();
    }

    public getCurrentTool(): Tool {
        return this.toolboxSevice.getCurrentTool();
    }


    public setCurrentTool(tool: Tool): void {
        this.toolboxSevice.setSelectedTool(tool);
    }

    public formatTooltipMessage(tool: Tool): string {
        return "Outil : " + tool.name + "\n( Raccourci: " + tool.shortcut + " )";
    }
}
