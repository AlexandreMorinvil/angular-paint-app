import { TestBed } from '@angular/core/testing';
import { StampPickerModifierState } from './stamp-picker-state';
import { StampEnum, StampPickerService } from './stamp-picker.service';
// The disablement of the "any" tslint rule is justified in this situation as the prototype
// of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
// tslint:disable:no-any
describe('Service: StampPickerViewerService', () => {
    let service: StampPickerService;

    let setStateSpy: jasmine.Spy<any>;
    let getStateSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [StampPickerService],
        });
        service = TestBed.inject(StampPickerService);
        setStateSpy = spyOn<any>(service, 'setState').and.callThrough();
        getStateSpy = spyOn<any>(service, 'getState').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return the right stamp', () => {
        const listTexture: string[] = Object.values(StampEnum);
        expect(service.getListStamps()).toEqual(listTexture);
    });

    it('should change to the right stamp', () => {
        service.setStamp('Étampe 1');
        expect(service.getStamp()).toEqual('Étampe 1');
    });

    it('should do nothing if the stamp does not exist', () => {
        service.setStamp('erreur');
        expect(service.getStamp()).toEqual('Étampe 1');
    });

    it(' should call setState with the correct incoming argument and set stamp with the string: Étampe 1', () => {
        const state = {
            stamp: 'Étampe 1',
        } as StampPickerModifierState;
        service.setState(state);
        expect(setStateSpy).toHaveBeenCalled();
        expect(service.getStamp()).toBe(state.stamp);
    });
});
