import { TestBed } from '@angular/core/testing';
import { TracingModifierState } from './tracing-state';
import { TracingService } from './tracing.service';

describe('TracingService', () => {
    let service: TracingService;
    let setStateSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TracingService);
        setStateSpy = spyOn<any>(service, 'setState').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have a default a primary and secondary color and opacity after creation', () => {
        const DEFAULT_HAS_CONTOUR: boolean = service.DEFAULT_HAS_CONTOUR;
        const DEFAULT_HAS_FILL: boolean = service.DEFAULT_HAS_FILL;

        const hasContour: boolean = service.getHasContour();
        const hasFill: boolean = service.getHasFill();

        expect(hasContour).toEqual(DEFAULT_HAS_CONTOUR);
        expect(hasFill).toEqual(DEFAULT_HAS_FILL);
    });

    it('setHasFill should set the hasFill attribute to the incoming argument and getHasFill should return set value', () => {
        const value = true;
        service.setHasFill(value);
        expect(service.getHasFill()).toEqual(value);
    });

    it('setHasContour should set the hasContour attribute to the incoming argument and getHasContour should return set value', () => {
        const value = true;
        service.setHasContour(value);
        expect(service.getHasContour()).toEqual(value);
    });

    it(' should call setState with the correct incoming argument and set hasContour and hasFill to true', () => {
        let state = {
            hasContour: true,
            hasFill: true,
        } as TracingModifierState;
        service.setState(state);
        expect(setStateSpy).toHaveBeenCalled();
        expect(service.getHasContour()).toBeTrue();
        expect(service.getHasFill()).toBeTrue();
    });
});
