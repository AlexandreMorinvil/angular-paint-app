import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';

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
export class PencilService extends Tool {
    private pathData: Vec2[];
    color: string = '#000000';

    constructor(drawingService: DrawingService, private widthService: WidthService) {
        super(drawingService, new Description('crayon', 'c', 'pencil_icon.png'));
        this.modifiers.push(this.widthService);
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
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
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
 
            if (this.isInCanvas(mousePosition)) {
                this.pathData.push(mousePosition);
                // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.drawLine(this.drawingService.previewCtx, this.pathData);
            }
            else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.clearPath();
            }
 
        }
    }

    onColorChange(color: string): void {
        this.color = color;
    }

    private isInCanvas(mousePosition: Vec2): boolean {
        return (mousePosition.x <= this.drawingService.previewCtx.canvas.width &&
            mousePosition.y <= this.drawingService.previewCtx.canvas.height);
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        ctx.fillRect(path[0].x, path[0].y, this.widthService.getWidth(), this.widthService.getWidth());
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.lineWidth = this.widthService.getWidth(); // width ajustment
        ctx.strokeStyle = this.color; // color of the line
        ctx.fillStyle = this.color; // color of the starting point
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
