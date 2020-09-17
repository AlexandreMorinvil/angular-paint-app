import { Component } from '@angular/core';
/*import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { CursorService } from '@app/services/tools/cursor.service';*/
import { ToolboxService } from '@app/services/toolbox/toolbox.service';

@Component({
    selector: 'app-attributes-panel',
    templateUrl: './attributes-panel.component.html',
    styleUrls: ['./attributes-panel.component.scss'],
})
export class AttributesPanelComponent {

    toolbox: ToolboxService; 
    colorUse = "#000000";
    sizePoint= 1;

    constructor(toolboxService: ToolboxService) {
        this.toolbox = toolboxService;
    }

    set color(item:string){
        this.colorUse = item;
        this.toolbox.getCurrentTool().onColorChange(this.colorUse);
    }

    get color(): string {
        return this.colorUse;
    }
    
    set size(item:number){
        this.sizePoint = item;
        this.toolbox.getCurrentTool().onWidthChange(this.sizePoint);
    }

    get size(): number {
        return this.sizePoint;
    }
}
