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

    it('should not have saved drawings', inject([AutoSaveService], (service: AutoSaveService) => {
        service.clearAutoSaveDrawing();
        expect(service.hasSavedDrawing()).toBeFalse();
    }));

    it('should have saved drawings', inject([AutoSaveService], (service: AutoSaveService) => {
        service.autoSave('test');
        expect(service.hasSavedDrawing()).toBeTrue();
    }));

    it('should have saved drawings', inject([AutoSaveService], (service: AutoSaveService) => {
        service.autoSave('test');
        expect(service.getAutoSavedDrawingURL()).toBe('test');
    }));
});
