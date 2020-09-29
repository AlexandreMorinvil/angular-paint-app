import { TestBed } from '@angular/core/testing';
import { WidthService } from './width.service';

describe('WidthService', () => {
    let service: WidthService;

    // The disablement of the "any" tslint rule is justified in this situation as the prototype
    // of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
    // tslint:disable:no-any
    let setWidthSpy: jasmine.Spy<any>;
    let getWidthSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WidthService);
        // tslint:disable:no-any
        setWidthSpy = spyOn<any>(service, 'setWidth').and.callThrough();
        getWidthSpy = spyOn<any>(service, 'getWidth').and.callThrough();
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
});
