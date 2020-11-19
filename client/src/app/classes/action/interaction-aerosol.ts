import { Vec2 } from '../vec2';

export class InteractionAerosol {
    path: Vec2[];
    sprayDropletDiameter: number;
    constructor(vec2: Vec2[], sprayDropletDiameter: number) {
        this.path = vec2;
        this.sprayDropletDiameter = sprayDropletDiameter;
    }
}
