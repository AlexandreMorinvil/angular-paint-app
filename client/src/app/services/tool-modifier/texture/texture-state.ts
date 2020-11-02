import { ToolModifierState } from '@app/classes/tool-modifier-state';

export class TextureModifierState extends ToolModifierState {
    texture: string;
    constructor(texture: string) {
        super();
        this.texture = texture;
    }
}
