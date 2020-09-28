import { TestBed } from '@angular/core/testing';

import { ColorService } from './color.service';

describe('ColorService', () => {
    let colorService: ColorService;

    // The disablement of the "any" tslint rule is justified in this situation as the prototype
    // of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
    // tslint:disable:no-any
    let validateColorSpy: jasmine.Spy<any>;
    let validateOpacitySpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ColorService],
        });
        colorService = TestBed.inject(ColorService);

        validateColorSpy = spyOn<any>(colorService, 'validateColor').and.callThrough();
        validateOpacitySpy = spyOn<any>(colorService, 'validateOpacity').and.callThrough();
    });

    it('should be created', () => {
        expect(colorService).toBeTruthy();
    });

    it('should have a default a primary and secondary color and opacity after creation', () => {
        const DEFAULT_PRIMARY_COLOR: string = colorService.DEFAULT_PRIMARY_COLOR;
        const DEFAULT_SECONDARY_COLOR: string = colorService.DEFAULT_SECONDARY_COLOR;
        const DEFAULT_OPACITY: number = colorService.DEFAULT_OPACITY;

        const primaryColor: string = colorService.getPrimaryColor();
        const secondaryColor: string = colorService.getSecondaryColor();
        const primaryOpacity: number = colorService.getPrimaryColorOpacity();
        const secondaryOpacity: number = colorService.getSecondaryColorOpacity();

        expect(primaryColor).toEqual(DEFAULT_PRIMARY_COLOR);
        expect(secondaryColor).toEqual(DEFAULT_SECONDARY_COLOR);
        expect(primaryOpacity).toEqual(DEFAULT_OPACITY);
        expect(secondaryOpacity).toEqual(DEFAULT_OPACITY);
    });


    it('should accept numbers between 0 and 0xffffff as the color number provided to the color setter', () => {
        const properColor = '#aabbcc';

        colorService.setPrimaryColor(properColor);
        colorService.setSecondaryColor(properColor);

        const primaryColor: string = colorService.getPrimaryColor();
        const secondaryColor: string = colorService.getSecondaryColor();

        expect(primaryColor).toEqual(properColor);
        expect(secondaryColor).toEqual(properColor);
        expect(validateColorSpy.calls.count()).toEqual(2);
    });

    it('should accept the number 0 as the color number provided to the color setter', () => {
        const properColor = '#0';

        colorService.setPrimaryColor(properColor);
        colorService.setSecondaryColor(properColor);

        const primaryColor: string = colorService.getPrimaryColor();
        const secondaryColor: string = colorService.getSecondaryColor();

        expect(primaryColor).toEqual(properColor);
        expect(secondaryColor).toEqual(properColor);
        expect(validateColorSpy.calls.count()).toEqual(2);
    });

    it('should accept the number 0xffffff as the color number provided to the color setter', () => {
        const properColor = '#ffffff';

        colorService.setPrimaryColor(properColor);
        colorService.setSecondaryColor(properColor);

        const primaryColor: string = colorService.getPrimaryColor();
        const secondaryColor: string = colorService.getSecondaryColor();

        expect(primaryColor).toEqual(properColor);
        expect(secondaryColor).toEqual(properColor);
        expect(validateColorSpy.calls.count()).toEqual(2);
    });

    it('should not accept strings that do not contain an hexadecimal number afther the "#" character with the color setter', () => {
        const eroneousColor = '#mabbcc';

        colorService.setPrimaryColor(eroneousColor);
        colorService.setSecondaryColor(eroneousColor);

        const primaryColor: string = colorService.getPrimaryColor();
        const secondaryColor: string = colorService.getSecondaryColor();

        expect(primaryColor).toEqual(colorService.DEFAULT_PRIMARY_COLOR);
        expect(secondaryColor).toEqual(colorService.DEFAULT_SECONDARY_COLOR);
        expect(validateColorSpy.calls.count()).toEqual(2);
    });

    it('should not accept numbers below 0 as the color number provided to the color setter', () => {
        const eroneousColor = '#-1';

        colorService.setPrimaryColor(eroneousColor);
        colorService.setSecondaryColor(eroneousColor);

        const primaryColor: string = colorService.getPrimaryColor();
        const secondaryColor: string = colorService.getSecondaryColor();

        expect(primaryColor).toEqual(colorService.DEFAULT_PRIMARY_COLOR);
        expect(secondaryColor).toEqual(colorService.DEFAULT_SECONDARY_COLOR);
        expect(validateColorSpy.calls.count()).toEqual(2);
    });

    it('should not accept numbers above 0xffffff as the color number provided to the color setter', () => {
        const eroneousColor = '#1000000';

        colorService.setPrimaryColor(eroneousColor);
        colorService.setSecondaryColor(eroneousColor);

        const primaryColor: string = colorService.getPrimaryColor();
        const secondaryColor: string = colorService.getSecondaryColor();

        expect(primaryColor).toEqual(colorService.DEFAULT_PRIMARY_COLOR);
        expect(secondaryColor).toEqual(colorService.DEFAULT_SECONDARY_COLOR);
        expect(validateColorSpy.calls.count()).toEqual(2);
    });

    it('should intertwin the primary and the secondary color when using the method intertwineColors', () => {
        const initialPrimaryColor = '#aabbcc';
        const initialSecondaryColor = '#112233';

        colorService.setPrimaryColor(initialPrimaryColor);
        colorService.setSecondaryColor(initialSecondaryColor);

        colorService.intertwineColors();

        const primaryColor: string = colorService.getPrimaryColor();
        const secondaryColor: string = colorService.getSecondaryColor();

        expect(primaryColor).toEqual(initialSecondaryColor);
        expect(secondaryColor).toEqual(initialPrimaryColor);
    });

    it('should accept numbers between 0 and 1 in the opacity number provided to the opacity setter', () => {
        const properOpacity = 0.75;

        colorService.setPrimaryColorOpacity(properOpacity);
        colorService.setSecondaryColorOpacity(properOpacity);

        const primaryColorOpacity: number = colorService.getPrimaryColorOpacity();
        const secondaryColorOpacity: number = colorService.getSecondaryColorOpacity();

        expect(primaryColorOpacity).toEqual(properOpacity);
        expect(secondaryColorOpacity).toEqual(properOpacity);
        expect(validateOpacitySpy.calls.count()).toEqual(2);
    });

    it('should accept 0 in the opacity number provided to the opacity setter', () => {
        const properOpacity = 0;

        colorService.setPrimaryColorOpacity(properOpacity);
        colorService.setSecondaryColorOpacity(properOpacity);

        const primaryColorOpacity: number = colorService.getPrimaryColorOpacity();
        const secondaryColorOpacity: number = colorService.getSecondaryColorOpacity();

        expect(primaryColorOpacity).toEqual(properOpacity);
        expect(secondaryColorOpacity).toEqual(properOpacity);
        expect(validateOpacitySpy.calls.count()).toEqual(2);
    });

    it('should accept 1 in the opacity number provided to the opacity setter', () => {
        const properOpacity = 1;

        colorService.setPrimaryColorOpacity(properOpacity);
        colorService.setSecondaryColorOpacity(properOpacity);

        const primaryColorOpacity: number = colorService.getPrimaryColorOpacity();
        const secondaryColorOpacity: number = colorService.getSecondaryColorOpacity();

        expect(primaryColorOpacity).toEqual(properOpacity);
        expect(secondaryColorOpacity).toEqual(properOpacity);
        expect(validateOpacitySpy.calls.count()).toEqual(2);
    });

    it('should not accept numbers below 0 in the opacity number provided to the opacity setter', () => {
        const eroneousOpacity = -0.75;

        colorService.setPrimaryColorOpacity(eroneousOpacity);
        colorService.setSecondaryColorOpacity(eroneousOpacity);

        const primaryColorOpacity: number = colorService.getPrimaryColorOpacity();
        const secondaryColorOpacity: number = colorService.getSecondaryColorOpacity();

        expect(primaryColorOpacity).toEqual(colorService.DEFAULT_OPACITY);
        expect(secondaryColorOpacity).toEqual(colorService.DEFAULT_OPACITY);
        expect(validateOpacitySpy.calls.count()).toEqual(2);
    });

    it('should not accept numbers above 1 in the opacity number provided to the opacity setter', () => {
        const eroneousOpacity = 1.75;

        colorService.setPrimaryColorOpacity(eroneousOpacity);
        colorService.setSecondaryColorOpacity(eroneousOpacity);

        const primaryColorOpacity: number = colorService.getPrimaryColorOpacity();
        const secondaryColorOpacity: number = colorService.getSecondaryColorOpacity();

        expect(primaryColorOpacity).toEqual(colorService.DEFAULT_OPACITY);
        expect(secondaryColorOpacity).toEqual(colorService.DEFAULT_OPACITY);
        expect(validateOpacitySpy.calls.count()).toEqual(2);
    });

    it('should accept strings of the format "#RRGGBB" when using the setter for the colors', () => {
        const eroneousColor = 'aabbcc';

        colorService.setPrimaryColor(eroneousColor);
        colorService.setSecondaryColor(eroneousColor);

        const primaryColor = colorService.getPrimaryColor();
        const secondaryColor = colorService.getSecondaryColor();

        expect(primaryColor).toEqual(colorService.DEFAULT_PRIMARY_COLOR);
        expect(secondaryColor).toEqual(colorService.DEFAULT_SECONDARY_COLOR);
        expect(validateColorSpy.calls.count()).toEqual(2);
    });

    it('should have the default primary and secondary colors in the previous color list upon creation of the service', () => {
        const previousColorList = colorService.getPreviousColors();

        expect(previousColorList[1]).toEqual(colorService.DEFAULT_PRIMARY_COLOR);
        expect(previousColorList[0]).toEqual(colorService.DEFAULT_SECONDARY_COLOR);
    });

    it('setting a new opacity for the primary or secondary color should not modify the previous colors list', () => {
        const newOpacity = 0.75;

        colorService.setPrimaryColorOpacity(newOpacity);
        colorService.setSecondaryColorOpacity(newOpacity);

        const previousColorList = colorService.getPreviousColors();

        expect(previousColorList[1]).toEqual(colorService.DEFAULT_PRIMARY_COLOR);
        expect(previousColorList[0]).toEqual(colorService.DEFAULT_SECONDARY_COLOR);
    });

    it('setting a new color as the primary color should set it as the first color of the previous colors list', () => {
        const newColor = '#aabbcc';

        colorService.setPrimaryColor(newColor);
        const previousColorList = colorService.getPreviousColors();

        expect(previousColorList[0]).toEqual(newColor);
    });

    it('setting a new color twice as the primary color should only make that color appear one in the previous color list', () => {
        const repetitiveColor = '#111111';
        const newColors = [repetitiveColor, '#222222', repetitiveColor];

        for (const color of newColors) colorService.setPrimaryColor(color);
        const previousColorList = colorService.getPreviousColors();
        const repetitiveColorOccurences = previousColorList.reduce((a, v) => (v === repetitiveColor ? a + 1 : a), 0);

        expect(repetitiveColorOccurences).toEqual(1);
    });

    it('setting a new color twice as the secondary color should only make that color appear one in the previous color list', () => {
        const repetitiveColor = '#111111';
        const newColors = [repetitiveColor, '#222222', repetitiveColor];

        for (const color of newColors) colorService.setSecondaryColor(color);
        const previousColorList = colorService.getPreviousColors();
        const repetitiveColorOccurences = previousColorList.reduce((a, v) => (v === repetitiveColor ? a + 1 : a), 0);

        expect(repetitiveColorOccurences).toEqual(1);
    });
});
