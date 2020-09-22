import { Component } from '@angular/core';
import { TextureService } from '@app/services/tool-modifier/texture/texture.service';

@Component({
    selector: 'app-attributes-texture',
    templateUrl: './attributes-texture.component.html',
    styleUrls: ['./attributes-texture.component.scss', "../attributes-section.component.scss"],
})
export class AttributeTextureComponent {
    
    private _texture:string;

    constructor(private textureService: TextureService) {
        this._texture = this.textureService.value
    }

    set texture(value:string){
        this._texture = value;
    }

    get texture(): string {
        return this._texture;
    }

    public getListTextures() {
        return this.textureService.getListTextures();
    }

    public assign(): void {
        this.textureService.setValue(this._texture);
    }

    public revert(): void {
        this._texture = this.textureService.value;
    }

    public needConfirmation(): boolean {
        return this._texture !== this.textureService.value;
    }
}
