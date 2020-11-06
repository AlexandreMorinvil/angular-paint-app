import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from './drawing.service';
// tslint:disable:no-any
describe('DrawingService', () => {
    let service: DrawingService;

    let resetDrawingSpy: jasmine.Spy<any>;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawingService);
        service.canvas = canvasTestHelper.canvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should clear the whole canvas', () => {
        service.clearCanvas(service.baseCtx);
        const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
        const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
        expect(hasColoredPixels).toEqual(false);
    });

    it('should call resetDrawingWithWarning and ask before delete with answer true', () => {
        service.hasBeenDrawnOnto = true;
        resetDrawingSpy = jasmine.createSpy('resetDrawingWithWarning');
        spyOn(window, 'confirm').and.returnValue(true);
        service.resetDrawingWithWarning();
        expect(resetDrawingSpy).not.toHaveBeenCalled();
    });

    it('should call resetDrawingWithWarning and ask before delete with answer false', () => {
        service.hasBeenDrawnOnto = true;
        resetDrawingSpy = jasmine.createSpy('resetDrawingWithWarning');
        spyOn(window, 'confirm').and.returnValue(false);
        service.resetDrawingWithWarning();
        expect(resetDrawingSpy).not.toHaveBeenCalled();
    });
});
