import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { SaveService } from './save.service';

describe('SaveService', () => {
    let service: SaveService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [MatDialog],
        });
        service = TestBed.inject(SaveService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
