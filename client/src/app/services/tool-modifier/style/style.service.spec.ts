import { TestBed } from '@angular/core/testing';
import { StyleModifierState } from './style-state';
import { StyleService, TextAlignment } from './style.service';
// The disablement of the "any" tslint rule is justified in this situation as the prototype
// of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
// tslint:disable:no-any
// tslint:disable:no-magic-numbers

describe('StyleService', () => {
    let service: StyleService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StyleService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set alignment correctly', () => {
        service.setAlignment('centre');
        expect(service.getAlignment()).toBe(TextAlignment.center);
        expect(service.getListAlignments()).toEqual(['gauche', 'centre', 'droit']);
    });

    it('should set font correctly', () => {
        service.setFont('Arial');
        expect(service.getFont()).toBe('Arial');
        expect(service.getListFonts()).toEqual(['serif', 'Arial', 'Verdana', 'Times New Roman', 'Courier New']);
    });

    it('should set bold correctly', () => {
        service.setHasBold(true);
        expect(service.getHasBold()).toBe(true);
    });

    it('should set italic correctly', () => {
        service.setHasItalic(true);
        expect(service.getHasItalic()).toBe(true);
    });

    it('should set font size correctly', () => {
        service.setFontSize(15);
        expect(service.getFontSize()).toBe(15);
    });

    it('should set state correctly', () => {
        service.setState({ alignment: 'centre', font: 'Arial', hasBold: true, hasItalic: true, fontSize: 15 } as StyleModifierState);
        expect(service.getState().alignment).toBe('centre');
        expect(service.getState().font).toBe('Arial');
        expect(service.getState().fontSize).toBe(15);
        expect(service.getState().hasBold).toBe(true);
        expect(service.getState().hasItalic).toBe(true);
    });
});
