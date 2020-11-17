import { TestBed } from '@angular/core/testing';
import { FeatherService } from './feather-service';

describe('FeatherService', () => {
    let service: FeatherService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(FeatherService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
