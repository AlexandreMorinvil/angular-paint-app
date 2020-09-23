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

    constructor(drawingService: DrawingService) {
        super(drawingService, 'ligne', 'L');
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            //this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            //this.drawLine(this.drawingService.baseCtx, this.pathData);
            //this.clearPath();
            this.mouseUp = false;
            //console.log('down and down');
            //console.log(this.mouseDownCoord);
        }
        //this.drawLine(this.drawingService.baseCtx, this.pathData);
        //this.clearPath();
        //this.mouseDownCoord = this.getPositionFromMouse(event);
        //this.pathData.push(this.mouseDownCoord);
        //console.log('down');
        //console.log(this.mouseDownCoord);
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            //this.mouseDownCoord = mousePosition;
        }
        this.drawLine(this.drawingService.baseCtx, this.pathData);
        this.clearPath();
        //console.log('up dans down');
        //console.log(mousePosition);
        //this.drawLine(this.drawingService.baseCtx, this.pathData);
        //this.clearPath();
        //console.log('up');
        //console.log(mousePosition);

        this.mouseUp = true;
        this.mouseDown = false;
        //this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseUp) {
            const mousePosition = this.getPositionFromMouse(event);

            if (this.isInCanvas(mousePosition)) {
                this.pathData.push(mousePosition);
                // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                //console.log('move');
                //console.log(mousePosition);

                this.drawLine(this.drawingService.previewCtx, this.pathData);
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.clearPath();
            }
        }
    }

    onBackSpaceDown(): void {
        //this.drawingService.canvas.removeChild()
        //remove last line
        //let firstPath = this.pathData[0];
        let lastPath = this.pathData[this.pathData.length - 1];
        //console.log(lastPath.x, lastPath.y);
        this.drawingService.previewCtx.clearRect(lastPath.x, lastPath.y, 1, 0);
    }

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
