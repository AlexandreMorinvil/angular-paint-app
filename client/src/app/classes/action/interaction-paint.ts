import { Interaction } from '@app/classes/action/interactions';
import { MouseButton } from '@app/classes/mouse';
import { Vec2 } from '@app/classes/vec2';

export class InteractionPaint extends Interaction {
    mouseButton: MouseButton;
    mouseDownCoord: Vec2;
    startR: number;
    startG: number;
    startB: number;
    fillColorR: number;
    fillColorG: number;
    fillColorB: number;

    constructor(
        mouseButton: MouseButton,
        mouseDownCoord: Vec2,
        startR: number,
        startG: number,
        startB: number,
        fillColorR: number,
        fillColorG: number,
        fillColorB: number,
    ) {
        super();
        this.mouseButton = mouseButton;
        this.mouseDownCoord = mouseDownCoord;
        this.startR = startR;
        this.startG = startG;
        this.startB = startB;
        this.fillColorR = fillColorR;
        this.fillColorG = fillColorG;
        this.fillColorB = fillColorB;
    }
}
