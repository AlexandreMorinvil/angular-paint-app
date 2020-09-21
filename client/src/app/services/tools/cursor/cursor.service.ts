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
  providedIn: 'root'
})
export class CursorService extends Tool {
  mouseDownCoord: Vec2;
  mouseDown: boolean = false;
  dotsize: number = 10;
  clickOnAnchor: boolean = false;
  anchorHit: number = 0;

  constructor(drawingService: DrawingService) {
    super(drawingService, "cursor", "y");
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDownCoord = this.getPositionFromMouse(event);
    this.drawnAnchor(this.drawingService.baseCtx, this.drawingService.canvas);
    this.checkHit(this.mouseDownCoord, this.drawingService.canvas);
    this.mouseDown = true;
  }

  onMouseUp(event: MouseEvent): void {
    this.clickOnAnchor = false;
    this.mouseDown = false;
    this.drawingService.baseCtx.canvas.width = this.drawingService.previewCtx.canvas.width;
    this.drawingService.baseCtx.canvas.height = this.drawingService.previewCtx.canvas.height;
    this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
  }

  onMouseMove(event: MouseEvent): void {
    if (this.clickOnAnchor && this.mouseDown) {
      let mouseDownCoord = this.getPositionFromMouse(event);
      switch (this.anchorHit) {
        case 1:
          this.moveWidth(mouseDownCoord.x);
          this.moveHeight(mouseDownCoord.y);
          break;
        case 2:
          this.moveWidth(mouseDownCoord.x);
          break;
        case 3:
          this.moveHeight(mouseDownCoord.y);
          break;
        default:
          break;
      }
    }
  }

  moveWidth(mouseDownCoordX : number){
    if (mouseDownCoordX >= 250) {
      this.drawingService.previewCtx.canvas.width = mouseDownCoordX;
    }
    else {
      this.drawingService.previewCtx.canvas.width = 250;
    }
  }
  
  moveHeight(mouseDownCoordY : number){
    if (mouseDownCoordY >= 250) {
      this.drawingService.previewCtx.canvas.height = mouseDownCoordY;
    }
    else {
      this.drawingService.previewCtx.canvas.height = 250;
    }
  }

  drawnAnchor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    ctx.beginPath();
    ctx.arc(canvas.width, canvas.height, this.dotsize, 0, (Math.PI * 2), false);
    ctx.closePath();
    ctx.arc(canvas.width / 2, canvas.height, this.dotsize, 0, (Math.PI * 2), false);
    ctx.closePath();
    ctx.arc(canvas.width, canvas.height / 2, this.dotsize, 0, (Math.PI * 2), false);
    ctx.closePath();
    ctx.fill();
  }

  checkHit(mouse: Vec2, canvas: HTMLCanvasElement): void {
    var x: number;
    var y: number;
    var dotSizeSquare: number = Math.pow(this.dotsize, 2);

    x = Math.pow((mouse.x - canvas.width), 2);
    y = Math.pow((mouse.y - canvas.height), 2);
    if (x + y <= dotSizeSquare) {
      this.clickOnAnchor = true;
      this.anchorHit = 1;
    }

    x = Math.pow((mouse.x - canvas.width), 2);
    y = Math.pow((mouse.y - canvas.height / 2), 2);
    if (x + y <= dotSizeSquare) {
      this.clickOnAnchor = true;
      this.anchorHit = 2;
    }

    x = Math.pow((mouse.x - canvas.width / 2), 2);
    y = Math.pow((mouse.y - canvas.height), 2);
    if (x + y <= dotSizeSquare) {
      this.clickOnAnchor = true;
      this.anchorHit = 3;
    }

    if (!this.clickOnAnchor) {
      this.clickOnAnchor = false;
      this.anchorHit = 0;
    }

  }

}
