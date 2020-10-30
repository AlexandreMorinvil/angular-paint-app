import { Vec2 } from '../vec2';

export class InteractionSelection {
    isFirstSelection: boolean;
    startSelectionPoint: Vec2;
    endSelectionPoint: Vec2;
    movePosition: Vec2;
    selection: ImageData;
    belowSelection: ImageData;

    constructor(
        isFirstSelection: boolean,
        startSelectionPoint: Vec2,
        endSelectionPoint: Vec2,
        movePosition: Vec2,
        selection: ImageData,
        belowSelection: ImageData,
    ) {
        this.isFirstSelection = isFirstSelection;
        this.startSelectionPoint = startSelectionPoint;
        this.endSelectionPoint = endSelectionPoint;
        this.movePosition = movePosition;
        this.selection = selection;
        this.belowSelection = belowSelection;
    }
}
