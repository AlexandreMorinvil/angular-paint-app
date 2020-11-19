import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridOpacityService } from '@app/services/tool-modifier/grid-opacity/grid-opacity.service';
import { SpacingService } from '@app/services/tool-modifier/spacing/spacing.service';
@Injectable({
    providedIn: 'root',
})
export class GridService extends Tool {
    gridCtx: CanvasRenderingContext2D;
    gridCanvas: HTMLCanvasElement;
    private isGridOn: boolean = false;
    private lineWidth: number = 1;

    constructor(private spacingService: SpacingService, private gridOpacityService: GridOpacityService) {
        super({} as DrawingService, new Description('grille', '4', 'grid_icon.png'));
        this.modifiers.push(this.spacingService);
        this.modifiers.push(this.gridOpacityService);
    }

    incrementSpacing(): void {
        this.spacingService.stepUp();
        this.resetGrid();
    }

    decrementSpacing(): void {
        this.spacingService.stepDown();
        this.resetGrid();
    }

    isGridActivated(): boolean {
        return this.isGridOn;
    }

    toogleGrid(): void {
        this.isGridOn = !this.isGridOn;
        this.resetGrid();
    }

    resetGrid(): void {
        this.gridCtx.clearRect(0, 0, this.gridCanvas.width, this.gridCanvas.height);
        if (this.isGridOn) this.drawGrid();
    }

    resize(width: number, height: number): void {
        this.gridCtx.canvas.width = width;
        this.gridCtx.canvas.height = height;
        this.resetGrid();
    }

    setAttribtes(): void {
        this.gridCtx.lineWidth = this.lineWidth;
        this.gridCtx.globalAlpha = this.gridOpacityService.getGridOpacity();
    }

    private drawGrid(): void {
        const width = this.gridCanvas.width;
        const height = this.gridCanvas.height;
        const spacing = this.spacingService.getSpacing();

        this.setAttribtes();
        for (let x = spacing; x <= width; x += spacing) {
            this.gridCtx.beginPath();
            this.gridCtx.moveTo(x, 0);
            this.gridCtx.lineTo(x, height);
            this.gridCtx.stroke();
            this.gridCtx.closePath();
        }
        for (let y = spacing; y <= height; y += spacing) {
            this.gridCtx.beginPath();
            this.gridCtx.moveTo(0, y);
            this.gridCtx.lineTo(width, y);
            this.gridCtx.stroke();
            this.gridCtx.closePath();
        }
    }
}
