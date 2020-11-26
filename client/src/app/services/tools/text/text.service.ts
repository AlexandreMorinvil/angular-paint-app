import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
  providedIn: 'root',
})
export class TextService extends Tool {
  private text: string[] = [''];
  private numberOfLines = 1;
  private textPosition: Vec2;
  private editingOn: boolean = false;
  private cursorPosition: Vec2;
  constructor(public drawingService: DrawingService) {
    super(drawingService, new Description('texte', 't', 'text_icon.png'));
  }
  onMouseDown(event: MouseEvent) {
    if (!this.editingOn) {
      this.editingOn = true
      this.drawingService.shortcutEnable = false;
      this.textPosition = this.getPositionFromMouse(event)
      this.cursorPosition = this.getPositionFromMouse(event)
      this.showCursor();
    } else {
      this.editingOn = false;
      this.drawingService.shortcutEnable = true;

      // confirm text
      this.drawingService.clearCanvas(this.drawingService.previewCtx);
      this.text = [''];
      this.numberOfLines = 0;
    }
  }
  onKeyDown(event: KeyboardEvent) {
    const spaceBetweenLines = 10;
    if (this.editingOn) {
      if (event.key === 'Enter') {
        this.numberOfLines++
        this.text[this.numberOfLines - 1] = '';
      } else {
        this.text[this.numberOfLines - 1] = this.text[this.numberOfLines - 1].concat(event.key);
        const adjustment: number = this.findTextPositionAdjustment();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        for (let i = 0; i < this.numberOfLines; i++)
          this.drawingService.previewCtx.fillText(this.text[i], this.textPosition.x - adjustment, this.textPosition.y + spaceBetweenLines * i);
      }
    }
  }
  findTextPositionAdjustment(): number {
    let longestLineLength = 0;
    for (let i = 0; i < this.numberOfLines; i++) {
      if (this.drawingService.baseCtx.measureText(this.text[i]).width > longestLineLength)
        longestLineLength = this.drawingService.baseCtx.measureText(this.text[i]).width;
    }
    return longestLineLength / 2
  }

  showCursor() {
    this.drawingService.previewCtx.strokeStyle = '#000000';
    this.drawingService.previewCtx.beginPath();
    this.drawingService.previewCtx.lineTo(this.cursorPosition.x, this.cursorPosition.y - 5);
    this.drawingService.previewCtx.lineTo(this.cursorPosition.x, this.cursorPosition.y + 5);
    this.drawingService.previewCtx.stroke();
  }
}
