import { TestBed } from '@angular/core/testing';
import { SprayDiameterService } from '@app/services/tool-modifier/spraydiameter/spray-diameter.service';
import { SprayDiameterModifierState } from './spray-diameter-state';

// The disablement of the "any" tslint rule is justified in this situation as the prototype
// of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
// tslint:disable:no-any
describe('SprayDiameterService', () => {
    let service: SprayDiameterService;
    let setSprayDiameterSpy: jasmine.Spy<any>;
    let getSprayDiameterSpy: jasmine.Spy<any>;
    let setStateSpy: jasmine.Spy<any>;
    let getStateSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SprayDiameterService);
        setSprayDiameterSpy = spyOn<any>(service, 'setSprayDiameter').and.callThrough();
        setStateSpy = spyOn<any>(service, 'setState').and.callThrough();
        getSprayDiameterSpy = spyOn<any>(service, 'getSprayDiameter').and.callThrough();
        getStateSpy = spyOn<any>(service, 'getState').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' should set sray diameter with the incoming argument and getSprayDiameter should equal to the right number', () => {
        const sprayDiameter = 20;
        service.setSprayDiameter(sprayDiameter);
        expect(setSprayDiameterSpy).toHaveBeenCalled();

        expect(service.getSprayDiameter()).toBe(sprayDiameter);
        expect(getSprayDiameterSpy).toHaveBeenCalled();
    });

    it(' setSprayDiameter should set number spray diameter to the 200  if input is above 200', () => {
        const sprayDiameter = 201;
        const maxNumberSprayDiameter = service.MAX_SPRAY_DIAMETER;
        service.setSprayDiameter(sprayDiameter);
        expect(setSprayDiameterSpy).toHaveBeenCalled();

        expect(service.getSprayDiameter()).toBe(maxNumberSprayDiameter);
        expect(setSprayDiameterSpy).toHaveBeenCalled();
    });

    it(' setSprayDiameter should set spray diameter to 10 if input is below 10', () => {
        const sprayDiameter = 9;
        const minNumberSprayDiameter = service.MIN_SPRAY_DIAMETER;
        service.setSprayDiameter(sprayDiameter);
        expect(setSprayDiameterSpy).toHaveBeenCalled();

        expect(service.getSprayDiameter()).toBe(minNumberSprayDiameter);
        expect(getSprayDiameterSpy).toHaveBeenCalled();
    });

    it(' should call setState to the correct incoming argument ', () => {
        const state = {
            sprayDiameter: 50,
        } as SprayDiameterModifierState;
        service.setState(state);
        expect(setStateSpy).toHaveBeenCalled();
        expect(service.getSprayDiameter()).toBe(state.sprayDiameter);
        expect(getSprayDiameterSpy).toHaveBeenCalled();
    });

    it(' should call getState and return SprayDiameterModifierState with correct spray diameter ', () => {
        const state = {
            sprayDiameter: 50,
        } as SprayDiameterModifierState;
        service.setState(state);
        service.getState();
        expect(setStateSpy).toHaveBeenCalled();
        expect(service.getSprayDiameter()).toBe(state.sprayDiameter);
        expect(getSprayDiameterSpy).toHaveBeenCalled();
        expect(getStateSpy).toHaveBeenCalled();
    });

    it('should have a default after creation', () => {
        const DEFAULT_SPRAY_DIAMETER: number = service.DEFAULT_SPRAY_DIAMETER;
        const sprayDiameter: number = service.getSprayDiameter();
        expect(sprayDiameter).toEqual(DEFAULT_SPRAY_DIAMETER);
    });

    it('setSprayDiameter should set the spray diameter to the incoming argument and SprayDiameter should return the set number', () => {
        const sprayDiameter = 50;
        service.setSprayDiameter(sprayDiameter);
        expect(service.getSprayDiameter()).toEqual(sprayDiameter);
    });

    it(' setSprayDiameter should set the spray diameter to 200 if input is above 200', () => {
        const sprayDiameter = 201;
        const maxSprayDiameter = service.MAX_SPRAY_DIAMETER;
        service.setSprayDiameter(sprayDiameter);
        expect(service.getSprayDiameter()).toEqual(maxSprayDiameter);
    });

    it(' setSprayDiameter should set the spray diameter to 10 if input is below 10', () => {
        const sprayDiameter = 9;
        const minSprayDiameter = service.MIN_SPRAY_DIAMETER;
        service.setSprayDiameter(sprayDiameter);
        expect(service.getSprayDiameter()).toEqual(minSprayDiameter);
    });
});
