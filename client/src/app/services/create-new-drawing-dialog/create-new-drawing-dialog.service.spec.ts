import { TestBed } from '@angular/core/testing';
import { CreateNewDrawingDialogService } from './create-new-drawing-dialog.service';

describe('CreateNewDrawingDialogService', () => {
    let service: CreateNewDrawingDialogService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CreateNewDrawingDialogService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
