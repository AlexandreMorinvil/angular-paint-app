import { TestBed } from '@angular/core/testing';
import { WidthModifierState } from './width-state';
import { WidthService } from './width.service';
// The disablement of the "any" tslint rule is justified in this situation as the prototype
// of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
// tslint:disable:no-any
describe('WidthService', () => {
    let service: WidthService;

    let setWidthSpy: jasmine.Spy<any>;
    let getWidthSpy: jasmine.Spy<any>;
    let setStateSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WidthService);
        setWidthSpy = spyOn<any>(service, 'setWidth').and.callThrough();
        getWidthSpy = spyOn<any>(service, 'getWidth').and.callThrough();
        setStateSpy = spyOn<any>(service, 'setState').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' setWidth should set width to the incoming argument and getWidth should return the right number', () => {
        const width = 25;
        service.setWidth(width);
        expect(setWidthSpy).toHaveBeenCalled();
        expect(service.getWidth()).toEqual(width);
        expect(getWidthSpy).toHaveBeenCalled();
    });

    it(' setWidth should set width to the 50 if input is above 50', () => {
        const width = 75;
        const maxWidth = service.MAX_ATTRIBUTE_WIDTH;
        service.setWidth(width);
        expect(setWidthSpy).toHaveBeenCalled();
        expect(service.getWidth()).toEqual(maxWidth);
        expect(getWidthSpy).toHaveBeenCalled();
    });

    it(' setWidth should set width to 1 if input is below 1', () => {
        const width = 0;
        const minWidth = service.MIN_ATTRIBUTE_WIDTH;
        service.setWidth(width);
        expect(setWidthSpy).toHaveBeenCalled();
        expect(service.getWidth()).toEqual(minWidth);
        expect(getWidthSpy).toHaveBeenCalled();
    });

    it(' should call setState to the incoming argument and getWidth should return the right number', () => {
        const state = {
            width: 100,
        } as WidthModifierState;
        service.setState(state);
        expect(setStateSpy).toHaveBeenCalled();
        expect(service.getWidth()).toEqual(state.width);
    });
});
