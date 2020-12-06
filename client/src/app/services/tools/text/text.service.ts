import { Injectable } from '@angular/core';
import { InteractionText } from '@app/classes/action/interaction-text';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { StyleService, TextAlignment } from '@app/services/tool-modifier/style/style.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    private text: string[] = [''];
    private textPosition: Vec2 = { x: 0, y: 0 };
    private cursorPosition: Vec2 = { x: 0, y: 0 };
    private editingOn: boolean = false;
    private numberOfLines: number = 1;
    private spaceBetweenLines: number = this.styleService.getFontSize();

    constructor(
        public drawingService: DrawingService,
        private colorService: ColorService,
        private styleService: StyleService,
        private drawingStateTrackingService: DrawingStateTrackerService,
    ) {
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
        this.drawingStateTrackingService.addAction(this, new InteractionText(this.text, this.textPosition, adjustment, this.numberOfLines));
        this.text = [''];
        this.numberOfLines = 1;
    }

    onMouseDown(event: MouseEvent): void {
        if (this.editingOn) {
            this.confirm();
        } else {
            this.setAttributes(this.drawingService.previewCtx);
            this.editingOn = true;
            this.drawingService.shortcutEnable = false;
            this.textPosition = this.getPositionFromMouse(event);
            this.cursorPosition = { x: 0, y: 0 };
            this.showCursor();
        }
    }
    onKeyDown(event: KeyboardEvent): void {
        if (!this.editingOn) {
            return;
        }
        const key: String = event.key;
        if (key) {
            if (key === 'Escape') {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.editingOn = false;
                this.text = [''];
                return;
            } else if (key === 'Enter') {
                this.onEnterDown();
            } else if (key === 'Backspace') {
                this.onBackspaceDown();
            } else if (key === 'Delete') {
                this.onDeleteDown();
            } else if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown') {
                this.onArrowDown(event);
            } else if (this.isLetter(key)) {
                let beforeCursor = this.text[this.cursorPosition.y].substring(0, this.cursorPosition.x);
                const afterCursor = this.text[this.cursorPosition.y].substring(this.cursorPosition.x);
                beforeCursor = beforeCursor.concat(event.key);
                this.text[this.cursorPosition.y] = beforeCursor.concat(afterCursor);
                this.cursorPosition.x += 1;
            }
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const adjustment = this.findTextPositionAdjustment(this.drawingService.previewCtx);
        this.drawText(this.drawingService.previewCtx, adjustment);
        this.showCursor(adjustment);
    }

    onAttributeChange(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.setAttributes(this.drawingService.previewCtx);
        const adjustment = this.findTextPositionAdjustment(this.drawingService.previewCtx);
        this.drawText(this.drawingService.previewCtx, adjustment);
        this.showCursor(adjustment);
    }

    private setAttributes(ctx: CanvasRenderingContext2D): void {
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

    private drawText(ctx: CanvasRenderingContext2D, adjustment: number): void {
        for (let i = 0; i < this.numberOfLines; i++)
            ctx.fillText(this.text[i], this.textPosition.x - adjustment, this.textPosition.y + this.spaceBetweenLines * i);
    }

    private isLetter(letter: String): boolean {
        return letter.length === 1;
    }

    private findTextPositionAdjustment(ctx: CanvasRenderingContext2D): number {
        let longestLineLength = 0;
        for (let i = 0; i < this.numberOfLines; i++) {
            if (ctx.measureText(this.text[i]).width > longestLineLength) longestLineLength = ctx.measureText(this.text[i]).width;
        }
        switch (ctx.textAlign) {
            case 'left': {
                longestLineLength = longestLineLength / 2;
            }
            case 'center': {
                longestLineLength = 0;
            }
            case 'right': {
                longestLineLength = -(longestLineLength / 2);
            }
        }
        return longestLineLength;
    }

    private showCursor(adjustement: number = 0): void {
        const EDGE_CURSOR = 5;
        const CURSOR_TOP_ADJUSTEMENT = this.styleService.getFontSize() / 2 + EDGE_CURSOR;
        const CURSOR_BOTTOM_ADJUSTEMENT = EDGE_CURSOR;
        this.drawingService.previewCtx.strokeStyle = '#000000';
        const SUB_LINE: string = this.text[this.cursorPosition.y].substring(0, this.cursorPosition.x);
        let textLength: number = this.drawingService.previewCtx.measureText(SUB_LINE).width;
        const TEXT_LINE = this.text[this.cursorPosition.y];
        const FULL_TEXT_LENGTH = this.drawingService.previewCtx.measureText(TEXT_LINE).width;
        const HALF_LENGTH = FULL_TEXT_LENGTH / 2;
        switch (this.styleService.getAlignment()) {
            case TextAlignment.left: {
                textLength = textLength;
                break;
            }
            case TextAlignment.center: {
                if (this.cursorPosition.x > this.text[this.cursorPosition.y].length - 1) {
                    textLength = textLength - HALF_LENGTH;
                } else {
                    textLength = -(HALF_LENGTH - textLength);
                }
                break;
            }
            case TextAlignment.right: {
                textLength = textLength - FULL_TEXT_LENGTH;
                break;
            }
        }

        const X_CURSOR_POSITION = this.textPosition.x - adjustement + textLength;
        const Y_CURSOR_POSITION = this.textPosition.y + this.cursorPosition.y * this.spaceBetweenLines;

        this.drawingService.previewCtx.beginPath();
        this.drawingService.previewCtx.lineTo(X_CURSOR_POSITION, Y_CURSOR_POSITION - CURSOR_TOP_ADJUSTEMENT);
        this.drawingService.previewCtx.lineTo(X_CURSOR_POSITION, Y_CURSOR_POSITION + CURSOR_BOTTOM_ADJUSTEMENT);
        this.drawingService.previewCtx.stroke();
    }

    private onEnterDown(): void {
        const BEFORE_CURSOR = this.text[this.cursorPosition.y].substring(0, this.cursorPosition.x);
        const AFTER_CURSOR = this.text[this.cursorPosition.y].substring(this.cursorPosition.x);
        this.text[this.cursorPosition.y] = BEFORE_CURSOR;
        this.numberOfLines++;
        for (let i = this.numberOfLines - 1; i > this.cursorPosition.y; i--) this.text[i] = this.text[i - 1];
        this.text[this.cursorPosition.y + 1] = AFTER_CURSOR;
        this.cursorPosition.x = 0;
        this.cursorPosition.y += 1;
    }

    onBackspaceDown(): void {
        const TEXT_BEFORE_CURSOR: string = this.text[this.cursorPosition.y].substring(0, this.cursorPosition.x);
        const EMPTY_TEXT = '';
        if (TEXT_BEFORE_CURSOR === EMPTY_TEXT && this.cursorPosition.y === 0) {
            return;
        } else if (TEXT_BEFORE_CURSOR === EMPTY_TEXT) {
            const AFTER_CURSOR = this.text[this.cursorPosition.y].substring(this.cursorPosition.x);
            this.numberOfLines--;
            for (let i = this.cursorPosition.y; i < this.numberOfLines; i++) {
                this.text[i] = this.text[i + 1];
            }
            this.cursorPosition.x = this.text[this.cursorPosition.y - 1].length;
            this.cursorPosition.y = this.cursorPosition.y - 1;
            this.text[this.cursorPosition.y] = this.text[this.cursorPosition.y].concat(AFTER_CURSOR);
        } else {
            const BEFORE_CURSOR = this.text[this.cursorPosition.y].substring(0, this.cursorPosition.x - 1);
            const AFTER_CURSOR = this.text[this.cursorPosition.y].substring(this.cursorPosition.x);
            this.text[this.cursorPosition.y] = BEFORE_CURSOR.concat(AFTER_CURSOR);
            this.cursorPosition.x -= 1;
        }
    }

    private onDeleteDown(): void {
        const TEXT_AFTER_CURSOR: string = this.text[this.cursorPosition.y].substring(this.cursorPosition.x, this.text[this.cursorPosition.y].length);
        const EMPTY_TEXT = '';
        if (TEXT_AFTER_CURSOR === EMPTY_TEXT && this.cursorPosition.y === this.numberOfLines - 1) {
            return;
        } else if (TEXT_AFTER_CURSOR === EMPTY_TEXT) {
            const NEXT_LINE = this.text[this.cursorPosition.y + 1];
            this.numberOfLines--;
            for (let i = this.cursorPosition.y + 1; i < this.numberOfLines; i++) {
                this.text[i] = this.text[i + 1];
            }
            this.text[this.cursorPosition.y] = this.text[this.cursorPosition.y].concat(NEXT_LINE);
        } else {
            const BEFORE_CURSOR = this.text[this.cursorPosition.y].substring(0, this.cursorPosition.x);
            const AFTER_CURSOR = this.text[this.cursorPosition.y].substring(this.cursorPosition.x + 1);
            this.text[this.cursorPosition.y] = BEFORE_CURSOR.concat(AFTER_CURSOR);
        }
    }

    onArrowDown(event: KeyboardEvent): void {
        const LAST_LINE_POSITION: number = this.numberOfLines - 1;
        switch (event.key) {
            case 'ArrowUp': {
                if (this.cursorPosition.y === 0) {
                    return;
                }
                this.cursorPosition.y -= 1;
                if (this.styleService.getAlignment() !== TextAlignment.right) {
                    if (this.cursorPosition.x > this.text[this.cursorPosition.y].length)
                        this.cursorPosition.x = this.text[this.cursorPosition.y].length;
                } else {
                    this.cursorPosition.x =
                        this.cursorPosition.x - this.text[this.cursorPosition.y + 1].length + this.text[this.cursorPosition.y].length;
                }
                break;
            }
            case 'ArrowRight': {
                if (this.cursorPosition.x === this.text[this.cursorPosition.y].length && this.cursorPosition.y === LAST_LINE_POSITION) {
                    return;
                } else if (this.cursorPosition.x === this.text[this.cursorPosition.y].length) {
                    this.cursorPosition.x = 0;
                    this.cursorPosition.y += 1;
                } else {
                    this.cursorPosition.x += 1;
                }
                break;
            }
            case 'ArrowDown': {
                if (this.cursorPosition.y === LAST_LINE_POSITION) {
                    return;
                }
                this.cursorPosition.y += 1;
                if (this.styleService.getAlignment() !== TextAlignment.right) {
                    if (this.cursorPosition.x > this.text[this.cursorPosition.y].length)
                        this.cursorPosition.x = this.text[this.cursorPosition.y].length;
                } else {
                    this.cursorPosition.x =
                        this.cursorPosition.x - this.text[this.cursorPosition.y - 1].length + this.text[this.cursorPosition.y].length;
                }
                break;
            }
            case 'ArrowLeft': {
                if (this.cursorPosition.x === 0 && this.cursorPosition.y === 0) {
                    return;
                } else if (this.cursorPosition.x === 0) {
                    this.cursorPosition.y -= 1;
                    this.cursorPosition.x = this.text[this.cursorPosition.y].length;
                } else {
                    this.cursorPosition.x -= 1;
                }
                break;
            }
        }
    }

    execute(interaction: InteractionText): void {
        this.text = interaction.text;
        this.textPosition = interaction.textPosition;
        this.numberOfLines = interaction.numberOfLines;
        this.setAttributes(this.drawingService.baseCtx);
        this.drawText(this.drawingService.baseCtx, interaction.adjustment);
        this.text = [''];
        this.numberOfLines = 1;
    }
}
