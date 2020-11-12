import { TestBed } from '@angular/core/testing';
import { NumberSprayTransmissionService } from '../numberspraytransmission/numberspraytransmission.service';

describe('NumberspraytransmissionService', () => {
    let service: NumberSprayTransmissionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NumberSprayTransmissionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
