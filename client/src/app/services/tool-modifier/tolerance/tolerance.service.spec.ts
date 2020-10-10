import { TestBed } from '@angular/core/testing';
import { ToleranceService } from './tolerance.service';

describe('ToleranceService', () => {
    let service: ToleranceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToleranceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
