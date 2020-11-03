import { TestBed } from '@angular/core/testing';
import { ColorPickerViewerService } from './color-picker-viewer.service';

describe('Service: ColorPickerViewer', () => {
    let service: ColorPickerViewerService;
    // The disablement of the "any" tslint rule is justified in this situation as the prototype
    // of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
    // tslint:disable:no-any
    let setStateSpy: jasmine.Spy<any>;
    let getStateSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ColorPickerViewerService],
        });
        service = TestBed.inject(ColorPickerViewerService);
        setStateSpy = spyOn<any>(service, 'setState').and.callThrough();
        getStateSpy = spyOn<any>(service, 'getState').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' should call setState to the correct incoming argument ', () => {
        const state = {} as ColorPickerViewerService;
        service.setState(state);
        expect(setStateSpy).toHaveBeenCalled();
    });

    it(' should call getState and return SidesModifierState with correct number of sides ', () => {
        const state = {} as ColorPickerViewerService;
        service.setState(state);
        service.getState();
        expect(setStateSpy).toHaveBeenCalled();
        expect(getStateSpy).toHaveBeenCalled();
    });
});
