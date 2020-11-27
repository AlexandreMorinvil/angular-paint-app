import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { StyleService } from '@app/services/tool-modifier/style/style.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    private text: string[] = [''];
    private numberOfLines: number = 1;
    private textPosition: Vec2 = { x: 0, y: 0 };
    private editingOn: boolean = false;
    private cursorPosition: Vec2 = { x: 0, y: 0 };
    private spaceBetweenLines: number = 10;

    constructor(public drawingService: DrawingService, private colorService: ColorService, private styleService: StyleService) {
        super(drawingService, new Description('texte', 't', 'text_icon.png'));
        this.modifiers.push(this.colorService);
        this.modifiers.push(this.styleService);
    }

    confirm(): void {
        this.drawingService.baseCtx.fillStyle = this.colorService.getPrimaryColor();
        this.drawingService.baseCtx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        this.editingOn = false;
        this.drawingService.shortcutEnable = true;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const adjustment = this.findTextPositionAdjustment();
        this.drawText(this.drawingService.baseCtx, adjustment);
        this.text = [''];
        this.numberOfLines = 1;
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.editingOn) {
            this.drawingService.previewCtx.fillStyle = this.colorService.getPrimaryColor();
            this.drawingService.previewCtx.globalAlpha = this.colorService.getPrimaryColorOpacity();
            this.editingOn = true;
            this.drawingService.shortcutEnable = false;
            this.textPosition = this.getPositionFromMouse(event);
            this.cursorPosition = { x: 0, y: 0 };
            this.showCursor();
        } else {
            this.confirm();
        }
    }
    onKeyDown(event: KeyboardEvent): void {
        if (this.editingOn) {
            if (event.key === 'Escape') {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.editingOn = false;
                this.text = [''];
                return;
            } else if (event.key === 'Enter') {
                this.onEnterDown();
            } else if (event.key === 'Backspace') {
                this.onBackspaceDown();
            } else if (event.key === 'Delete') {
                this.onDeleteDown();
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                this.onArrowDown(event);
            } else if (this.isLetter(event.key)) {
                let beforeCursor = this.text[this.cursorPosition.y].substring(0, this.cursorPosition.x);
                const afterCursor = this.text[this.cursorPosition.y].substring(this.cursorPosition.x);
                beforeCursor = beforeCursor.concat(event.key);
                this.text[this.cursorPosition.y] = beforeCursor.concat(afterCursor);
                this.cursorPosition.x += 1;
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            const adjustment = this.findTextPositionAdjustment();
            this.drawText(this.drawingService.previewCtx, adjustment);
            this.showCursor(adjustment);
        }
    }
    onAttributeChange(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.fillStyle = this.colorService.getPrimaryColor();
        this.drawingService.previewCtx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        const adjustment = this.findTextPositionAdjustment();
        this.drawText(this.drawingService.previewCtx, adjustment);
        this.showCursor(adjustment);
    }
    private drawText(ctx: CanvasRenderingContext2D, adjustment: number) {
        for (let i = 0; i < this.numberOfLines; i++)
            ctx.fillText(this.text[i], this.textPosition.x - adjustment, this.textPosition.y + this.spaceBetweenLines * i);
    }

    private isLetter(letter: string) {
        return letter.length === 1;
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
        const textLength: number = this.drawingService.baseCtx.measureText(this.text[this.cursorPosition.y].substring(0, this.cursorPosition.x))
            .width;
        this.drawingService.previewCtx.beginPath();
        this.drawingService.previewCtx.lineTo(
            this.textPosition.x + textLength - adjustement,
            this.textPosition.y + this.cursorPosition.y * this.spaceBetweenLines - cursorTopAdjustment,
        );
        this.drawingService.previewCtx.lineTo(
            this.textPosition.x + textLength - adjustement,
            this.textPosition.y + this.cursorPosition.y * this.spaceBetweenLines + cursorBottomAdjustment,
        );
        this.drawingService.previewCtx.stroke();
    }

    private onEnterDown(): void {
        let beforeCursor = this.text[this.cursorPosition.y].substring(0, this.cursorPosition.x);
        const afterCursor = this.text[this.cursorPosition.y].substring(this.cursorPosition.x);
        this.text[this.cursorPosition.y] = beforeCursor;
        this.numberOfLines++;
        for (let i = this.numberOfLines - 1; i > this.cursorPosition.y; i--) this.text[i] = this.text[i - 1];
        this.text[this.cursorPosition.y + 1] = afterCursor;
        this.cursorPosition.x = 0;
        this.cursorPosition.y += 1;
    }
    onBackspaceDown(): void {
        if (this.text[this.cursorPosition.y].substring(0, this.cursorPosition.x) === '' && this.cursorPosition.y === 0) {
            // dont do anything
        } else if (this.text[this.cursorPosition.y].substring(0, this.cursorPosition.x) === '') {
            const afterCursor = this.text[this.cursorPosition.y].substring(this.cursorPosition.x);
            this.numberOfLines--;
            for (let i = this.cursorPosition.y; i < this.numberOfLines; i++) {
                this.text[i] = this.text[i + 1];
            }
            this.cursorPosition.x = this.text[this.cursorPosition.y - 1].length;
            this.cursorPosition.y = this.cursorPosition.y - 1;
            this.text[this.cursorPosition.y] = this.text[this.cursorPosition.y].concat(afterCursor);
        } else {
            let beforeCursor = this.text[this.cursorPosition.y].substring(0, this.cursorPosition.x - 1);
            const afterCursor = this.text[this.cursorPosition.y].substring(this.cursorPosition.x);
            this.text[this.cursorPosition.y] = beforeCursor.concat(afterCursor);
            this.cursorPosition.x -= 1;
        }
    }

    private onDeleteDown() {
        if (
            this.text[this.cursorPosition.y].substring(this.cursorPosition.x, this.text[this.cursorPosition.y].length) === '' &&
            this.cursorPosition.y === this.numberOfLines - 1
        ) {
            // dont do anything
        } else if (this.text[this.cursorPosition.y].substring(this.cursorPosition.x, this.text[this.cursorPosition.y].length) === '') {
            const nextline = this.text[this.cursorPosition.y + 1];
            this.numberOfLines--;
            for (let i = this.cursorPosition.y + 1; i < this.numberOfLines; i++) {
                this.text[i] = this.text[i + 1];
            }
            this.text[this.cursorPosition.y] = this.text[this.cursorPosition.y].concat(nextline);
        } else {
            let beforeCursor = this.text[this.cursorPosition.y].substring(0, this.cursorPosition.x);
            const afterCursor = this.text[this.cursorPosition.y].substring(this.cursorPosition.x + 1);
            this.text[this.cursorPosition.y] = beforeCursor.concat(afterCursor);
        }
    }

    private onArrowDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowUp': {
                if (this.numberOfLines === 1) {
                    // dont do anything
                } else {
                    this.cursorPosition.y -= 1;
                    if (this.cursorPosition.x > this.text[this.cursorPosition.y].length)
                        this.cursorPosition.x = this.text[this.cursorPosition.y].length;
                }
                break;
            }
            case 'ArrowRight': {
                if (this.cursorPosition.x === this.text[this.cursorPosition.y].length) {
                    console.log('je me rends');
                    // dont do anything
                } else {
                    this.cursorPosition.x += 1;
                }
                break;
            }
            case 'ArrowDown': {
                if (this.cursorPosition.y === this.numberOfLines - 1) {
                    // dont do anything
                } else {
                    this.cursorPosition.y += 1;
                    if (this.cursorPosition.x > this.text[this.cursorPosition.y].length)
                        this.cursorPosition.x = this.text[this.cursorPosition.y].length;
                }
                break;
            }
            case 'ArrowLeft': {
                if (this.cursorPosition.x === 0) {
                    // dont do anything
                } else {
                    this.cursorPosition.x -= 1;
                }
                break;
            }
        }
    }
}
