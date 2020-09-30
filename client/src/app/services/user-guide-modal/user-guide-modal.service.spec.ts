/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserGuideModalService } from './user-guide-modal.service';

describe('Service: UserGuideModal', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UserGuideModalService,
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
                { provide: MatDialog, useValue: {} },
            ],
        });
    });

    it('should ...', inject([UserGuideModalService], (service: UserGuideModalService) => {
        expect(service).toBeTruthy();
    }));
});
