import { TestBed } from '@angular/core/testing';
import { ModifierHandlerService } from '@app/services/tool-modifier/modifier-handler/modifier-handler.service';

describe('ModifierHandlerService', () => {
    let service: ModifierHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ModifierHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
