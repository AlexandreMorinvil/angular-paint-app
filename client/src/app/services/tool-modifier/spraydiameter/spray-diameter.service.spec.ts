import { TestBed } from '@angular/core/testing';
import { SprayDiameterService } from '@app/services/tool-modifier/spraydiameter/spray-diameter.service';

describe('SprayDiameterService', () => {
    let service: SprayDiameterService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SprayDiameterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
