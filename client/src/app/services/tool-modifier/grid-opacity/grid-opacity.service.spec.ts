import { TestBed } from '@angular/core/testing';
import { GridOpacityModifierState } from './grid-opacity-state';
import { GridOpacityService } from './grid-opacity.service';
// The disablement of the "any" tslint rule is justified in this situation as the prototype
// of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
// tslint:disable:no-any
describe('GridOpacityService', () => {
    let service: GridOpacityService;

    let setGridOpacitySpy: jasmine.Spy<any>;
    let getGridOpacitySpy: jasmine.Spy<any>;
    let setStateSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridOpacityService);
        setGridOpacitySpy = spyOn<any>(service, 'setGridOpacity').and.callThrough();
        getGridOpacitySpy = spyOn<any>(service, 'getGridOpacity').and.callThrough();
        setStateSpy = spyOn<any>(service, 'setState').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' setGridOpacity should set gridOpacity to the incoming argument and getGridOpacity should return the right number', () => {
        const gridOpacity = 0.25;
        service.setGridOpacity(gridOpacity);
        expect(setGridOpacitySpy).toHaveBeenCalled();
        expect(service.getGridOpacity()).toEqual(gridOpacity);
        expect(getGridOpacitySpy).toHaveBeenCalled();
    });

    it(' setGridOpacity should set gridOpacity to 1.0 if input is above 1.0', () => {
        const gridOpacity = 7;
        const maxGridOpacity = service.MAX_ATTRIBUTE_GRID_OPACITY;
        service.setGridOpacity(gridOpacity);
        expect(setGridOpacitySpy).toHaveBeenCalled();
        expect(service.getGridOpacity()).toEqual(maxGridOpacity);
        expect(getGridOpacitySpy).toHaveBeenCalled();
    });

    it(' setGridOpacity should set gridOpacity to the minimal opacity value if input is below the minimal opacity value', () => {
        const gridOpacity = 0;
        const minGridOpacity = service.MIN_ATTRIBUTE_GRID_OPACITY;
        service.setGridOpacity(gridOpacity);
        expect(setGridOpacitySpy).toHaveBeenCalled();
        expect(service.getGridOpacity()).toEqual(minGridOpacity);
        expect(getGridOpacitySpy).toHaveBeenCalled();
    });

    it(' should call setState to the incoming argument and getGridOpacity should return the right number', () => {
        const state = new GridOpacityModifierState(1);
        service.setState(state);
        expect(setStateSpy).toHaveBeenCalled();
        expect(service.getGridOpacity()).toEqual(state.gridOpacity);
        expect(service.getState()).toEqual(state);
    });
});
