import { Vec2 } from '@app/classes/vec2';
import { Interaction } from './interactions';

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
