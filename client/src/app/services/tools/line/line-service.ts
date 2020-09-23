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

    constructor(drawingService: DrawingService) {
        super(drawingService, 'ligne', 'l');
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        /* this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        } */
    }

    /* onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
        }
        this.mouseDown = false;
        this.clearPath();
    } */

    onMouseMove(event: MouseEvent): void {
        if (this.mouseClick) {
            const mousePosition = this.getPositionFromMouse(event);

            if (this.isInCanvas(mousePosition)) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.pathData[0] = this.mouseDownCoord;
                this.pathData.push(mousePosition);
                this.drawLine(this.drawingService.previewCtx, this.pathData);

                // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.clearPath();
            }
        }
    }

    onEscapeDown(): void {
        this.mouseClick = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.clearPath();
        console.log('Escape was pressed!!!');
    }

    onMouseClick(event: MouseEvent): void {
        this.mouseClick = event.button === MouseButton.Left;
        if (this.mouseClick) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
            this.clearPath();
        }
        this.mouseClick = true;
        console.log('Mouse is clicked!!!');
    }

    onMouseDblClick(): void {
        this.mouseClick = false;
        this.clearPath();
        console.log('Mouse is double clicked!!!');
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

    /*  private drawLinePreview(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
      ctx.beginPath();
      for (const point of path) {
          ctx.lineTo(point.x, point.y);
      }
      ctx.lineWidth = this.width; //width ajustment
      ctx.stroke();
     } */

    private clearPath(): void {
        this.pathData = [];
    }
}
