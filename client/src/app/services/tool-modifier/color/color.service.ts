import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';

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

    // Attributes
    private primaryColor: string = this.DEFAULT_PRIMARY_COLOR;
    private primaryColorOpacity: number = this.DEFAULT_OPACITY;
    private secondaryColor: string = this.DEFAULT_SECONDARY_COLOR;
    private secondaryColorOpacity: number = this.DEFAULT_OPACITY;
    private previousColors: string[] = [];
    private previousColorCount: number = 10;

    constructor() {
        super();
        const colorSelectionCount = 2;
        this.previousColors.push(this.secondaryColor);
        this.previousColors.push(this.primaryColor);
        for (let i = 0; i < this.previousColorCount - colorSelectionCount; i++) this.previousColors.push(COLOR_WHITE);
    }

    intertwineColors(): void {
        const temporaryColor: string = this.primaryColor;
        const temporaryOpacity: number = this.primaryColorOpacity;

        this.primaryColor = this.secondaryColor;
        this.primaryColorOpacity = this.secondaryColorOpacity;

        this.secondaryColor = temporaryColor;
        this.secondaryColorOpacity = temporaryOpacity;
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
        // Validate that the input starts with "#"
        if (!(input.charAt(0) === '#')) return false;

        // Validate that the rest of the string is a number
        const inputNumberPart = input.substring(1);
        const inputHexadecimalNumber = parseInt(inputNumberPart, 16);
        if (isNaN(inputHexadecimalNumber)) return false;

        // Validate that the string is in the range 0x000000 and 0xffffff

        if (!(inputHexadecimalNumber >= MINIMUM_COLOR_NUMBER)) return false;
        if (!(inputHexadecimalNumber <= MAXIMUM_COLOR_NUMBER)) return false;

        // Confirm the validity
        return true;
    }

    private validateOpacity(input: number): boolean {
        // Validate that the number is in the range 0 and 1
        if (!(input >= 0)) return false;
        if (!(input <= 1)) return false;

        // Confirm the validity
        return true;
    }
}
