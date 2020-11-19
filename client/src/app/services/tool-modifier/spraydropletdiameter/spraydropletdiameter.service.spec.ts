import { TestBed } from '@angular/core/testing';
import { SprayDropletDiameterService } from '@app/services/tool-modifier/spraydropletdiameter/spraydropletdiameter.service';
import { SprayDropletDiameterModifierState } from './spray-droplet-diameter-state';

// The disablement of the "any" tslint rule is justified in this situation as the prototype
// of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
// tslint:disable:no-any
// tslint:disable: max-line-length
describe('SpraydropletdiameterService', () => {
    let service: SprayDropletDiameterService;
    let setSprayDropletDiameterSpy: jasmine.Spy<any>;
    let getSprayDropletDiameterSpy: jasmine.Spy<any>;
    let setStateSpy: jasmine.Spy<any>;
    let getStateSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SprayDropletDiameterService);
        setSprayDropletDiameterSpy = spyOn<any>(service, 'setSprayDropletDiameter').and.callThrough();
        setStateSpy = spyOn<any>(service, 'setState').and.callThrough();
        getSprayDropletDiameterSpy = spyOn<any>(service, 'getSprayDropletDiameter').and.callThrough();
        getStateSpy = spyOn<any>(service, 'getState').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' should set sray droplet diameter with the incoming argument and getSprayDropletDiameter should equal to the right number', () => {
        const sprayDropletDiameter = 10;
        service.setSprayDropletDiameter(sprayDropletDiameter);
        expect(setSprayDropletDiameterSpy).toHaveBeenCalled();

        expect(service.getSprayDropletDiameter()).toBe(sprayDropletDiameter);
        expect(getSprayDropletDiameterSpy).toHaveBeenCalled();
    });

    it(' setSprayDropletDiameter should set number spray droplet diameter to the 15 if input is above 15', () => {
        const sprayDropletDiameter = 16;
        const maxNumberSprayDropletDiameter = service.MAX_SPRAY_DROPLET_DIAMETER;
        service.setSprayDropletDiameter(sprayDropletDiameter);
        expect(setSprayDropletDiameterSpy).toHaveBeenCalled();

        expect(service.getSprayDropletDiameter()).toBe(maxNumberSprayDropletDiameter);
        expect(setSprayDropletDiameterSpy).toHaveBeenCalled();
    });

    it(' setSprayDropletDiameter should set spray droplet diameter to 1 if input is below 1', () => {
        const sprayDropletDiameter = 0;
        const minNumberSprayDropletDiameter = service.MIN_SPRAY_DROPLET_DIAMETER;
        service.setSprayDropletDiameter(sprayDropletDiameter);
        expect(setSprayDropletDiameterSpy).toHaveBeenCalled();

        expect(service.getSprayDropletDiameter()).toBe(minNumberSprayDropletDiameter);
        expect(getSprayDropletDiameterSpy).toHaveBeenCalled();
    });

    it(' should call setState to the correct incoming argument ', () => {
        const state = {
            sprayDropletDiameter: 5,
        } as SprayDropletDiameterModifierState;
        service.setState(state);
        expect(setStateSpy).toHaveBeenCalled();
        expect(service.getSprayDropletDiameter()).toBe(state.sprayDropletDiameter);
        expect(getSprayDropletDiameterSpy).toHaveBeenCalled();
    });

    it(' should call getState and return SprayDropletDiameterModifierState with correct spray droplet diameter ', () => {
        const state = {
            sprayDropletDiameter: 5,
        } as SprayDropletDiameterModifierState;
        service.setState(state);
        service.getState();
        expect(setStateSpy).toHaveBeenCalled();
        expect(service.getSprayDropletDiameter()).toBe(state.sprayDropletDiameter);
        expect(getSprayDropletDiameterSpy).toHaveBeenCalled();
        expect(getStateSpy).toHaveBeenCalled();
    });

    it('should have a default after creation', () => {
        const DEFAULT_SPRAY_DROPLET_DIAMETER: number = service.DEFAULT_SPRAY_DROPLET_DIAMETER;
        const sprayDropletDiameter: number = service.getSprayDropletDiameter();
        expect(sprayDropletDiameter).toEqual(DEFAULT_SPRAY_DROPLET_DIAMETER);
    });

    it('setSprayDropletDiameter should set the spray droplet diameter to the incoming argument and SprayDropletDiameter should return the set number', () => {
        const sprayDropletDiameter = 5;
        service.setSprayDropletDiameter(sprayDropletDiameter);
        expect(service.getSprayDropletDiameter()).toEqual(sprayDropletDiameter);
    });

    it(' setSprayDropletDiameter should set the spray droplet diameter to 15 if input is above 15', () => {
        const sprayDropletDiameter = 16;
        const maxSprayDropletDiameter = service.MAX_SPRAY_DROPLET_DIAMETER;
        service.setSprayDropletDiameter(sprayDropletDiameter);
        expect(service.getSprayDropletDiameter()).toEqual(maxSprayDropletDiameter);
    });

    it(' setSprayDropletDiameter should set the spray droplet diameter to 1 if input is below 1', () => {
        const sprayDropletDiameter = 0;
        const minSprayDropletDiameter = service.MIN_SPRAY_DROPLET_DIAMETER;
        service.setSprayDropletDiameter(sprayDropletDiameter);
        expect(service.getSprayDropletDiameter()).toEqual(minSprayDropletDiameter);
    });
});
