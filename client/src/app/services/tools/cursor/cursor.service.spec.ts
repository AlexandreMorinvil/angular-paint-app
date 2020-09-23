import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CursorService } from './cursor.service';

describe('CursorService', () => {
  let service: CursorService;
  let mouseEvent: MouseEvent;
  let drawServiceSpy: jasmine.SpyObj<DrawingService>;

  let baseCtxStub: CanvasRenderingContext2D;
  let previewCtxStub: CanvasRenderingContext2D;

  beforeEach(() => {
    baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
    
    TestBed.configureTestingModule({
      providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
    });
    service = TestBed.inject(CursorService);

    service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
    service['drawingService'].previewCtx = previewCtxStub;

    mouseEvent = {
      offsetX: 25,
      offsetY: 25,
      button: 0,
    } as MouseEvent;

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(' mouseDown should set mouseDownCoord to correct position', () => {
    const expectedResult: Vec2 = { x: 25, y: 25 };
    service.onMouseDown(mouseEvent);
    expect(service.mouseDownCoord).toEqual(expectedResult);
  });

  it(' mouseDown should set mouseDown property to true on left click', () => {
    service.onMouseDown(mouseEvent);
    expect(service.mouseDown).toEqual(true);
  });

});
