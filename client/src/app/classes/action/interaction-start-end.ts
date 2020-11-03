import { Interaction } from '@app/classes/action/interactions';
import { Vec2 } from '@app/classes/vec2';

export class InteractionStartEnd extends Interaction {
    startPoint: Vec2;
    path: Vec2[];
    shiftDown: boolean;

    constructor(startPoint: Vec2, path: Vec2[], shiftDown: boolean) {
        super();
        this.startPoint = startPoint;
        this.path = path;
        this.shiftDown = shiftDown;
    }
}
