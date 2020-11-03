import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LoadService } from './load.service';

export class DrawingServiceStub {
  baseCtx: CanvasRenderingContext2D
  previewCtx: CanvasRenderingContext2D
}
describe('LoadService', () => {
  let service: LoadService;
  let drawServiceStub: DrawingServiceStub;
  let baseCtxStub: CanvasRenderingContext2D;
  let previewCtxStub: CanvasRenderingContext2D;
  let closeAllSpy: jasmine.Spy<any>;
  let data: MatDialog;

  beforeEach(() => {
    baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    drawServiceStub = { baseCtx: baseCtxStub, previewCtx: previewCtxStub };

    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [{ provide: MatDialog, useValue: data }, { provide: DrawingService, useValue: drawServiceStub }],
    });
    service = TestBed.inject(LoadService);
    closeAllSpy = spyOn<any>(data, 'closeAll');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load image', () => {
    service.loadDraw("/example")
    expect(closeAllSpy).toHaveBeenCalled();
  });
});
