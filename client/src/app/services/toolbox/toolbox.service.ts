import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';

import { PencilService } from '@app/services/tools/pencil-service';


@Injectable({
    providedIn: 'root',
})
export class ToolboxService {
    private availableTools: Tool[] = [];
    private currentTool: Tool;
    
    constructor(
        pencilService: PencilService) {
            this.availableTools.push(pencilService);
    }

    public getAvailableTools(): Tool[] {
        return this.availableTools;
    }

    public getCurrentTool(): Tool {
        return this.currentTool;
    }

    public setSelectedTool(selectedTool: Tool): void {
        this.currentTool = selectedTool;
    }
}
