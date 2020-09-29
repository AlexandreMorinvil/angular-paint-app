/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { WorkzoneSizeService } from './workzone-size.service';

describe('Service: WorkzoneSizeService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WorkzoneSizeService],
        });
    });

    it('should ...', inject([WorkzoneSizeService], (service: WorkzoneSizeService) => {
        expect(service).toBeTruthy();
    }));
});
