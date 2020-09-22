import { Component } from '@angular/core';
import { TextureService } from '@app/services/tool-modifier/texture/texture.service';

@Component({
    selector: 'app-attributes-texture',
    templateUrl: './attributes-texture.component.html',
    styleUrls: ['./attributes-texture.component.scss'],
})
export class AttributesTextureComponent {
    
    constructor(private textureService: TextureService) {
    }

    set texture(value:string){
        this.textureService.value = value;
    }

    get texture(): string {
        return this.textureService.value;
    }

    public getListTextures() {
        return this.textureService.getListTextures();
    }
}
