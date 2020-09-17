import { Component } from '@angular/core';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';
import { TextureEnum } from '@app/services/tools/brush/brush-service';

@Component({
    selector: 'app-attributes-panel',
    templateUrl: './attributes-panel.component.html',
    styleUrls: ['./attributes-panel.component.scss'],
})
export class AttributesPanelComponent {

    toolbox: ToolboxService; 
    colorUse = "#000000";
    sizePoint= 1;
    textureUse = 0;
    textures = TextureEnum;
    enumKeys: any[] = [];
    
    constructor(toolboxService: ToolboxService) {
        this.toolbox = toolboxService;
        this.enumKeys = Object.keys(this.textures).filter(f => !isNaN(Number(f)));
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

    change(value: TextureEnum) {
        this.texture = value;
    }

    set texture(item:TextureEnum){
        this.textureUse = item;
        this.toolbox.getCurrentTool().onTextureChange(this.textureUse);
    }

    get texture(): TextureEnum {
        return this.textureUse;
    }

}
