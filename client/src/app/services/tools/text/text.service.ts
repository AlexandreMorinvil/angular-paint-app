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
    private numberOfLines: number = 1;
    private textPosition: Vec2;
    private editingOn: boolean = false;
    private cursorPosition: Vec2;
    private spaceBetweenLines: number = 10;
    constructor(public drawingService: DrawingService) {
        super(drawingService, new Description('texte', 't', 'text_icon.png'));
    }
    onMouseDown(event: MouseEvent): void {
        if (!this.editingOn) {
            this.editingOn = true;
            this.drawingService.shortcutEnable = false;
            this.textPosition = this.getPositionFromMouse(event);
            this.cursorPosition = this.getPositionFromMouse(event);
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
    onKeyDown(event: KeyboardEvent): void {
        if (this.editingOn) {
            if (event.key === 'Enter') {
                this.onEnterDown();
            } else if (event.key === 'Backspace') {
                this.onBackspaceDown();
            } else {
                this.text[this.numberOfLines - 1] = this.text[this.numberOfLines - 1].concat(event.key);
                this.cursorPosition.x += this.drawingService.previewCtx.measureText(event.key).width;
            }
            const adjustment = this.findTextPositionAdjustment();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            for (let i = 0; i < this.numberOfLines; i++)
                this.drawingService.previewCtx.fillText(
                    this.text[i],
                    this.textPosition.x - adjustment,
                    this.textPosition.y + this.spaceBetweenLines * i,
                );
            this.showCursor(adjustment);
        }
    }
    private findTextPositionAdjustment(): number {
        let longestLineLength = 0;
        for (let i = 0; i < this.numberOfLines; i++) {
            if (this.drawingService.baseCtx.measureText(this.text[i]).width > longestLineLength)
                longestLineLength = this.drawingService.baseCtx.measureText(this.text[i]).width;
        }
        return longestLineLength / 2;
    }

    private showCursor(adjustement: number = 0): void {
        const cursorTopAdjustment = 10;
        const cursorBottomAdjustment = 5;
        this.drawingService.previewCtx.strokeStyle = '#000000';
        this.drawingService.previewCtx.beginPath();
        this.drawingService.previewCtx.lineTo(this.cursorPosition.x - adjustement, this.cursorPosition.y - cursorTopAdjustment);
        this.drawingService.previewCtx.lineTo(this.cursorPosition.x - adjustement, this.cursorPosition.y + cursorBottomAdjustment);
        this.drawingService.previewCtx.stroke();
    }

    private onEnterDown(): void {
        this.numberOfLines++;
        this.text[this.numberOfLines - 1] = '';
        this.cursorPosition.x = this.textPosition.x;
        this.cursorPosition.y += this.spaceBetweenLines;
    }
    private onBackspaceDown(): void {
        if (this.text[this.numberOfLines - 1] === '' && this.numberOfLines === 1) {
            // dont do anything
        } else if (this.text[this.numberOfLines - 1] === '') {
            this.numberOfLines--;
            this.cursorPosition.x = this.textPosition.x + this.drawingService.baseCtx.measureText(this.text[this.numberOfLines - 1]).width;
            this.cursorPosition.y -= this.spaceBetweenLines;
        } else {
            const lastCharacterWidth = this.drawingService.baseCtx.measureText(
                this.text[this.numberOfLines - 1].charAt(this.text[this.numberOfLines - 1].length - 1),
            ).width;
            const lastIndex = -1;
            this.text[this.numberOfLines - 1] = this.text[this.numberOfLines - 1].slice(0, lastIndex);
            this.cursorPosition.x -= lastCharacterWidth;
        }
    }
}
