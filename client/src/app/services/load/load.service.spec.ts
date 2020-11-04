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
  let dataMock: jasmine.SpyObj<MatDialog>;
  let imgStub: HTMLImageElement;

  beforeEach(() => {
    baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    drawServiceStub = { baseCtx: baseCtxStub, previewCtx: previewCtxStub };
    //imgStub = new HTMLImageElement;
    dataMock = jasmine.createSpyObj('MatDialog', { 'closeAll': true })

    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [{ provide: DrawingService, useValue: drawServiceStub }, MatDialog],
    });
    service = TestBed.inject(LoadService);
    closeAllSpy = spyOn<any>(dataMock, 'closeAll').and.returnValue(true);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load image', () => {
    service.loadDraw("/example")
    expect(closeAllSpy).toHaveBeenCalled();
  });

  it('should draw image', () => {
    service.fillDraw(imgStub)
    expect(closeAllSpy).toHaveBeenCalled();
  });
});
