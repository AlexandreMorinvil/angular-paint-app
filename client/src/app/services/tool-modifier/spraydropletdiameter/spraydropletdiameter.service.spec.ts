import { TestBed } from '@angular/core/testing';
import { SprayDropletDiameterService } from '../spraydropletdiameter/spraydropletdiameter.service';

describe('SpraydropletdiameterService', () => {
    let service: SprayDropletDiameterService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SprayDropletDiameterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
