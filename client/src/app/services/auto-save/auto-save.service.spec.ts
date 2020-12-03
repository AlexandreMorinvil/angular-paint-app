import { inject, TestBed } from '@angular/core/testing';
import { AutoSaveService } from './auto-save.service';

describe('Service: AutoSave', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AutoSaveService],
        });
    });

    it('should ...', inject([AutoSaveService], (service: AutoSaveService) => {
        expect(service).toBeTruthy();
    }));
});
