import { Interaction } from '@app/classes/action/interactions';
import { Vec2 } from '@app/classes/vec2';

export class InteractionText extends Interaction {
    text: string[];
    textPosition: Vec2;
    adjustment: number;
    numberOfLines: number;

    constructor(text: string[], textPosition: Vec2, adjustment: number, numberOfLines: number) {
        super();
        this.text = text;
        this.textPosition = textPosition;
        this.adjustment = adjustment;
        this.numberOfLines = numberOfLines;
    }
}
