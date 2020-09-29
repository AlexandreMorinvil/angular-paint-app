import { Component } from '@angular/core';
import { TextureService } from '@app/services/tool-modifier/texture/texture.service';

@Component({
    selector: 'app-attributes-texture',
    templateUrl: './attributes-texture.component.html',
    styleUrls: ['./attributes-texture.component.scss', '../attributes-section.component.scss'],
})
export class AttributeTextureComponent {
    texture: string;

    constructor(private textureService: TextureService) {
        this.texture = this.textureService.getTexture();
    }

    getListTextures(): string[] {
        return this.textureService.getListTextures();
    }

    assign(): void {
        this.textureService.setTexture(this.texture);
    }

    revert(): void {
        this.texture = this.textureService.getTexture();
    }

    needConfirmation(): boolean {
        return this.texture !== this.textureService.getTexture();
    }
}
