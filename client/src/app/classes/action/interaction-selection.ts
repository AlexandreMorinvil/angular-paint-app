import { Vec2 } from '../vec2';

export class InteractionSelection {
    startSelectionPoint: Vec2;
    endSelectionPoint: Vec2;

    constructor(startSelectionPoint: Vec2, endSelectionPoint: Vec2) {
        this.startSelectionPoint = startSelectionPoint;
        this.endSelectionPoint = endSelectionPoint;
    }
}
