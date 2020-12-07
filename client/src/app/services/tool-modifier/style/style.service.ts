import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';
import { StyleModifierState } from './style-state';

export enum TextAlignment {
    left = 'gauche',
    center = 'centre',
    right = 'droit',
}

export enum TextFont {
    serif = 'serif',
    arial = 'Arial',
    verdana = 'Verdana',
    timesNewRoman = 'Times New Roman',
    courierNew = 'Courier New',
}

@Injectable({
    providedIn: 'root',
})
export class StyleService extends ToolModifier {
    private listAlignments: string[];
    private alignment: string = TextAlignment.left;
    private listFonts: string[];
    private font: string = TextFont.serif;
    private hasBold: boolean = false;
    private hasItalic: boolean = false;
    private fontSize: number = 10;

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
        this.alignment = input;
    }

    getListFonts(): string[] {
        return this.listFonts;
    }

    getFont(): string {
        return this.font;
    }

    setFont(input: string): void {
        this.font = input;
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

    getFontSize(): number {
        return this.fontSize;
    }
    setFontSize(input: number): void {
        this.fontSize = input;
    }
    getState(): StyleModifierState {
        return new StyleModifierState(this.alignment, this.font, this.hasBold, this.hasItalic, this.fontSize);
    }

    setState(state: StyleModifierState): void {
        this.alignment = state.alignment;
        this.font = state.font;
        this.hasBold = state.hasBold;
        this.hasItalic = state.hasItalic;
        this.fontSize = state.fontSize;
    }
}
