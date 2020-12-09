import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SaveService } from './save.service';
// tslint:disable:no-any
describe('SaveService', () => {
    let service: SaveService;
    let canvasStub: HTMLCanvasElement;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    let saveSpy: jasmine.Spy<any>;
    let restoreSpy: jasmine.Spy<any>;
    let drawImageSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;

        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [MatDialog],
        });
        service = TestBed.inject(SaveService);
        (service as any).drawingService.baseCtx = baseCtxStub;
        (service as any).drawingService.previewCtx = previewCtxStub;
        (service as any).drawingService.canvas = canvasStub;
        // tslint:disable:no-magic-numbers
        (service as any).drawingService.canvas.width = 1000;
        (service as any).drawingService.canvas.height = 800;

        saveSpy = spyOn<any>((service as any).drawingService.baseCtx, 'save').and.callThrough();
        restoreSpy = spyOn<any>((service as any).drawingService.baseCtx, 'restore').and.callThrough();
        drawImageSpy = spyOn<any>((service as any).drawingService.baseCtx, 'drawImage').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should save the imgSource on saveDraw', () => {
        service.saveDraw('png');
        expect(service.imageSource).not.toBeNull();
        expect(baseCtxStub.globalCompositeOperation).toEqual('source-over');
        expect(baseCtxStub.fillStyle).toEqual('#000000');
        expect(saveSpy).toHaveBeenCalled();
        expect(restoreSpy).toHaveBeenCalled();
        expect(drawImageSpy).toHaveBeenCalled();
    });
});
