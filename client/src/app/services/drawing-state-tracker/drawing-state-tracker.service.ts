import { Injectable } from '@angular/core';
import { Action } from '@app/classes/action/action';
import { Interaction } from '@app/classes/action/interactions';
import { Tool } from '@app/classes/tool';
import { AutoSaveService } from '@app/services/auto-save/auto-save.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingStateTrackerService {
    private intervalCanvasSave: number = 10;
    private actions: Action[] = [];
    private canvases: ImageData[] = [];
    private actionsToRedo: Action[] = [];
    private canvasesToRedo: ImageData[] = [];

    constructor(private drawingService: DrawingService, private autoSaveService: AutoSaveService) {}

    onCtrlZDown(): void {
        this.undo();
    }

    onCtrlShiftZDown(): void {
        this.redo();
    }

    addAction(tool: Tool, interaction: Interaction): void {
        if (this.canvases.length === 0) this.canvases.push(new ImageData(this.drawingService.canvas.width, this.drawingService.canvas.height));
        this.actionsToRedo = [];
        this.canvasesToRedo = [];

        this.actions.push(new Action(tool, interaction));
        if (this.actions.length % this.intervalCanvasSave === 0) this.saveCanvas();

        // autosave
        const DATA_URL: string = this.drawingService.baseCtx.canvas.toDataURL() as string;
        this.autoSaveService.autoSave(DATA_URL);
    }

    undo(): void {
        // Add the undone action and canvas to the redo state
        const ACTION_UNDONE: Action | undefined = this.actions.pop();
        if (!ACTION_UNDONE) return;
        this.actionsToRedo.push(ACTION_UNDONE);

        if (this.actions.length % this.intervalCanvasSave === this.intervalCanvasSave - 1) {
            // Reduce line of code and reduce complexity of tests
            // tslint:disable:no-non-null-assertion
            const cavasUndone: ImageData = this.canvases.pop()!;
            this.canvasesToRedo.push(cavasUndone);
        }
        this.reconstituteCanvas();
    }

    redo(): void {
        // Add the redone action and canvas to the done actions state
        const ACTION_TO_REDO: Action | undefined = this.actionsToRedo.pop();
        if (!ACTION_TO_REDO) return;
        this.actions.push(ACTION_TO_REDO);

        if (this.actions.length % this.intervalCanvasSave === 0) {
            // Reduce line of code and reduce complexity of tests
            // tslint:disable:no-non-null-assertion
            const cavasToRedo: ImageData = this.canvasesToRedo.pop()!;
            this.canvases.push(cavasToRedo);
        }
        this.reconstituteCanvas();
    }

    reset(): void {
        this.actions = [];
        this.canvases = [];
        this.actionsToRedo = [];
        this.canvasesToRedo = [];
    }
    // tslint:disable:no-bitwise
    private reconstituteCanvas(): void {
        // Bitwise operation is needed for functionality to work as intended
        // tslint:disable:no-bitwise
        const INDEX_CANVAS = (this.actions.length / this.intervalCanvasSave) | 0;
        const ACTION_TO_COMPUTE = this.actions.length % this.intervalCanvasSave;

        this.drawingService.resize(this.canvases[INDEX_CANVAS].width, this.canvases[INDEX_CANVAS].height);
        this.drawingService.printCanvas(this.canvases[INDEX_CANVAS]);
        for (let i = 0; i < ACTION_TO_COMPUTE; i++) {
            this.actions[INDEX_CANVAS * this.intervalCanvasSave + i].execute();
        }
    }

    private saveCanvas(): void {
        const CONTEX = this.drawingService.baseCtx;
        const CANVAS: ImageData = CONTEX.getImageData(0, 0, this.drawingService.getWidth(), this.drawingService.getHeight());
        this.canvases.push(CANVAS);
    }
}
