import { TestBed } from '@angular/core/testing';
import { SidesModifierState } from './sides-state';
import { SidesService } from './sides.service';
// The disablement of the "any" tslint rule is justified in this situation as the prototype
// of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
// tslint:disable:no-any
describe('SidesService', () => {
    let service: SidesService;

    let setSideSpy: jasmine.Spy<any>;
    let getSideSpy: jasmine.Spy<any>;
    let setStateSpy: jasmine.Spy<any>;
    let getStateSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SidesService);
        setSideSpy = spyOn<any>(service, 'setSide').and.callThrough();
        setStateSpy = spyOn<any>(service, 'setState').and.callThrough();
        getSideSpy = spyOn<any>(service, 'getSide').and.callThrough();
        getStateSpy = spyOn<any>(service, 'getState').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' should set side with the incoming argument and getSide should equal to the right number', () => {
        const sides = 5;
        service.setSide(sides);
        expect(setSideSpy).toHaveBeenCalled();

        expect(service.getSide()).toBe(sides);
        expect(getSideSpy).toHaveBeenCalled();
    });

    it(' setSide should set side to the 12 if input is above 12', () => {
        const sides = 101;
        const maxSides = service.MAX_POLYGON_SIDE;
        service.setSide(sides);
        expect(setSideSpy).toHaveBeenCalled();

        expect(service.getSide()).toBe(maxSides);
        expect(getSideSpy).toHaveBeenCalled();
    });

    it(' setWidth should set width to 0 if input is below 0', () => {
        const sides = -10;
        const minSides = service.MIN_POLYGON_SIDE;
        service.setSide(sides);
        expect(setSideSpy).toHaveBeenCalled();

        expect(service.getSide()).toBe(minSides);
        expect(getSideSpy).toHaveBeenCalled();
    });

    it(' should call setState to the correct incoming argument ', () => {
        const state = {
            numberSides: 2,
        } as SidesModifierState;
        service.setState(state);
        expect(setStateSpy).toHaveBeenCalled();
        expect(service.getSide()).toBe(state.numberSides);
        expect(getSideSpy).toHaveBeenCalled();
    });

    it(' should call getState and return SidesModifierState with correct number of sides ', () => {
        const state = {
            numberSides: 2,
        } as SidesModifierState;
        service.setState(state);
        service.getState();
        expect(setStateSpy).toHaveBeenCalled();
        expect(service.getSide()).toBe(state.numberSides);
        expect(getSideSpy).toHaveBeenCalled();

        expect(getStateSpy).toHaveBeenCalled();
    });

    it('should have a default a  after creation', () => {
        const DEFAULT_POLYGON_SIDE: number = service.DEFAULT_POLYGON_SIDE;
        const side: number = service.getSide();
        expect(side).toEqual(DEFAULT_POLYGON_SIDE);
    });

    it('setSide should set the number of side to the incoming argument and getSide should return the set number', () => {
        const side = 5;
        service.setSide(side);
        expect(service.getSide()).toEqual(side);
    });

    it(' setDiameter should set the number of side to 12 if input is above 12', () => {
        const side = 13;
        const maxSide = service.MAX_POLYGON_SIDE;
        service.setSide(side);
        expect(service.getSide()).toEqual(maxSide);
    });

    it(' setDiameter should set the number of side to 0 if input is below 1', () => {
        const side = 0;
        const minSide = service.MIN_POLYGON_SIDE;
        service.setSide(side);
        expect(service.getSide()).toEqual(minSide);
    });
});
