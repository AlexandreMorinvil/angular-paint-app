import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';

const COLOR_WHITE: string = '#ffffff';

@Injectable({
    providedIn: 'root',
})
export class ColorService extends ToolModifier {
    private primaryColor: string = '#000000';
    private primaryColorOpacity: number = 1;
    private secondaryColor: string = '#ffffff';
    private secondaryColorOpacity: number = 1;
    private previousColors: string[] = [];
    private previousColorCount: number = 10;

    constructor() {
        super();
        for (let i = 0; i < this.previousColorCount; i++) this.previousColors.push(COLOR_WHITE);
        this.previousColors.pop();
        this.previousColors.pop();
        this.previousColors.push(this.secondaryColor);
        this.previousColors.push(this.primaryColor);
    }

    intertwinColors(): void {
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
            if (color !== this.primaryColor && color !== this.secondaryColor) this.updatePreviousColors(color);
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
            if (color !== this.primaryColor && color !== this.secondaryColor) this.updatePreviousColors(color);
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

    private updatePreviousColors(newColor: string) {
        for (let i = this.previousColors.length - 1; i > 0; i--) if (i > 0) this.previousColors[i] = this.previousColors[i - 1];
        this.previousColors[0] = newColor;
    }

    private validateColor(input: String): boolean {
        // Validate that the input starts with "#"
        if (!(input.charAt(0) === '#')) return false;

        // Validate that the rest of the string is a number
        const inputNumberPart = input.substring(1);
        const inputHexadecimalNumber = parseInt(inputNumberPart, 16);
        if (isNaN(inputHexadecimalNumber)) return false;

        // Validate that the string is in the range 0x000000 and 0xffffff

        if (!(inputHexadecimalNumber >= 0x000000)) return false;
        if (!(inputHexadecimalNumber <= 0xffffff)) return false;

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
