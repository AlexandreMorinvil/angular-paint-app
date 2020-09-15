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
  zigzagTexture = 1,
  squareTexture = 2,
  dashTexture = 3,
  gradientTexture = 4
}
@Injectable({
  providedIn: 'root'
})

export class BrushService extends Tool {
  private pathData: Vec2[];
  private texture: Texture;
  private color: string;
  private lineWidth: number;

  constructor(drawingService: DrawingService) {
      super(drawingService);
      this.clearPath();
      this.texture = Texture.gradientTexture;
      this.color = "#000000";
      this.lineWidth = 10;
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
          this.ShadowTexture(ctx, path);
          break;
        case 1:
          this.ZigzagTexture(ctx,path);
          break;
        case 2:
          this.SquareTexture(ctx,path);
          break;
        case 3:
          this.DashTexture(ctx,path);
          break;
        case 4:
          this.GradientTexture(ctx,path);
          break;
      }
  }

  private clearPath(): void {
      this.pathData = [];
  }

  private ShadowTexture(ctx: CanvasRenderingContext2D, path: Vec2[]){
    // parameters of the line and the shadow
    ctx.strokeStyle = this.color;
    ctx.shadowColor= this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.shadowBlur= 5;
    //First pixel
    ctx.fillRect(path[0].x, path[0].y, this.lineWidth,this.lineWidth);
    //Drawing of the line
    ctx.beginPath();
    for (const point of path) {
        ctx.lineTo(point.x, point.y );
    }
    ctx.stroke();
  }

  private ZigzagTexture(ctx: CanvasRenderingContext2D, path: Vec2[]){
    // parameters of the line
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    // first pixel
    ctx.lineTo(path[0].x - 5, path[0].y - 5 );
    ctx.lineTo(path[0].x + 5, path[0].y + 5 );
    //Drawing of the line
    ctx.beginPath();
    for (const point of path) {
        ctx.lineTo(point.x - 5, point.y - 5 );
        ctx.lineTo(point.x + 5, point.y + 5 );
    }
    ctx.stroke();
  }

  private SquareTexture(ctx: CanvasRenderingContext2D, path: Vec2[]){
    // parameters of the line
    ctx.strokeStyle = this.color;
    //first pixel
    ctx.fillRect(path[0].x, path[0].y, this.lineWidth + 5, this.lineWidth + 5);
    //Drawing of the squares
    for (const point of path) {
      ctx.fillRect(point.x, point.y, this.lineWidth + 5, this.lineWidth + 5);
    }
  }

  private DashTexture(ctx: CanvasRenderingContext2D, path: Vec2[]){
    //parameters of the line
    ctx.strokeStyle = this.color;
    ctx.shadowColor= this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.setLineDash([4, 16]);
    //first pixel
    ctx.fillRect(path[0].x, path[0].y, this.lineWidth,this.lineWidth);
    //Drawing of the squares
    ctx.beginPath();
    for (const point of path) {
        ctx.lineTo(point.x, point.y );
    }
    ctx.stroke();
  }

  private GradientTexture(ctx: CanvasRenderingContext2D, path: Vec2[]){
    //parameters of the line
    ctx.globalAlpha = 1;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;


    //First pixel
    for (var i = 0; i < 3; i++ ){
      ctx.globalAlpha = 1 - 0.25*i;
        ctx.fillRect(path[0].x, path[0].y, this.lineWidth,this.lineWidth);
    }
    //First line of the gradient
    ctx.beginPath();
    for (const point of path)
      ctx.lineTo(point.x, point.y+this.lineWidth );
    ctx.stroke();
    //Second line of the gradient
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    for (const point of path) {
        ctx.lineTo(point.x, point.y );
    }
    ctx.stroke();
    //Third line of the gradient
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    for (const point of path)
      ctx.lineTo(point.x, point.y-this.lineWidth );
    ctx.stroke();
    //Fourth line of the gradient
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    for (const point of path)
      ctx.lineTo(point.x, point.y-2*this.lineWidth );
    ctx.stroke();
  }


}

