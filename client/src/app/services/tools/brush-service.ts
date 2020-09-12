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
enum Texture {
  shadowTexture = 0,
  texture2 = 1,
  texture3 = 2,
  texture4 = 3,
  texture5= 4
}
@Injectable({
  providedIn: 'root'
})

export class BrushService extends Tool {
  private pathData: Vec2[];
  private texture: Texture;

  constructor(drawingService: DrawingService) {
      super(drawingService);
      this.clearPath();
      //en attendant davoir plus de texture
      this.texture = Texture.shadowTexture;
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
          this.drawLine(this.drawingService.previewCtx, this.pathData);
      }
  }

  private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
      switch(this.texture){
        case 0:
          this.ShadowTexture(ctx, path)
      }
  }

  private clearPath(): void {
      this.pathData = [];
  }

  private ShadowTexture(ctx: CanvasRenderingContext2D, path: Vec2[]){
    ctx.beginPath();
    for (const point of path) {
        ctx.lineTo(point.x, point.y);
    }
    ctx.shadowColor= 'black';
    ctx.shadowBlur= 20;
    ctx.stroke();
  }
}
