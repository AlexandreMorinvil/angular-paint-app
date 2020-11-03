import { Vec2 } from '../vec2';

export class InteractionSelectionEllipse {
    hasDoneFirstSelection: boolean;
    startSelectionPoint: Vec2;
    movePosition: Vec2;
    selection: ImageData;
    belowSelection: ImageData;
    imageSize: Vec2;
    imageStart: Vec2;

    constructor(
        //hasDoneFirstSelection: boolean,
        startSelectionPoint: Vec2, // point debut selection
        //movePosition: Vec2, // point debut selection apres mouvement
        selection: ImageData,
        //belowSelection: ImageData,
        //imageSize: Vec2,    // width et height selection
        //imageStart: Vec2
    ) {
        //this.hasDoneFirstSelection = hasDoneFirstSelection;
        this.startSelectionPoint = startSelectionPoint;
        //this.movePosition = movePosition;
        this.selection = selection;
        //this.belowSelection = belowSelection;
        //this.imageSize = imageSize;
        //this.imageStart = imageStart;
    }
}
