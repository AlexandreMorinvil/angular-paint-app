import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { BrushService } from '@app/services/tools/brush/brush-service';
import { CursorService } from '@app/services/tools/cursor/cursor.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { LineService } from '@app/services/tools/line/line-service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';

@Injectable({
    providedIn: 'root',
})
export class ToolboxService {
    private availableTools: Tool[] = [];
    private currentTool: Tool;

    constructor(
        cursorService: CursorService,
        pencilService: PencilService,
        brushService: BrushService,
        rectangleService: RectangleService,
        ellipseService: EllipseService,
        lineService: LineService,
    ) {
        this.currentTool = cursorService;
        this.availableTools.push(cursorService);
        this.availableTools.push(pencilService);
        this.availableTools.push(brushService);
        this.availableTools.push(rectangleService);
        this.availableTools.push(ellipseService);
        this.availableTools.push(lineService);
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
