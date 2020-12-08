import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';
import { TextureModifierState } from './texture-state';

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

    getTexture(): string {
        return this.texture;
    }

    setTexture(input: string): void {
        if (this.listTextures.includes(input)) this.texture = input;
    }

    getState(): TextureModifierState {
        return new TextureModifierState(this.texture);
    }

    setState(state: TextureModifierState): void {
        this.texture = state.texture;
    }
}
