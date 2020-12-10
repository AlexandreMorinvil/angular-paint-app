import { Vec2 } from '@app/classes/vec2';

export class InteractionSelection {
    startSelectionPoint: Vec2;
    selection: ImageData;

    constructor(startSelectionPoint: Vec2, selection: ImageData) {
        this.startSelectionPoint = startSelectionPoint;
        this.selection = selection;
    }
}
