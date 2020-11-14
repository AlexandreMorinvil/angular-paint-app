import { Vec2 } from '@app/classes/vec2';

export class InteractionPath {
    path: Vec2[];
    aerosolPath: Vec2[][];
    constructor(vec2: Vec2[]) {
        this.path = vec2;
        this.aerosolPath.push(vec2);
    }
}
