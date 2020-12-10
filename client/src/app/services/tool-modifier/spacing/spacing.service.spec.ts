import { TestBed } from '@angular/core/testing';
import { SpacingModifierState } from './spacing-state';
import { SpacingService } from './spacing.service';
// The disablement of the "any" tslint rule is justified in this situation as the prototype
// of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
// tslint:disable:no-any
describe('SpacingService', () => {
    let service: SpacingService;

    let setSpacingSpy: jasmine.Spy<any>;
    let getSpacingSpy: jasmine.Spy<any>;
    let setStateSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SpacingService);
        setSpacingSpy = spyOn<any>(service, 'setSpacing').and.callThrough();
        getSpacingSpy = spyOn<any>(service, 'getSpacing').and.callThrough();
        setStateSpy = spyOn<any>(service, 'setState').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' setSpacing should set spacing to the incoming argument and getSpacing should return the right number', () => {
        const spacing = 25;
        service.setSpacing(spacing);
        expect(setSpacingSpy).toHaveBeenCalled();
        expect(service.getSpacing()).toEqual(spacing);
        expect(getSpacingSpy).toHaveBeenCalled();
    });

    it(' setSpacing should set spacing to the 50 if input is above 50', () => {
        const spacing = 150;
        const maxSpacing = service.MAX_ATTRIBUTE_SPACING;
        service.setSpacing(spacing);
        expect(setSpacingSpy).toHaveBeenCalled();
        expect(service.getSpacing()).toEqual(maxSpacing);
        expect(getSpacingSpy).toHaveBeenCalled();
    });

    it(' setSpacing should set spacing to 1 if input is below 1', () => {
        const spacing = 0;
        const minSpacing = service.MIN_ATTRIBUTE_SPACING;
        service.setSpacing(spacing);
        expect(setSpacingSpy).toHaveBeenCalled();
        expect(service.getSpacing()).toEqual(minSpacing);
        expect(getSpacingSpy).toHaveBeenCalled();
    });

    it(' should increment by a STEP_SIZE the spacing', () => {
        const initialSpacing = service.MIN_ATTRIBUTE_SPACING;
        const expectedSpacing = service.MIN_ATTRIBUTE_SPACING + service.STEP_SIZE;
        service.setSpacing(initialSpacing);
        service.stepUp();
        expect(service.getSpacing()).toEqual(expectedSpacing);
    });

    it(' should decrement by a STEP_SIZE the spacing', () => {
        const initialSpacing = service.MAX_ATTRIBUTE_SPACING;
        const expectedSpacing = service.MAX_ATTRIBUTE_SPACING - service.STEP_SIZE;
        service.setSpacing(initialSpacing);
        service.stepDown();
        expect(service.getSpacing()).toEqual(expectedSpacing);
    });

    it(' should call setState to the incoming argument and getSpacing should return the right number', () => {
        const spacing = 100;
        const state = new SpacingModifierState(spacing);
        service.setState(state);
        expect(setStateSpy).toHaveBeenCalled();
        expect(service.getSpacing()).toEqual(state.spacing);
        expect(service.getState()).toEqual(state);
    });
});
