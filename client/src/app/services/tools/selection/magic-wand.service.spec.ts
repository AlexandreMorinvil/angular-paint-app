import { TestBed } from '@angular/core/testing';
import { InteractionSelectionEllipse } from '@app/classes/action/interaction-selection-ellipse';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { MagicWandService } from './magic-wand.service';
// tslint:disable:max-file-line-count
// tslint:disable:no-any
// tslint:disable:no-magic-numbers

fdescribe('MagicWandService', () => {
    let service: MagicWandService;
    let tracingService: TracingService;
    let colorService: ColorService;
    let widthService: WidthService;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    let mouseEvent25: MouseEvent;
    let mouseEvent120: MouseEvent;
    let mouseEventInRegionLeftClick: MouseEvent;
    let mouseEventInRegionRightClick: MouseEvent;

    let resetTransformSpy: jasmine.Spy<any>;
    let setStartColorSpy: jasmine.Spy<any>;
    let floodFillSelectSpy: jasmine.Spy<any>;
    let drawRectSpy: jasmine.Spy<any>;
    let sameColorSelectSpy: jasmine.Spy<any>;
    let deleteUnderSelectionSpy: jasmine.Spy<any>;
    let onMouseDownSpy: jasmine.Spy<any>;
    let showSelectionSpy: jasmine.Spy<any>;
    let executeSpy: jasmine.Spy<any>;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let rectangleServiceSpy: jasmine.SpyObj<RectangleService>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        baseCtxStub.fillStyle = '#000000';

        baseCtxStub.fillRect(25, 25, 10, 10);
        baseCtxStub.fillRect(50, 25, 10, 10);

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
        drawRectSpy = spyOn<any>(service, 'drawRect').and.callThrough();
        onMouseDownSpy = spyOn<any>(service, 'onMouseDown').and.callThrough();
        executeSpy = spyOn<any>(service, 'execute').and.callThrough();

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

        mouseEvent25 = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
            shiftKey: false,
        } as MouseEvent;

        mouseEvent120 = {
            offsetX: 120,
            offsetY: 120,
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

    it('should create a selection with a left click on a simple shape', () => {
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

    it('should create a selection with a right click on a simple shape', () => {
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
        expect((service as any).hasDoneFirstTranslation).toBe(false);
    });

    it('should call showSelection on mouse move after mouse down with a left click selection and set startDownCoord correctly', () => {
        service.onMouseDown(mouseEventInRegionLeftClick);
        service.onMouseDown(mouseEventInRegionLeftClick);
        service.onMouseMove(mouseEvent120);
        console.log((service as any).edgePixelsSplitted);
        console.log((service as any).edgePixelsAllRegions);
        expect((service as any).draggingImage).toBe(true);
        expect((service as any).localMouseDown).toBe(true);
        expect((service as any).hasDoneFirstTranslation).toBe(false);
        expect(showSelectionSpy).toHaveBeenCalled();
        expect((service as any).startDownCoord).toEqual({ x: 20, y: 71 });
    });

    it('should call showSelection on a second mouse move after mouse down with a left click selection and set variables correctly', () => {
        service.onMouseDown(mouseEventInRegionLeftClick);
        service.onMouseDown(mouseEventInRegionLeftClick);
        service.onMouseMove(mouseEvent120);
        service.onMouseUp();
        service.onMouseDown(mouseEvent120);
        service.onMouseMove(mouseEvent25);
        expect((service as any).draggingImage).toBe(true);
        expect((service as any).localMouseDown).toBe(true);
        expect((service as any).hasDoneFirstTranslation).toBe(true);
        expect(showSelectionSpy).toHaveBeenCalled();
        expect((service as any).startDownCoord).toEqual({ x: -75, y: -24 });
    });

    it('should not call showSelection on a mouse move without a mouse click before', () => {
        service.onMouseMove(mouseEvent120);
        expect(showSelectionSpy).not.toHaveBeenCalled();
    });

    it('should call showSelection on mouse up after move, mouse down with a left click selection and set startDownCoord correctly', () => {
        service.onMouseDown(mouseEventInRegionLeftClick);
        service.onMouseDown(mouseEventInRegionLeftClick);
        service.onMouseMove(mouseEvent120);
        service.onMouseUp();
        expect((service as any).draggingImage).toBe(false);
        expect((service as any).localMouseDown).toBe(false);
        expect((service as any).hasDoneFirstTranslation).toBe(true);
        expect(showSelectionSpy).toHaveBeenCalled();
        expect((service as any).startDownCoord).toEqual({ x: 20, y: 71 });
    });

    it('should call showSelection on mouse up after move, mouse down with a left click selection and set startDownCoord correctly', () => {
        service.onMouseDown(mouseEventInRegionLeftClick);
        service.onMouseDown(mouseEventInRegionLeftClick);
        service.onMouseMove(mouseEvent120);
        service.onMouseUp();
        expect((service as any).draggingImage).toBe(false);
        expect((service as any).localMouseDown).toBe(false);
        expect((service as any).hasDoneFirstTranslation).toBe(true);
        expect(showSelectionSpy).toHaveBeenCalled();
        expect((service as any).startDownCoord).toEqual({ x: 20, y: 71 });
    });

    it('should not call showSelection on mouse up without clicking before', () => {
        service.onMouseUp();
        expect(showSelectionSpy).not.toHaveBeenCalled();
    });

    it('should spill and sort array', () => {
        (service as any).edgePixelsAllRegions = [
            { x: 1, y: 1 },
            { x: 1, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 4, y: 4 },
            { x: 4, y: 3 },
            { x: 3, y: 3 },
            { x: 3, y: 4 },
            { x: 10, y: 10 },
        ];
        (service as any).splitAndSortEdgeArray();
        expect((service as any).edgePixelsSplitted).toEqual([
            Object({ edgePixels: [Object({ x: 1, y: 1 }), Object({ x: 1, y: 0 }), Object({ x: 0, y: 0 }), Object({ x: 0, y: 1 })] }),
            Object({ edgePixels: [Object({ x: 4, y: 4 }), Object({ x: 4, y: 3 }), Object({ x: 3, y: 3 }), Object({ x: 3, y: 4 })] }),
        ]);
    });

    it('should move selection when pressing an arrow if a selection is created', () => {
        service.onMouseDown(mouseEventInRegionLeftClick);
        service.onArrowDown({ key: 'ArrowUp' } as KeyboardEvent);
        expect(showSelectionSpy).toHaveBeenCalled();
        expect((service as any).draggingImage).toBe(false);
    });

    it('should move selection when pressing an arrow if a selection is created and has been moved before', () => {
        service.onMouseDown(mouseEventInRegionLeftClick);
        service.onMouseDown(mouseEventInRegionLeftClick);
        service.onMouseMove(mouseEvent120);
        service.onMouseUp();
        service.onArrowDown({ key: 'ArrowUp' } as KeyboardEvent);
        expect(showSelectionSpy).toHaveBeenCalled();
        expect((service as any).draggingImage).toBe(false);
    });

    it('should stop moving selection when releasing an arrow if a selection is created', () => {
        service.onMouseDown(mouseEventInRegionLeftClick);
        service.onArrowDown({ key: 'ArrowUp' } as KeyboardEvent);
        service.onArrowUp({ key: 'ArrowUp' } as KeyboardEvent);
        expect(showSelectionSpy).toHaveBeenCalled();
        expect((service as any).draggingImage).toBe(false);
    });

    it('should not do anything when pressing an arrow if no selection was made', () => {
        (service as any).arrowDown = true;
        service.onArrowDown({ key: 'ArrowUp' } as KeyboardEvent);
        service.onArrowUp({ key: 'ArrowUp' } as KeyboardEvent);
        expect(showSelectionSpy).not.toHaveBeenCalled();
    });

    it('should not do anything when pressing a button that is not an arrow', () => {
        service.onMouseDown(mouseEventInRegionLeftClick);
        service.onArrowDown({ key: 'Q' } as KeyboardEvent);
        service.onArrowUp({ key: 'Q' } as KeyboardEvent);
        expect(showSelectionSpy).not.toHaveBeenCalled();
    });

    it('should draw selection contour', () => {
        (service as any).edgePixelsAllRegions = [
            { x: 1, y: 1 },
            { x: 1, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
        ];
        (service as any).splitAndSortEdgeArray();
        (service as any).drawSelectionCoutour();
        expect((service as any).drawingService.previewCtx.getImageData(1, 1, 2, 2).data[3]).toEqual(255);
        expect((service as any).drawingService.previewCtx.getImageData(1, 1, 2, 2).data[7]).toEqual(255);
        expect((service as any).drawingService.previewCtx.getImageData(1, 1, 2, 2).data[11]).toEqual(255);
        expect((service as any).drawingService.previewCtx.getImageData(1, 1, 2, 2).data[15]).toEqual(255);
    });

    it('should clip path correctly', () => {
        (service as any).edgePixelsAllRegions = [
            { x: 1, y: 1 },
            { x: 1, y: 0 },
            { x: 0, y: 0 },
            { x: 0, y: 1 },
        ];
        (service as any).splitAndSortEdgeArray();
        (service as any).pathStartCoordReference = { x: 5, y: 5 };
        (service as any).startDownCoord = { x: 10, y: 10 };
        const magicWandPath = new Path2D();
        magicWandPath.moveTo(6, 6);
        magicWandPath.lineTo(6, 6);
        magicWandPath.lineTo(6, 5);
        magicWandPath.lineTo(5, 5);
        magicWandPath.lineTo(5, 6);
        expect((service as any).getPathToClip()).toEqual(magicWandPath);
    });
    it('should start execute and put image data and clear canvas', () => {
        const interaction = {
            startSelectionPoint: { x: 0, y: 0 },
            selection: new ImageData(1, 1),
        } as InteractionSelectionEllipse;
        service.execute(interaction);
        expect(executeSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });
});
