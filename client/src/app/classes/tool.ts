import { DrawingService } from '@app/services/drawing/drawing.service';
import { Interaction } from './action/interactions';
import { Description } from './description';
import { ToolModifier } from './tool-modifier';
import { Vec2 } from './vec2';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    private description: Description;
    modifiers: ToolModifier[] = [];

    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
    mouseClick: boolean = false;
    minWidth: number = 1;
    shiftDown: boolean = false;

    constructor(protected drawingService: DrawingService, description: Description) {
        this.description = description;
    }

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onEscapeDown(event: KeyboardEvent): void {}

    onBackspaceDown(event: KeyboardEvent): void {}

    onMouseClick(event: MouseEvent): void {}

    onMouseDblClick(event: MouseEvent): void {}

    onShiftDown(event: KeyboardEvent): void {}

    onShiftUp(event: KeyboardEvent): void {}

    onCtrlShiftZDown(event: KeyboardEvent): void {}

    onCtrlZDown(event: KeyboardEvent): void {}

    onArrowDown(event: KeyboardEvent): void {}

    onArrowUp(event: KeyboardEvent): void {}

    onMouseScrollWheel(event: MouseEvent): void {}

    onAltDown(event: KeyboardEvent): void {}

    onAltUp(event: KeyboardEvent): void {}

    onCtrlADown(): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }

    execute(interaction: Interaction): void {}

    needsModifierManager(modifier: ToolModifier): boolean {
        return this.modifiers.includes(modifier);
    }

    isInCanvas(mousePosition: Vec2): boolean {
        return (
            mousePosition.x <= this.drawingService.previewCtx.canvas.width &&
            mousePosition.x >= 0 &&
            mousePosition.y <= this.drawingService.previewCtx.canvas.height &&
            mousePosition.y >= 0
        );
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
