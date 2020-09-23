import { Component } from '@angular/core';
import { TextureService } from '@app/services/tool-modifier/texture/texture.service';

@Component({
    selector: 'app-attributes-texture',
    templateUrl: './attributes-texture.component.html',
    styleUrls: ['./attributes-texture.component.scss', '../attributes-section.component.scss'],
})
export class AttributeTextureComponent {
    private texture: string;

    constructor(private textureService: TextureService) {
        this.texture = this.textureService.getTexture();
    }

    set textureDisplayed(value: string) {
        this.texture = value;
    }

    get textureDisplayed(): string {
        return this.texture;
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
