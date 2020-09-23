import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';

export enum TextureEnum {
    shadowTexture = 'ombrée',
    gradientTexture = 'dégradée',
    squareTexture = 'carrotée',
    dashTexture = 'pointillée',
    zigzagTexture = 'zigzaguée',
}

@Injectable({
    providedIn: 'root',
})
export class TextureService extends ToolModifier {
    private listTextures: string[];
    private texture: string = TextureEnum.shadowTexture;

    constructor() {
        super();
        this.listTextures = Object.values(TextureEnum);
    }

    getListTextures(): string[] {
        return this.listTextures;
    }

    setValue(input: string): void {
        if (this.listTextures.includes(input)) this.texture = input;
    }

    get value(): string {
        return this.texture;
    }
}
