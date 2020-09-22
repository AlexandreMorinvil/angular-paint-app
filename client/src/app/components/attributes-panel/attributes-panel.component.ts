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
    sizePoint= 1;
    textureUse = 0;
    enumKeys: any[] = [];
    
    constructor(private toolboxService: ToolboxService) {
        // this.enumKeys = Object.keys(this.textures).filter(f => !isNaN(Number(f)));
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

    // change(value: TextureEnum) {
    //     this.texture = value;
    // }

    // set texture(item:TextureEnum){
    //     this.textureUse = item;
    //     this.toolboxService.getCurrentTool().onTextureChange(this.textureUse);
    // }

    // get texture(): TextureEnum {
    //     return this.textureUse;
    // }

}
