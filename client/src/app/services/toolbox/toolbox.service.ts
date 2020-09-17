import { Injectable} from '@angular/core';
import { Tool } from '@app/classes/tool';

import { PencilService } from '@app/services/tools/pencil-service';
import { CursorService } from '@app/services/tools/cursor.service';


@Injectable({
    providedIn: 'root',
})
export class ToolboxService {
    private availableTools: Tool[] = [];
    private currentTool: Tool;
    
    constructor(
        cursorService: CursorService,
        pencilService: PencilService) {
            this.currentTool = cursorService;
            this.availableTools.push(cursorService);
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
