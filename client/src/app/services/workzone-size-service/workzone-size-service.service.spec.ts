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
<<<<<<< HEAD
=======

    it('should keep dimensions the same when drawingZone is bigger than window', inject([WorkzoneSizeService], (service: WorkzoneSizeService) => {
        const reallyBigDimension = 100000;
        service.drawingZoneHeight = reallyBigDimension;
        service.drawingZoneWidth = reallyBigDimension;

        service.onResize();
        expect(service.drawingZoneHeight).toEqual(reallyBigDimension);
        expect(service.drawingZoneWidth).toEqual(reallyBigDimension);
    }));

    it('should change dimensions when drawingZone is smaller than window', inject([WorkzoneSizeService], (service: WorkzoneSizeService) => {
        const reallySmall = 250;
        const reallyBigDimension = 100000;
        service.drawingZoneHeight = reallySmall;
        service.drawingZoneWidth = reallySmall;

        spyOnProperty(window, 'innerWidth').and.returnValue(reallyBigDimension);
        spyOnProperty(window, 'innerHeight').and.returnValue(reallyBigDimension);

        service.onResize();
        expect(service.drawingZoneHeight).toEqual(reallySmall);
        expect(service.drawingZoneWidth).toEqual(reallySmall);
    }));

    it('should never be smaller than drawing zone minimal size ', inject([WorkzoneSizeService], (service: WorkzoneSizeService) => {
        const min = service.DRAWINGZONE_MINIMAL_SIZE;
        const smallerThanMin = service.DRAWINGZONE_MINIMAL_SIZE / 2;
        service.drawingZoneWidth = smallerThanMin;
        service.drawingZoneWidth = smallerThanMin;

        service.resizeDrawingZone();
        expect(service.drawingZoneWidth).toEqual(min);
        expect(service.drawingZoneWidth).toEqual(min);
    }));

    it('should never be smaller than working zone minimal size ', inject([WorkzoneSizeService], (service: WorkzoneSizeService) => {
        const min = service.WORKZONE_MINIMAL_SIZE;
        const smallerThanMin = service.WORKZONE_MINIMAL_SIZE / 2;
        service.workZoneWidth = smallerThanMin;
        service.workZoneWidth = smallerThanMin;

        spyOnProperty(window, 'innerWidth').and.returnValue(smallerThanMin);
        spyOnProperty(window, 'innerHeight').and.returnValue(smallerThanMin);
        window.dispatchEvent(new Event('resize'));

        service.resizeWorkZone();
        expect(service.workZoneHeight).toEqual(min);
        expect(service.workZoneWidth).toEqual(min);
    }));
>>>>>>> integration/development
});
