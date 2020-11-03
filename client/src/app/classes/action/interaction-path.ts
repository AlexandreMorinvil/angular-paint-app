import { Vec2 } from '@app/classes/vec2';

export class InteractionPath {
    path: Vec2[];
    constructor(vec2: Vec2[]) {
        this.path = vec2;
    }
}
