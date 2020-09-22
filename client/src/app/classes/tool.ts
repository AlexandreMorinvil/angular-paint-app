import { DrawingService } from '@app/services/drawing/drawing.service';
import { Description } from './description';
import { ToolModifier } from './toolModifier';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    private description: Description;
    protected modifiers: ToolModifier<number | string | boolean>[];

    mouseDownCoord: Vec2;
    mouseDown: boolean = false;

    constructor(
        protected drawingService: DrawingService,
        description: Description
        ) {
        this.description = description;
    }

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onColorChange(color : string): void {}

    onShiftDown(event: KeyboardEvent): void {}

    onShiftUp(event: KeyboardEvent): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }

    get name(): string {
        return this.description.name;
    }

    get shortcut(): string {
        return this.description.shortcut;
    }

    get iconDirectory(): string {
        return this.description.iconDirectory;
    }
}
