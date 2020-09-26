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
export class EraserService extends Tool {
    private pathData: Vec2[];
    private eraserColor: string = "#FFFFFF"

    constructor(drawingService: DrawingService, private widthService: WidthService) {
        super(drawingService, new Description('efface', 'e', 'erase_icon.png'));
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
            this.pathData.push(mousePosition);

            // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.EraserVisual(event);
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.lineWidth = this.widthService.getWidth(); // width ajustment
        ctx.strokeStyle = this.eraserColor;
        ctx.fillStyle = this.eraserColor;
        const startingPointAdjustment = 2;
        ctx.fillRect(
          path[0].x - this.widthService.getWidth() / startingPointAdjustment,
          path[0].y - this.widthService.getWidth() / startingPointAdjustment,
          this.widthService.getWidth(),
          this.widthService.getWidth(),
    );
        ctx.beginPath();
        for (const point of path) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
    }

    private EraserVisual(event: MouseEvent): void{
      this.drawingService.previewCtx.strokeStyle = '#000000';
      this.drawingService.previewCtx.fillStyle ='#FFFFFF';
      this.drawingService.previewCtx.lineWidth = 1;
      this.drawingService.clearCanvas(this.drawingService.previewCtx);
      this.drawingService.previewCtx.strokeRect(event.offsetX - this.widthService.getWidth() / 2,
        event.offsetY - this.widthService.getWidth() / 2,
        this.widthService.getWidth() + 1,
        this.widthService.getWidth() + 1,
      );
      this.drawingService.previewCtx.fillRect(event.offsetX - this.widthService.getWidth() / 2,
        event.offsetY - this.widthService.getWidth() / 2,
        this.widthService.getWidth() + 1,
        this.widthService.getWidth() + 1,
      );
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
