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

    it('should add small space when drawizoneHeight is bigger than workZoneHeight', inject([WorkzoneSizeService], (service: WorkzoneSizeService) => {
        const reallyBigDimension = 100000;
        const smallDimension = 600;
        const SMALL_SPACE = 120;
        service.drawingZoneHeight = reallyBigDimension;
        service.drawingZoneWidth = reallyBigDimension;

        service.workZoneHeight = smallDimension;

        service.updateDrawingZoneDimension({ height: reallyBigDimension, width: reallyBigDimension });
        expect(service.workZoneHeight).toEqual(reallyBigDimension + SMALL_SPACE);
    }));

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
        service.drawingZoneHeight = smallerThanMin;
        service.drawingZoneWidth = smallerThanMin;

        service.resizeDrawingZone();
        expect(service.drawingZoneHeight).toEqual(min);
        expect(service.drawingZoneWidth).toEqual(min);
    }));

    it('should never be smaller than working zone minimal size ', inject([WorkzoneSizeService], (service: WorkzoneSizeService) => {
        const min = service.WORKZONE_MINIMAL_SIZE;
        const smallerThanMin = service.WORKZONE_MINIMAL_SIZE / 2;
        service.drawingZoneHeight = smallerThanMin;
        service.workZoneWidth = smallerThanMin;

        spyOnProperty(window, 'innerWidth').and.returnValue(smallerThanMin);
        spyOnProperty(window, 'innerHeight').and.returnValue(smallerThanMin);
        window.dispatchEvent(new Event('resize'));

        service.resizeWorkZone();
        expect(service.workZoneHeight).toEqual(min);
        expect(service.workZoneWidth).toEqual(min);
    }));
});
