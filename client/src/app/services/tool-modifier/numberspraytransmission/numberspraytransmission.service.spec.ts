import { TestBed } from '@angular/core/testing';
import { NumberSprayTransmissionService } from '@app/services/tool-modifier/numberspraytransmission/numberspraytransmission.service';
import { NumberSprayTransmissionModifierState } from './number-spray-transmission-state';
// The disablement of the "any" tslint rule is justified in this situation as the prototype
// of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
// tslint:disable:no-any
describe('NumberspraytransmissionService', () => {
    let service: NumberSprayTransmissionService;
    let setNumberSprayTransmissionSpy: jasmine.Spy<any>;
    let getNumberSprayTransmissionSpy: jasmine.Spy<any>;
    let setStateSpy: jasmine.Spy<any>;
    let getStateSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NumberSprayTransmissionService);
        setNumberSprayTransmissionSpy = spyOn<any>(service, 'setNumberSprayTransmission').and.callThrough();
        setStateSpy = spyOn<any>(service, 'setState').and.callThrough();
        getNumberSprayTransmissionSpy = spyOn<any>(service, 'getNumberSprayTransmission').and.callThrough();
        getStateSpy = spyOn<any>(service, 'getState').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' should set number sray transmission with the incoming argument and getNumberSprayTransmission should equal to the right number', () => {
        const numberSprayTransmission = 50;
        service.setNumberSprayTransmission(numberSprayTransmission);
        expect(setNumberSprayTransmissionSpy).toHaveBeenCalled();

        expect(service.getNumberSprayTransmission()).toBe(numberSprayTransmission);
        expect(getNumberSprayTransmissionSpy).toHaveBeenCalled();
    });

    it(' setNumberSprayTransmission should set number spray transmission to the 200  if input is above 200', () => {
        const numberSprayTransmission = 201;
        const maxNumberSprayTransmission = service.MAX_NUMBER_SPRAY_TRANSMISSION;
        service.setNumberSprayTransmission(numberSprayTransmission);
        expect(setNumberSprayTransmissionSpy).toHaveBeenCalled();

        expect(service.getNumberSprayTransmission()).toBe(maxNumberSprayTransmission);
        expect(getNumberSprayTransmissionSpy).toHaveBeenCalled();
    });

    it(' setNumberSprayTransmission should set number spray transmission to 10 if input is below 10', () => {
        const numberSprayTransmission = 9;
        const minNumberSprayTransmission = service.MIN_NUMBER_SPRAY_TRANSMISSION;
        service.setNumberSprayTransmission(numberSprayTransmission);
        expect(setNumberSprayTransmissionSpy).toHaveBeenCalled();

        expect(service.getNumberSprayTransmission()).toBe(minNumberSprayTransmission);
        expect(getNumberSprayTransmissionSpy).toHaveBeenCalled();
    });

    it(' should call setState to the correct incoming argument ', () => {
        const state = {
            numberSprayTransmission: 50,
        } as NumberSprayTransmissionModifierState;
        service.setState(state);
        expect(setStateSpy).toHaveBeenCalled();
        expect(service.getNumberSprayTransmission()).toBe(state.numberSprayTransmission);
        expect(getNumberSprayTransmissionSpy).toHaveBeenCalled();
    });

    it(' should call getState and return NumberSprayTransmissionModifierState with correct number of spray transmission ', () => {
        const state = {
            numberSprayTransmission: 50,
        } as NumberSprayTransmissionModifierState;
        service.setState(state);
        service.getState();
        expect(setStateSpy).toHaveBeenCalled();
        expect(service.getNumberSprayTransmission()).toBe(state.numberSprayTransmission);
        expect(getNumberSprayTransmissionSpy).toHaveBeenCalled();
        expect(getStateSpy).toHaveBeenCalled();
    });

    it('should have a default after creation', () => {
        const DEFAULT_NUMBER_TRANSMISSION: number = service.DEFAULT_NUMBER_SPRAY_TRANSMISSION;
        const numberSprayTransmission: number = service.getNumberSprayTransmission();
        expect(numberSprayTransmission).toEqual(DEFAULT_NUMBER_TRANSMISSION);
    });

    it('setNumberSprayTransmission should set the number of spray transmission to the incoming argument and getNumberSprayTransmission should return the set number', () => {
        const numberSprayTransmission = 50;
        service.setNumberSprayTransmission(numberSprayTransmission);
        expect(service.getNumberSprayTransmission()).toEqual(numberSprayTransmission);
    });

    it(' setNumberSprayTransmission should set the number of spray transmission to 200 if input is above 200', () => {
        const numberSprayTransmission = 201;
        const maxNumberSprayTransmission = service.MAX_NUMBER_SPRAY_TRANSMISSION;
        service.setNumberSprayTransmission(numberSprayTransmission);
        expect(service.getNumberSprayTransmission()).toEqual(maxNumberSprayTransmission);
    });

    it(' setNumberSprayTransmission should set the number of spray transmission to 10 if input is below 10', () => {
        const numberSprayTransmission = 9;
        const minNumberSprayTransmission = service.MIN_NUMBER_SPRAY_TRANSMISSION;
        service.setNumberSprayTransmission(numberSprayTransmission);
        expect(service.getNumberSprayTransmission()).toEqual(minNumberSprayTransmission);
    });
});
