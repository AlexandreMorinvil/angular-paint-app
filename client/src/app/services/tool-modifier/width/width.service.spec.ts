import { TestBed } from '@angular/core/testing';
import { WidthService } from './width.service';

describe('WidthService', () => {
    let service: WidthService;
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

    it(' setWidth should set width to the 50', () => {
        const width = 75;
        const maxWidth = 50;
        service.setWidth(width);
        expect(setWidthSpy).toHaveBeenCalled();
        expect(service.getWidth()).toEqual(maxWidth);
        expect(getWidthSpy).toHaveBeenCalled();
    });

    it(' setWidth should set width to 1', () => {
        const width = 0;
        const minWidth = 1;
        service.setWidth(width);
        expect(setWidthSpy).toHaveBeenCalled();
        expect(service.getWidth()).toEqual(minWidth);
        expect(getWidthSpy).toHaveBeenCalled();
    });
});
