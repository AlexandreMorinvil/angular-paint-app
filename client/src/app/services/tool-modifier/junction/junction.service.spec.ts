import { TestBed } from '@angular/core/testing';
import { JunctionModifierState } from './junction-state';
import { JunctionService } from './junction.service';
// The disablement of the "any" tslint rule is justified in this situation as the prototype
// of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
// tslint:disable:no-any
describe('WidthService', () => {
    let service: JunctionService;
    let setStateSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(JunctionService);
        setStateSpy = spyOn<any>(service, 'setState').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have a default a  after creation', () => {
        const DEFAULT_HAS_JUNCTION_POINT: boolean = service.DEFAULT_HAS_JONCTION_POINT;
        const DEFAULT_JUNCTION_DIAMETER: number = service.DEFAULT_JUNCTION_DIAMETER;

        const hasJunctionPoint: boolean = service.getHasJunctionPoint();
        const diameter: number = service.getDiameter();

        expect(hasJunctionPoint).toEqual(DEFAULT_HAS_JUNCTION_POINT);
        expect(diameter).toEqual(DEFAULT_JUNCTION_DIAMETER);
    });

    it('setDiameter should set the diameter to the incoming argument and getDiameter should return the set number', () => {
        const diameter = 25;
        service.setDiameter(diameter);
        expect(service.getDiameter()).toEqual(diameter);
    });

    it(' setDiameter should set the diameter to the 50 if input is above 50', () => {
        const diameter = 75;
        const maxDiameter = service.MAX_JUNCTION_DIAMETER;
        service.setDiameter(diameter);
        expect(service.getDiameter()).toEqual(maxDiameter);
    });

    it(' setDiameter should set the diameter to 1 if input is below 1', () => {
        const diameter = 0;
        const minDiameter = service.MIN_JUNCTION_DIAMETER;
        service.setDiameter(diameter);
        expect(service.getDiameter()).toEqual(minDiameter);
    });

    it('setHasJuctionPoint should set the hasJunction attribute to the incoming argument and getHasJunctionPoint should return set value', () => {
        const value = true;
        service.setHasJunctionPoint(value);
        expect(service.getHasJunctionPoint()).toEqual(value);
    });

    it(' should call setState with the correct incoming argument and set diameter and hasJunction to true', () => {
        const state = {
            diameter: 10,
            hasJunctionPoint: true,
        } as JunctionModifierState;
        service.setState(state);
        expect(setStateSpy).toHaveBeenCalled();
        expect(service.getDiameter()).toBe(state.diameter);
        expect(service.getHasJunctionPoint()).toBeTrue();
    });
});
