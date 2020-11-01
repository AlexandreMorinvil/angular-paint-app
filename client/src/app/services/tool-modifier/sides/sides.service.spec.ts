import { TestBed } from '@angular/core/testing';
import { SidesModifierState } from './sides-state';
import { SidesService } from './sides.service';

describe('SidesService', () => {
    let service: SidesService;
    let setSideSpy: jasmine.Spy<any>;
    let getSideSpy: jasmine.Spy<any>;
    let setStateSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SidesService);
        setSideSpy = spyOn<any>(service, 'setSide').and.callThrough();
        setStateSpy = spyOn<any>(service, 'setState').and.callThrough();
        getSideSpy = spyOn<any>(service, 'getSide').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' should set side with the incoming argument and getSide should equal to the right number', () => {
        let sides = 5;
        service.setSide(sides);
        expect(setSideSpy).toHaveBeenCalled();

        expect(service.getSide()).toBe(sides);
        expect(getSideSpy).toHaveBeenCalled();
    });

    it(' setSide should set side to the 12 if input is above 12', () => {
        let sides = 101;
        let maxSides = service.MAX_POLYGON_SIDE;
        service.setSide(sides);
        expect(setSideSpy).toHaveBeenCalled();

        expect(service.getSide()).toBe(maxSides);
        expect(getSideSpy).toHaveBeenCalled();
    });

    it(' setWidth should set width to 0 if input is below 0', () => {
        let sides = -10;
        let minSides = service.MIN_POLYGON_SIDE;
        service.setSide(sides);
        expect(setSideSpy).toHaveBeenCalled();

        expect(service.getSide()).toBe(minSides);
        expect(getSideSpy).toHaveBeenCalled();
    });

    it(' should call setState to the correct incoming argument ', () => {
        let state = {
            numberSides: 2,
        } as SidesModifierState;
        service.setState(state);
        expect(setStateSpy).toHaveBeenCalled();
        expect(service.getSide()).toBe(state.numberSides);
        expect(getSideSpy).toHaveBeenCalled();
    });
});
