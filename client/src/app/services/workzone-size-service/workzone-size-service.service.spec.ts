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

    it('should have workzone bigger than drawingzone when resize needed', inject([WorkzoneSizeService], (service: WorkzoneSizeService) => {
        // tslint:disable-next-line: no-magic-numbers
        service.workZoneHeight = 300;
        // tslint:disable-next-line: no-magic-numbers
        service.workZoneWidth = 300;
        service.updateDrawingZoneDimension({ width: 800, height: 600 });
        expect(service.drawingZoneHeight).toBeLessThan(service.workZoneHeight);
    }));

    it('should have workzone bigger than drawingzone when resize not needed', inject([WorkzoneSizeService], (service: WorkzoneSizeService) => {
        // tslint:disable-next-line: no-magic-numbers
        service.workZoneHeight = 700;
        service.updateDrawingZoneDimension({ width: 800, height: 600 });
        expect(service.drawingZoneHeight).toBeLessThan(service.workZoneHeight);
    }));

    it('should trigger onResize method when window is resized', inject([WorkzoneSizeService], (service: WorkzoneSizeService) => {
        const spyOnResize = spyOn(service, 'onResize').and.callThrough();
        window.dispatchEvent(new Event('resize'));
        expect(spyOnResize).toHaveBeenCalled();
    }));
});
