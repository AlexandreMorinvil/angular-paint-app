import { Vec2 } from '../vec2';

export class InteractionSelection {
    hasDoneFirstSelection: boolean;
    startSelectionPoint: Vec2;
    movePosition: Vec2;
    selection: ImageData;
    belowSelection: ImageData;

    constructor(
        hasDoneFirstSelection: boolean,
        startSelectionPoint: Vec2,
        movePosition: Vec2,
        selection: ImageData,
        belowSelection: ImageData,
    ) {
        this.hasDoneFirstSelection = hasDoneFirstSelection;
        this.startSelectionPoint = startSelectionPoint;
        this.movePosition = movePosition;
        this.selection = selection;
        this.belowSelection = belowSelection;
    }
}
