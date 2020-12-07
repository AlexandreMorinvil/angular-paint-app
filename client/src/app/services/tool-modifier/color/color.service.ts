import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';
import { ColorModifierState } from './color-state';

const COLOR_WHITE = '#ffffff';
const COLOR_BLACK = '#000000';

const MAXIMUM_COLOR_NUMBER = 0xffffff;
const MINIMUM_COLOR_NUMBER = 0x000000;

@Injectable({
    providedIn: 'root',
})
export class ColorService extends ToolModifier {
    // Default values
    readonly DEFAULT_PRIMARY_COLOR: string = COLOR_BLACK;
    readonly DEFAULT_SECONDARY_COLOR: string = COLOR_WHITE;
    readonly DEFAULT_OPACITY: number = 1;
    readonly previousColorCount: number = 10;

    // Attributes
    private primaryColor: string = this.DEFAULT_PRIMARY_COLOR;
    private primaryColorOpacity: number = this.DEFAULT_OPACITY;
    private secondaryColor: string = this.DEFAULT_SECONDARY_COLOR;
    private secondaryColorOpacity: number = this.DEFAULT_OPACITY;
    private previousColors: string[] = [];

    constructor() {
        super();
        const colorSelectionCount = 2;
        this.previousColors.push(this.secondaryColor);
        this.previousColors.push(this.primaryColor);
        for (let i = 0; i < this.previousColorCount - colorSelectionCount; i++) this.previousColors.push(COLOR_WHITE);
    }

    intertwineColors(): void {
        const TEMPORARY_COLOR: string = this.primaryColor;
        const TEMPORARY_OPACITY: number = this.primaryColorOpacity;

        this.primaryColor = this.secondaryColor;
        this.primaryColorOpacity = this.secondaryColorOpacity;

        this.secondaryColor = TEMPORARY_COLOR;
        this.secondaryColorOpacity = TEMPORARY_OPACITY;
    }

    getPrimaryColor(): string {
        return this.primaryColor;
    }

    setPrimaryColor(color: string): void {
        if (this.validateColor(color)) {
            this.updatePreviousColors(color);
            this.primaryColor = color;
        }
    }

    getPrimaryColorOpacity(): number {
        return this.primaryColorOpacity;
    }

    setPrimaryColorOpacity(opacity: number): void {
        if (this.validateOpacity(opacity)) this.primaryColorOpacity = opacity;
    }

    getSecondaryColor(): string {
        return this.secondaryColor;
    }

    setSecondaryColor(color: string): void {
        if (this.validateColor(color)) {
            this.updatePreviousColors(color);
            this.secondaryColor = color;
        }
    }

    getSecondaryColorOpacity(): number {
        return this.secondaryColorOpacity;
    }

    setSecondaryColorOpacity(opacity: number): void {
        if (this.validateOpacity(opacity)) this.secondaryColorOpacity = opacity;
    }

    getPreviousColors(): string[] {
        return this.previousColors;
    }

    getState(): ColorModifierState {
        return new ColorModifierState(this.primaryColor, this.primaryColorOpacity, this.secondaryColor, this.secondaryColorOpacity);
    }

    setState(state: ColorModifierState): void {
        this.primaryColor = state.primaryColor;
        this.primaryColorOpacity = state.primaryColorOpacity;
        this.secondaryColor = state.secondaryColor;
        this.secondaryColorOpacity = state.secondaryColorOpacity;
    }

    private updatePreviousColors(newColor: string): void {
        // Verify if the color is already present in the list of previous colors
        let oldIndexOfNewColor = this.previousColors.length - 1;
        for (let i = 0; i < this.previousColors.length; i++) {
            if (this.previousColors[i] === newColor) {
                oldIndexOfNewColor = i;
                break;
            }
        }

        // Add the color and shift the list of previous colors
        for (let i = oldIndexOfNewColor; i > 0; i--) this.previousColors[i] = this.previousColors[i - 1];
        this.previousColors[0] = newColor;
    }

    private validateColor(input: string): boolean {
        if (!(input.charAt(0) === '#')) return false;
        const INPUT_NUMBER_PART = input.substring(1);
        const INPUT_HEXADECIMAL_NUMBER = parseInt(INPUT_NUMBER_PART, 16);
        if (isNaN(INPUT_HEXADECIMAL_NUMBER)) return false;
        if (!(INPUT_HEXADECIMAL_NUMBER >= MINIMUM_COLOR_NUMBER)) return false;
        if (!(INPUT_HEXADECIMAL_NUMBER <= MAXIMUM_COLOR_NUMBER)) return false;
        return true;
    }

    private validateOpacity(input: number): boolean {
        if (input < 0 || input > 1) return false;
        return true;
    }
}
