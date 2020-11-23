import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { RectangleService } from '../rectangle/rectangle-service';
import { MagicWandService } from './magic-wand.service';

fdescribe('MagicWandService', () => {
    let service: MagicWandService;
    let tracingService: TracingService;
    let colorService: ColorService;
    let widthService: WidthService;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    //let mouseEventNotInCanvas: MouseEvent;
    //let mouseEvent25: MouseEvent;
    let mouseEvent50: MouseEvent;
    let mouseEventInRegionLeftClick: MouseEvent;
    let mouseEventInRegionRightClick: MouseEvent;

    let resetTransformSpy: jasmine.Spy<any>;
    let setStartColorSpy: jasmine.Spy<any>;
    let floodFillSelectSpy: jasmine.Spy<any>;
    let drawRectSpy: jasmine.Spy<any>;
    let sameColorSelectSpy: jasmine.Spy<any>;
    let deleteUnderSelectionSpy: jasmine.Spy<any>;
    //let matchStartColorSpy: jasmine.Spy<any>;
    //let isNotSelectedSpy: jasmine.Spy<any>;
    //let isEdgePixelSpy: jasmine.Spy<any>;
    //let splitAndSortEdgeArraySpy: jasmine.Spy<any>;
    //let drawSelectionCoutourSpy: jasmine.Spy<any>;
    let onMouseDownSpy: jasmine.Spy<any>;
    //let onMouseUpSpy: jasmine.Spy<any>;
    //let onMouseMoveSpy: jasmine.Spy<any>;
    //let deleteUnderSelectionSpy: jasmine.Spy<any>;
    let showSelectionSpy: jasmine.Spy<any>;
    //let clearPathSpy: jasmine.Spy<any>;
    //let checkArrowHitSpy: jasmine.Spy<any>;
    //let onArrowDownSpy: jasmine.Spy<any>;
    //let getPathSpy: jasmine.Spy<any>;
    //let executeSpy: jasmine.Spy<any>;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let rectangleServiceSpy: jasmine.SpyObj<RectangleService>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        baseCtxStub.fillRect(25, 25, 10, 10);

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        rectangleServiceSpy = jasmine.createSpyObj('RectangleService', ['onMouseMove', 'drawRectangle', 'drawPreviewRect', 'onMouseDown']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: RectangleService, useValue: rectangleServiceSpy },
            ],
        });
        service = TestBed.inject(MagicWandService);
        tracingService = TestBed.inject(TracingService);
        colorService = TestBed.inject(ColorService);
        widthService = TestBed.inject(WidthService);

        resetTransformSpy = spyOn<any>(service, 'resetTransform').and.callThrough();
        setStartColorSpy = spyOn<any>(service, 'setStartColor').and.callThrough();
        floodFillSelectSpy = spyOn<any>(service, 'floodFillSelect').and.callThrough();
        sameColorSelectSpy = spyOn<any>(service, 'sameColorSelect').and.callThrough();
        showSelectionSpy = spyOn<any>(service, 'showSelection').and.callThrough();
        deleteUnderSelectionSpy = spyOn<any>(service, 'deleteUnderSelection').and.callThrough();

        //matchStartColorSpy = spyOn<any>(service, 'matchStartColor').and.callThrough();
        //isNotSelectedSpy = spyOn<any>(service, 'isNotSelected').and.callThrough();
        //isEdgePixelSpy = spyOn<any>(service, 'isEdgePixel').and.callThrough();
        drawRectSpy = spyOn<any>(service, 'drawRect').and.callThrough();
        //splitAndSortEdgeArraySpy = spyOn<any>(service, 'splitAndSortEdgeArray').and.callThrough();
        //drawSelectionCoutourSpy = spyOn<any>(service, 'drawSelectionCoutour').and.callThrough();
        onMouseDownSpy = spyOn<any>(service, 'onMouseDown').and.callThrough();

        /*   deleteUnderSelectionSpy = spyOn<any>(service, 'deleteUnderSelectionSpy').and.callThrough();
  showSelectionSpy = spyOn<any>(service, 'showSelection').and.callThrough();

  onMouseUpSpy = spyOn<any>(service, 'onMouseUp').and.callThrough();
  onMouseMoveSpy = spyOn<any>(service, 'onMouseMove').and.callThrough();
  clearPathSpy = spyOn<any>(service, 'clearPath').and.callThrough();
  getPathSpy = spyOn<any>(service, 'getPath').and.callThrough();
  checkArrowHitSpy = spyOn<any>(service, 'checkArrowHit').and.callThrough();
  onArrowDownSpy = spyOn<any>(service, 'onArrowDown').and.callThrough();
  executeSpy = spyOn<any>(service, 'execute').and.callThrough();
*/
        const canvasWidth = 200;
        const canvasHeight = 100;

        (service as any).tracingService = tracingService;
        (service as any).colorService = colorService;
        (service as any).widthService = widthService;
        (service as any).drawingService.baseCtx = baseCtxStub;
        (service as any).drawingService.previewCtx = previewCtxStub;
        (service as any).drawingService.canvas = canvasStub;
        (service as any).drawingService.canvas.width = canvasWidth;
        (service as any).drawingService.canvas.height = canvasHeight;
        /*
    mouseEventNotInCanvas = {
      offsetX: 2000,
      offsetY: 2000,
      button: 0,
      shiftKey: false,
    } as MouseEvent;

    mouseEvent25 = {
      offsetX: 25,
      offsetY: 25,
      button: 0,
      shiftKey: false,
    } as MouseEvent;
*/
        mouseEvent50 = {
            offsetX: 50,
            offsetY: 50,
            button: 0,
            shiftKey: false,
        } as MouseEvent;

        mouseEventInRegionLeftClick = {
            offsetX: 30,
            offsetY: 30,
            button: 0,
            shiftKey: false,
        } as MouseEvent;
        mouseEventInRegionRightClick = {
            offsetX: 30,
            offsetY: 30,
            button: 2,
            shiftKey: false,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call resetTransform on mouse down,set attribute correctly and create a selection with a left click', () => {
        service.onMouseDown(mouseEventInRegionLeftClick);
        expect((service as any).arrowPress).toEqual([false, false, false, false]);
        expect((service as any).arrowDown).toBe(false);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(resetTransformSpy).toHaveBeenCalled();
        expect(setStartColorSpy).toHaveBeenCalled();
        expect(floodFillSelectSpy).toHaveBeenCalled();
        expect(drawRectSpy).toHaveBeenCalled();
        expect(onMouseDownSpy).toHaveBeenCalled();
        expect((service as any).localMouseDown).toEqual(false);
    });

    it('should be call resetTransform on mouse down,set attribute correctly and create a selection with a right click', () => {
        service.onMouseDown(mouseEventInRegionRightClick);
        expect((service as any).arrowPress).toEqual([false, false, false, false]);
        expect((service as any).arrowDown).toBe(false);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(resetTransformSpy).toHaveBeenCalled();
        expect(setStartColorSpy).toHaveBeenCalled();
        expect(sameColorSelectSpy).toHaveBeenCalled();
        expect(drawRectSpy).toHaveBeenCalled();
        expect(onMouseDownSpy).toHaveBeenCalled();
        expect((service as any).localMouseDown).toEqual(false);
    });

    it('should call showSelection, deleteUnderSelection and set variables if a selected area is clicked', () => {
        service.onMouseDown(mouseEventInRegionLeftClick);
        service.onMouseDown(mouseEventInRegionLeftClick);
        expect(showSelectionSpy).toHaveBeenCalled();
        expect(deleteUnderSelectionSpy).toHaveBeenCalled();
        expect((service as any).draggingImage).toBe(true);
        expect((service as any).mouseDown).toBe(true);
    });

    it('should be call showSelection on mouse move after mouse down, set startDownCoord correctly', () => {
        service.onMouseDown(mouseEventInRegionLeftClick);
        service.onMouseDown(mouseEventInRegionLeftClick);
        service.onMouseMove(mouseEvent50);
        expect((service as any).draggingImage).toBe(true);
        expect((service as any).localMouseDown).toBe(true);
        expect(showSelectionSpy).toHaveBeenCalled();
    });
});
