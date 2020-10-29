import { Injectable } from '@angular/core';
import { Action } from '@app/classes/action/action';
import { Interaction } from '@app/classes/action/interactions';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class DrawingStateTrackerService {
    private intervalCanvasSave: number = 2;
    private actions: Action[] = [];
    private canvases: ImageData[] = [];
    private actionsToRedo: Action[] = [];
    private canvasesToRedo: ImageData[] = [];

    constructor(private drawingService: DrawingService) {}

    addAction(tool: Tool, interaction: Interaction): void {
        if (this.canvases.length === 0) this.canvases.push(new ImageData(this.drawingService.getWidth(), this.drawingService.getHeight()));
        this.actionsToRedo = [];
        this.canvasesToRedo = [];

        this.actions.push(new Action(tool, interaction));
        if (this.actions.length % this.intervalCanvasSave === 0) this.saveCanvas();
    }

    undo(): void {
        // Add the undone action and canvas to the redo state
        const actionUndone: Action | undefined = this.actions.pop();
        if (!actionUndone) return;
        this.actionsToRedo.push(actionUndone);

        if (this.actions.length % this.intervalCanvasSave === this.intervalCanvasSave - 1) {
            const cavasUndone: ImageData | undefined = this.canvases[this.canvases.length - 1];
            if (cavasUndone) this.canvasesToRedo.push(cavasUndone);
        }
        this.reconstituteCanvas();
    }

    redo(): void {
        // Add the redone action and canvas to the done actions state
        const actionToRedo: Action | undefined = this.actionsToRedo.pop();
        if (!actionToRedo) return;
        this.actions.push(actionToRedo);

        if (this.actions.length % this.intervalCanvasSave === 0) {
            const cavasToRedo: ImageData | undefined = this.canvasesToRedo.pop();
            if (cavasToRedo) this.canvasesToRedo.push(cavasToRedo);
        }
        this.reconstituteCanvas();
    }

    reset(): void {
        this.actions = [];
        this.canvases = [];
        this.actionsToRedo = [];
        this.canvasesToRedo = [];
    }

    private reconstituteCanvas(): void {
        const indexCanvas = (this.actions.length / this.intervalCanvasSave) | 0;
        const actionsToCompute = this.actions.length % this.intervalCanvasSave;

        console.log(this.canvases[indexCanvas]);
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
