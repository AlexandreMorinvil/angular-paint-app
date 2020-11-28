import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { StyleService, TextAlignment } from '@app/services/tool-modifier/style/style.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    private text: string[] = [''];
    private numberOfLines: number = 1;
    private textPosition: Vec2 = { x: 0, y: 0 };
    private editingOn: boolean = false;
    private cursorPosition: Vec2 = { x: 0, y: 0 };
    private spaceBetweenLines: number = this.styleService.getFontSize();

    constructor(public drawingService: DrawingService, private colorService: ColorService, private styleService: StyleService) {
        super(drawingService, new Description('texte', 't', 'text_icon.png'));
        this.modifiers.push(this.colorService);
        this.modifiers.push(this.styleService);
    }

    confirm(): void {
        this.editingOn = false;
        this.drawingService.shortcutEnable = true;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.setAttributes(this.drawingService.baseCtx);
        const adjustment = this.findTextPositionAdjustment(this.drawingService.baseCtx);
        this.drawText(this.drawingService.baseCtx, adjustment);
        this.text = [''];
        this.numberOfLines = 1;
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.editingOn) {
            this.setAttributes(this.drawingService.previewCtx);
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
            const adjustment = this.findTextPositionAdjustment(this.drawingService.previewCtx);
            console.log(adjustment);
            this.drawText(this.drawingService.previewCtx, adjustment);
            this.showCursor(adjustment);
        }
    }

    onAttributeChange(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.setAttributes(this.drawingService.previewCtx);
        const adjustment = this.findTextPositionAdjustment(this.drawingService.previewCtx);
        this.drawText(this.drawingService.previewCtx, adjustment);
        this.showCursor(adjustment);
    }

    private setAttributes(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.colorService.getPrimaryColor();
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.font = this.styleService.getFontSize().toString().concat('px ').concat(this.styleService.getFont());
        if (this.styleService.getHasBold()) {
            ctx.font = 'bold '.concat(ctx.font);
        }
        if (this.styleService.getHasItalic()) {
            ctx.font = 'italic '.concat(ctx.font);
        }
        switch (this.styleService.getAlignment()) {
            case TextAlignment.left: {
                ctx.textAlign = 'left';
                break;
            }
            case TextAlignment.center: {
                ctx.textAlign = 'center';
                break;
            }
            case TextAlignment.right: {
                ctx.textAlign = 'right';
                break;
            }
        }
        this.spaceBetweenLines = this.styleService.getFontSize();
    }

    private drawText(ctx: CanvasRenderingContext2D, adjustment: number) {
        for (let i = 0; i < this.numberOfLines; i++)
            ctx.fillText(this.text[i], this.textPosition.x - adjustment, this.textPosition.y + this.spaceBetweenLines * i);
    }

    private isLetter(letter: string) {
        return letter.length === 1;
    }

    private findTextPositionAdjustment(ctx: CanvasRenderingContext2D): number {
        let longestLineLength = 0;
        for (let i = 0; i < this.numberOfLines; i++) {
            if (ctx.measureText(this.text[i]).width > longestLineLength) longestLineLength = ctx.measureText(this.text[i]).width;
        }
        switch (ctx.textAlign) {
            case 'left': {
                return longestLineLength / 2;
            }
            case 'center': {
                return 0;
            }
            case 'right': {
                return -(longestLineLength / 2);
            }
        }
        // Should never reach there in theory
        return longestLineLength / 2;
    }

    private showCursor(adjustement: number = 0): void {
        const cursorTopAdjustment = this.styleService.getFontSize() / 2 + 5;
        const cursorBottomAdjustment = 5;
        this.drawingService.previewCtx.strokeStyle = '#000000';
        let textLength: number = this.drawingService.previewCtx.measureText(this.text[this.cursorPosition.y].substring(0, this.cursorPosition.x))
            .width;
        const fullTextLength = this.drawingService.previewCtx.measureText(this.text[this.cursorPosition.y]).width;
        const halfLength = fullTextLength / 2;
        switch (this.styleService.getAlignment()) {
            case TextAlignment.left: {
                textLength = textLength;
                break;
            }
            case TextAlignment.center: {
                if (this.cursorPosition.x > this.text[this.cursorPosition.y].length - 1) {
                    textLength = textLength - halfLength;
                } else {
                    textLength = -(halfLength - textLength);
                }
                break;
            }
            case TextAlignment.right: {
                textLength = textLength - fullTextLength;
                break;
            }
        }

        this.drawingService.previewCtx.beginPath();
        this.drawingService.previewCtx.lineTo(
            this.textPosition.x - adjustement + textLength,
            this.textPosition.y + this.cursorPosition.y * this.spaceBetweenLines - cursorTopAdjustment,
        );
        this.drawingService.previewCtx.lineTo(
            this.textPosition.x - adjustement + textLength,
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
        // switch (event.key) {
        if (event.key === 'ArrowUp') {
            if (this.cursorPosition.y === 0) {
                // dont do anything
            } else {
                this.cursorPosition.y -= 1;
                if (this.styleService.getAlignment() !== TextAlignment.right) {
                    if (this.cursorPosition.x > this.text[this.cursorPosition.y].length)
                        this.cursorPosition.x = this.text[this.cursorPosition.y].length;
                } else {
                    this.cursorPosition.x =
                        this.cursorPosition.x - this.text[this.cursorPosition.y + 1].length + this.text[this.cursorPosition.y].length;
                }
            }
        } else if (event.key === 'ArrowRight') {
            if (this.cursorPosition.x === this.text[this.cursorPosition.y].length && this.cursorPosition.y === this.numberOfLines - 1) {
                // dont do anything
            } else if (this.cursorPosition.x === this.text[this.cursorPosition.y].length) {
                this.cursorPosition.x = 0;
                this.cursorPosition.y += 1;
            } else {
                this.cursorPosition.x += 1;
            }
        } else if (event.key === 'ArrowDown') {
            if (this.cursorPosition.y === this.numberOfLines - 1) {
                // dont do anything
            } else {
                this.cursorPosition.y += 1;
                if (this.styleService.getAlignment() !== TextAlignment.right) {
                    if (this.cursorPosition.x > this.text[this.cursorPosition.y].length)
                        this.cursorPosition.x = this.text[this.cursorPosition.y].length;
                } else {
                    this.cursorPosition.x =
                        this.cursorPosition.x - this.text[this.cursorPosition.y - 1].length + this.text[this.cursorPosition.y].length;
                }
            }
        } else if (event.key === 'ArrowLeft') {
            if (this.cursorPosition.x === 0 && this.cursorPosition.y === 0) {
                // dont do anything
            } else if (this.cursorPosition.x === 0) {
                this.cursorPosition.y -= 1;
                this.cursorPosition.x = this.text[this.cursorPosition.y].length;
            } else {
                this.cursorPosition.x -= 1;
            }
        }
    }
}
