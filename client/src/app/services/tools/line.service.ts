import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '../drawing/drawing.service';

// TODO : Déplacer ça dans un fichier séparé accessible par tous
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
    private savedData: ImageData;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        this.savedData = this.drawingService.previewCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);

        if (this.mouseDown) {
            //this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        //this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            //this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.baseCtx, this.pathData);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            //this.drawingService.clearCanvas(this.drawingService.previewCtx);
            //this.drawLine(this.drawingService.previewCtx, this.pathData);
        }
        //this.drawLine(this.drawingService.previewCtx, this.pathData);
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.putImageData(this.savedData, 0, 0);
        ctx.beginPath();
        let lastMouseMoveCoord = path[path.length - 1];

        ctx.moveTo(this.mouseDownCoord.x, this.mouseDownCoord.y);
        ctx.lineTo(lastMouseMoveCoord.x, lastMouseMoveCoord.y);
        console.log(lastMouseMoveCoord.x, lastMouseMoveCoord.y);
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
