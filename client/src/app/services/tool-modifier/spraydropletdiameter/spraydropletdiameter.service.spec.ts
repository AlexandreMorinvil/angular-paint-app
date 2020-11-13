import { TestBed } from '@angular/core/testing';
import { SprayDropletDiameterService } from '@app/services/tool-modifier/spraydropletdiameter/spraydropletdiameter.service';

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
