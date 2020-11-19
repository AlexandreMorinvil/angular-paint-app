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
        const dataURL: string = this.drawingService.baseCtx.canvas.toDataURL() as string;
        this.autoSaveService.autoSave(dataURL);
    }

    undo(): void {
        // Add the undone action and canvas to the redo state
        const actionUndone: Action | undefined = this.actions.pop();
        if (!actionUndone) return;
        this.actionsToRedo.push(actionUndone);

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
        const actionToRedo: Action | undefined = this.actionsToRedo.pop();
        if (!actionToRedo) return;
        this.actions.push(actionToRedo);

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
        const indexCanvas = (this.actions.length / this.intervalCanvasSave) | 0;
        const actionsToCompute = this.actions.length % this.intervalCanvasSave;

        this.drawingService.resize(this.canvases[indexCanvas].width, this.canvases[indexCanvas].height);
        this.drawingService.printCanvas(this.canvases[indexCanvas]);
        for (let i = 0; i < actionsToCompute; i++) {
            this.actions[indexCanvas * this.intervalCanvasSave + i].execute();
        }
    }

    private saveCanvas(): void {
        const contex = this.drawingService.baseCtx;

        const canvas: ImageData = contex.getImageData(0, 0, this.drawingService.getWidth(), this.drawingService.getHeight());
        this.canvases.push(canvas);
    }
}
