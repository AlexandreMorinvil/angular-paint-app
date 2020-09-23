import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    private pathData: Vec2[];
    private width: number = 1;
    private mouseUp: boolean;
    private shiftDown: boolean;

    constructor(drawingService: DrawingService) {
        super(drawingService, 'ligne', 'L');
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseUp = false;
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            console.log(this.mouseDownCoord);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
            this.clearPath();
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
        }

        this.mouseUp = true;
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseUp && !this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);

            if (this.isInCanvas(mousePosition)) {
                this.pathData.push(mousePosition);
                // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawLine(this.drawingService.previewCtx, this.pathData);
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.clearPath();
            }
        }
    }

    onBackSpaceDown(): void {}

    onEscapeDown(): void {
        this.mouseUp = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.clearPath();
        //console.log('Escape was pressed!!!');
    }

    onMouseDblClick(): void {
        this.mouseUp = false;
        this.clearPath();
        //console.log('Mouse is double clicked!!!');
    }

    onShiftDown(): void {
        this.shiftDown = true;
    }
    onShiftUp(): void {
        this.shiftDown = false;
    }

    private isInCanvas(mousePosition: Vec2): boolean {
        return mousePosition.x <= this.drawingService.previewCtx.canvas.width && mousePosition.y <= this.drawingService.previewCtx.canvas.height;
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        let firstPath = path[0];
        let lastPath = path[path.length - 1];
        ctx.moveTo(firstPath.x, firstPath.y);
        ctx.lineTo(lastPath.x, lastPath.y);

        ctx.lineWidth = this.width; //width ajustment
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
