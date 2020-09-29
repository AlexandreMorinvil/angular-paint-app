/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { UserGuideModalService } from './user-guide-modal.service';

describe('Service: UserGuideModal', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UserGuideModalService],
        });
    });

    it('should ...', inject([UserGuideModalService], (service: UserGuideModalService) => {
        expect(service).toBeTruthy();
    }));
});
