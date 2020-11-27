import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';

export enum TextAlignment {
    left = 'gauche',
    center = 'centre',
    right = 'droit',
}

export enum TextFont {
    arial = 'Arial',
    verdana = 'Verdana',
    timesNewRoman = 'Times New Roman',
    courierNew = 'Courier New',
    serif = 'serif',
}

@Injectable({
    providedIn: 'root',
})
export class StyleService extends ToolModifier {
    readonly DEFAULT_ALIGNEMENT: string = TextAlignment.left;
    private listAlignments: string[];
    private alignment: string = TextAlignment.left;
    readonly DEFAULT_FONT: string = TextFont.arial;
    private listFonts: string[];
    private font: string = TextFont.arial;
    readonly DEFAULT_HAS_BOLD: boolean = false;
    readonly DEFAULT_HAS_ITALIC: boolean = false;
    private hasBold: boolean = this.DEFAULT_HAS_BOLD;
    private hasItalic: boolean = this.DEFAULT_HAS_ITALIC;
    readonly DEFAULT_FONT_SIZE: number = 10;
    private fontSize: number = this.DEFAULT_FONT_SIZE;

    constructor() {
        super();
        this.listAlignments = Object.values(TextAlignment);
        this.listFonts = Object.values(TextFont);
    }

    getListAlignments(): string[] {
        return this.listAlignments;
    }

    getAlignment(): string {
        return this.alignment;
    }

    setAlignment(input: string): void {
        if (this.listAlignments.includes(input)) this.alignment = input;
    }

    getListFonts(): string[] {
        return this.listFonts;
    }

    getFont(): string {
        return this.font;
    }

    setFont(input: string): void {
        if (this.listFonts.includes(input)) this.font = input;
    }
    setHasBold(input: boolean): void {
        this.hasBold = input;
    }

    getHasBold(): boolean {
        return this.hasBold;
    }

    getHasItalic(): boolean {
        return this.hasItalic;
    }

    setHasItalic(input: boolean): void {
        this.hasItalic = input;
    }
    getFontSize() {
        return this.fontSize;
    }
    setFontSize(input: number) {
        this.fontSize = input;
    }
}
