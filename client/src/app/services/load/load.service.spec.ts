import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LoadService } from './load.service';

class DrawingServiceStub {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
}

describe('LoadService', () => {
    let service: LoadService;
    let drawServiceStub: DrawingServiceStub;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    // let closeAllSpy: jasmine.Spy<any>;
    let dataMock: jasmine.SpyObj<MatDialog>;
    let imgStub: HTMLImageElement;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceStub = { baseCtx: baseCtxStub, previewCtx: previewCtxStub };
        imgStub = document.createElement('img');
        dataMock = jasmine.createSpyObj('MatDialog', ['closeAll']);

        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [
                { provide: DrawingService, useValue: drawServiceStub },
                { provide: MatDialog, useValue: dataMock },
            ],
        });
        service = TestBed.inject(LoadService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should load image', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        service.loadDraw('/example');
        service.fillDraw(imgStub);
        expect(dataMock.closeAll).toHaveBeenCalled();
    });

    it('should not load image', (done) => {
        spyOn(window, 'confirm').and.returnValue(false);
        service.loadDraw('/example');
        service.fillDraw(imgStub);
        expect(dataMock.closeAll).not.toHaveBeenCalled();
        done();
    });

    it('should no load if the nothing image was given', () => {
        service.loadDraw('assets/images/nothing.png');
        expect(dataMock.closeAll).not.toHaveBeenCalled();
    });
    /*
      it('should load given a white canvas', () => {
          // tslint:disable:no-string-literal
          service['drawingService'].baseCtx.fillStyle = '#FFFFFF';
          service['drawingService'].baseCtx.fillRect(1, 1, drawServiceStub.baseCtx.canvas.width, drawServiceStub.baseCtx.canvas.height);
          service.loadDraw('/example');
          service.fillDraw(imgStub);
          expect(dataMock.closeAll).not.toHaveBeenCalled();
      });
  */
});
