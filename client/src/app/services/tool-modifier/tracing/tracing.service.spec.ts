import { TestBed } from '@angular/core/testing';

import { TracingService } from './tracing.service';

describe('TracingService', () => {
    let service: TracingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TracingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setHasFill should set the hasFill attribute to the incoming argument and getHasFill should return set value', () => {
        const value = true;
        service.setHasFill(value);
        expect(service.getHasFill()).toEqual(value);
    });

    it('setHasContour should set the hasContour attribute to the incoming argument and getHasContour should return set value', () => {
        const value = true;
        service.setHasContour(value);
        expect(service.getHasContour()).toEqual(value);
    });
});
