import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoadService } from './load.service';

describe('LoadService', () => {
    let service: LoadService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [MatDialog],
        });
        service = TestBed.inject(LoadService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
