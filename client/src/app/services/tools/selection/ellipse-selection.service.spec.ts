import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { EllipseSelectionService } from './ellipse-selection.service';

// tslint:disable:max-file-line-count
describe('EllipseSelectionService', () => {
    // tslint:disable:no-any
    let service: EllipseSelectionService;
    let tracingService: TracingService;
    let colorService: ColorService;
    let widthService: WidthService;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    let mouseEventNotInCanvas: MouseEvent;
    let mouseEvent25: MouseEvent;
    let mouseEvent50: MouseEvent;
    let mouseEvent100: MouseEvent;
    // tslint:disable-next-line:prefer-const
    const pathTest: Vec2[] = [
        { x: 10, y: 10 },
        { x: 11, y: 11 },
        { x: 12, y: 12 },
    ];

    let resetTransformSpy: jasmine.Spy<any>;
    let onMouseDownSpy: jasmine.Spy<any>;
    let onMouseUpSpy: jasmine.Spy<any>;
    let onMouseMoveSpy: jasmine.Spy<any>;
    let clearCanvasEllipseSpy: jasmine.Spy<any>;
    let showSelectionSpy: jasmine.Spy<any>;
    let offsetAnchorsSpy: jasmine.Spy<any>;
    let getSquaredSizeSpy: jasmine.Spy<any>;
    let clearPathSpy: jasmine.Spy<any>;
    let createOnMouseMoveEventSpy: jasmine.Spy<any>;
    let checkArrowHitSpy: jasmine.Spy<any>;
    let onArrowDownSpy: jasmine.Spy<any>;
    let getPathSpy: jasmine.Spy<any>;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let ellipseServiceSpy: jasmine.SpyObj<EllipseService>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        ellipseServiceSpy = jasmine.createSpyObj('EllipseService', ['onMouseMove', 'drawEllipse', 'drawPreviewRect', 'onMouseDown']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: EllipseService, useValue: ellipseServiceSpy },
            ],
        });
        service = TestBed.inject(EllipseSelectionService);
        tracingService = TestBed.inject(TracingService);
        colorService = TestBed.inject(ColorService);
        widthService = TestBed.inject(WidthService);

        resetTransformSpy = spyOn<any>(service, 'resetTransform').and.callThrough();
        clearCanvasEllipseSpy = spyOn<any>(service, 'clearCanvasEllipse').and.callThrough();
        showSelectionSpy = spyOn<any>(service, 'showSelection').and.callThrough();
        offsetAnchorsSpy = spyOn<any>(service as any, 'offsetAnchors').and.callThrough();
        getSquaredSizeSpy = spyOn<any>(service as any, 'getSquaredSize').and.callThrough();
        onMouseDownSpy = spyOn<any>(service, 'onMouseDown').and.callThrough();
        onMouseUpSpy = spyOn<any>(service, 'onMouseUp').and.callThrough();
        onMouseMoveSpy = spyOn<any>(service, 'onMouseMove').and.callThrough();
        clearPathSpy = spyOn<any>(service, 'clearPath').and.callThrough();
        getPathSpy = spyOn<any>(service, 'getPath').and.callThrough();
        createOnMouseMoveEventSpy = spyOn<any>(service, 'createOnMouseMoveEvent').and.callThrough();
        checkArrowHitSpy = spyOn<any>(service, 'checkArrowHit').and.callThrough();
        onArrowDownSpy = spyOn<any>(service, 'onArrowDown').and.callThrough();
        const canvasWidth = 1000;
        const canvasHeight = 800;

        (service as any).tracingService = tracingService;
        (service as any).colorService = colorService;
        (service as any).widthService = widthService;
        (service as any).drawingService.baseCtx = baseCtxStub;
        (service as any).drawingService.previewCtx = previewCtxStub;
        (service as any).drawingService.canvas = canvasStub;
        (service as any).drawingService.canvas.width = canvasWidth;
        (service as any).drawingService.canvas.height = canvasHeight;

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

        mouseEvent50 = {
            offsetX: 50,
            offsetY: 50,
            button: 0,
            shiftKey: false,
        } as MouseEvent;
        mouseEvent100 = {
            offsetX: 100,
            offsetY: 100,
            button: 0,
            shiftKey: false,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be call resetTransform on mouse down,set attribute correctly and create a selection', () => {
        service.onMouseDown(mouseEvent25);
        expect((service as any).arrowPress).toEqual([false, false, false, false]);
        expect((service as any).arrowDown).toBe(false);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect((service as any).mouseDownCoord).toEqual(service.getPositionFromMouse(mouseEvent25));
        expect((service as any).mouseDown).toBeTrue();
        expect(resetTransformSpy).toHaveBeenCalled();
        expect((service as any).firstEllipseCoord).toEqual(service.getPositionFromMouse(mouseEvent25));
        expect((service as any).startDownCoord).toEqual(service.getPositionFromMouse(mouseEvent25));
        expect(onMouseDownSpy).toHaveBeenCalled();
    });

    it('should set attribute correctly and translate a selection on mouse down if selection created and hit selection', () => {
        (service as any).selectionCreated = true;
        (service as any).startDownCoord = { x: 0, y: 0 };
        (service as any).imageData = { width: 100, height: 100 };
        (service as any).pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        (service as any).mouseDown = true;
        service.firstEllipseCoord = { x: 0, y: 20 };

        service.onMouseDown(mouseEvent50);
        expect((service as any).pathData).toContain(service.pathLastCoord);
        expect(clearCanvasEllipseSpy).toHaveBeenCalled();
        expect((service as any).draggingImage).toBeTrue();
    });
    it('should set attribute correctly and translate a selection on mouse down for first translation', () => {
        (service as any).selectionCreated = true;
        (service as any).startDownCoord = { x: 0, y: 0 };
        (service as any).imageData = { width: 100, height: 100 };
        (service as any).pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        (service as any).mouseDown = true;
        (service as any).hasDoneFirstTranslation = true;
        service.firstEllipseCoord = { x: 0, y: 20 };

        service.onMouseDown(mouseEvent50);
        expect(clearCanvasEllipseSpy).toHaveBeenCalled();
        expect(showSelectionSpy).toHaveBeenCalled();
        expect((service as any).draggingImage).toBeTrue();
    });

    it('should set attribute and translate a selection on mouse move if mouseDown and draggingImage are true on mouse move', () => {
        (service as any).draggingImage = true;
        (service as any).mouseDown = true;
        service.firstEllipseCoord = { x: 20, y: 20 };
        (service as any).startDownCoord = { x: 0, y: 0 };
        (service as any).imageData = { width: 10, height: 10 };

        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseMove(mouseEvent100);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(offsetAnchorsSpy).toHaveBeenCalled();
        expect(showSelectionSpy).toHaveBeenCalled();
        expect((service as any).startDownCoord).toEqual((service as any).evenImageStartCoord(service.getPositionFromMouse(mouseEvent100)));
        expect(service.pathLastCoord).toEqual({
            x: 105,
            y: 105,
        });
    });
    it('should set attribute and on creation of selection when on mouse move if mouseDown is true and draggingImage is false on mouse move', () => {
        (service as any).draggingImage = false;
        (service as any).mouseDown = true;
        service.firstEllipseCoord = { x: 0, y: 0 };
        (service as any).startDownCoord = { x: 0, y: 0 };
        (service as any).imageData = { width: 10, height: 10 };
        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseMove(mouseEvent100);
        expect(ellipseServiceSpy.onMouseMove).toHaveBeenCalled();
        expect((service as any).pathData).toContain(service.getPositionFromMouse(mouseEvent100));
    });

    it('should  NOT  go in any if in the isInCanvas else if', () => {
        (service as any).draggingImage = false;
        (service as any).mouseDown = true;
        service.firstEllipseCoord = { x: 0, y: 0 };
        (service as any).startDownCoord = { x: 100, y: 100 };
        (service as any).imageData = { width: 10, height: 10 };
        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseMove(mouseEvent100);
        expect(ellipseServiceSpy.onMouseMove).toHaveBeenCalled();
        expect((service as any).pathData).toContain(service.getPositionFromMouse(mouseEvent100));
    });

    it('should do nothing when mouseEvent is not in canvas on mouse move', () => {
        (service as any).draggingImage = false;
        (service as any).mouseDown = true;
        service.firstEllipseCoord = { x: 20, y: 0 };
        (service as any).startDownCoord = { x: 0, y: 0 };
        (service as any).imageData = { width: 10, height: 10 };
        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;

        service.onMouseMove(mouseEventNotInCanvas);
        expect(ellipseServiceSpy.onMouseMove).not.toHaveBeenCalled();
        expect((service as any).pathData).not.toContain(service.getPositionFromMouse(mouseEventNotInCanvas));
    });

    it('should set attribute and getSquaredSize is called when shiftDown is set to true on mouse move', () => {
        (service as any).draggingImage = false;
        (service as any).mouseDown = true;
        (service as any).ellipseService.shiftDown = true;
        service.firstEllipseCoord = { x: 0, y: 20 };
        (service as any).startDownCoord = { x: 0, y: 0 };
        (service as any).imageData = { width: 10, height: 10 };

        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseMove(mouseEvent100);
        expect(getSquaredSizeSpy).toHaveBeenCalled();
    });
    it('should set attribute and translate a selection on mouse up', () => {
        (service as any).draggingImage = true;
        (service as any).mouseDown = true;
        (service as any).startSelectionPoint = { x: 14, y: 14 };
        service.firstEllipseCoord = { x: 0, y: 20 };
        (service as any).startDownCoord = { x: 14, y: 14 };
        service.mouseDownCoord = { x: 1, y: 1 };
        (service as any).imageData = { width: 10, height: 10 };

        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseUp(mouseEvent100);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect((service as any).ellipseService.mouseDownCoord).toEqual((service as any).startDownCoord);
        expect(showSelectionSpy).toHaveBeenCalled();
    });

    it('should set attribute and create a creation on mouse up', () => {
        (service as any).draggingImage = false;
        (service as any).mouseDown = true;
        (service as any).ellipseService.shiftDown = true;
        service.firstEllipseCoord = { x: 0, y: 20 };
        (service as any).startDownCoord = { x: 14, y: 14 };
        service.mouseDownCoord = { x: 1, y: 1 };
        (service as any).imageData = { width: 10, height: 10 };

        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseUp(mouseEvent100);
        expect(getSquaredSizeSpy).toHaveBeenCalled();
        expect(offsetAnchorsSpy).toHaveBeenCalled();
        expect((service as any).selectionCreated).toBeTrue();
        expect((service as any).hasDoneFirstTranslation).toBeFalse();
        expect(showSelectionSpy).toHaveBeenCalled();
        expect(clearPathSpy).toHaveBeenCalled();
    });

    it('should set attribute and create a creation on mouse up', () => {
        (service as any).draggingImage = false;
        (service as any).mouseDown = true;
        (service as any).ellipseService.shiftDown = false;
        service.firstEllipseCoord = { x: 0, y: 20 };
        (service as any).startDownCoord = { x: 14, y: 14 };
        service.mouseDownCoord = { x: 1, y: 1 };
        (service as any).imageData = { width: 10, height: 10 };

        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseUp(mouseEvent100);
        expect(getSquaredSizeSpy).not.toHaveBeenCalled();
        expect(offsetAnchorsSpy).toHaveBeenCalled();
        expect((service as any).selectionCreated).toBeTrue();
        expect((service as any).hasDoneFirstTranslation).toBeFalse();
        expect(showSelectionSpy).toHaveBeenCalled();
        expect(clearPathSpy).toHaveBeenCalled();
    });

    it('should set attribute and create a creation on mouse up', () => {
        (service as any).draggingImage = false;
        (service as any).mouseDown = false;
        (service as any).ellipseService.shiftDown = false;
        service.firstEllipseCoord = { x: 0, y: 20 };
        (service as any).startDownCoord = { x: 14, y: 14 };
        service.mouseDownCoord = { x: 1, y: 1 };
        (service as any).imageData = { width: 10, height: 10 };

        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseUp(mouseEvent100);
        expect((service as any).mouseDown).toBeFalse();
        expect(clearPathSpy).toHaveBeenCalled();
    });

    it('should on shiftDown', () => {
        const keyboardEvent = {} as KeyboardEvent;
        service.onShiftDown(keyboardEvent);
        expect((service as any).ellipseService.shiftDown).toBeTrue();
        expect(createOnMouseMoveEventSpy).toHaveBeenCalled();
    });

    it('should on onShiftUp', () => {
        const keyboardEvent = {} as KeyboardEvent;
        service.onShiftUp(keyboardEvent);
        expect((service as any).ellipseService.shiftDown).toBeFalse();
        expect(createOnMouseMoveEventSpy).toHaveBeenCalled();
    });
    it('should enter if in onArrowDown', () => {
        const keyboardEvent = {} as KeyboardEvent;
        (service as any).startDownCoord = { x: 14, y: 14 };
        (service as any).pathLastCoord = { x: 10, y: 10 };
        (service as any).imageData = { width: 10, height: 10 };
        (service as any).selectionCreated = true;
        (service as any).arrowDown = false;
        (service as any).ellipseService.pathData = pathTest;
        (service as any).arrowPress = [true, false, false, false];
        service.firstEllipseCoord = { x: 0, y: 20 };
        service.onArrowDown(keyboardEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(showSelectionSpy).toHaveBeenCalled(); 
    });

    it('should NOT enter any if in onArrowDown', () => {
        const keyboardEvent = {} as KeyboardEvent;
        (service as any).startDownCoord = { x: 14, y: 14 };
        (service as any).pathLastCoord = { x: 10, y: 10 };
        (service as any).imageData = { width: 10, height: 10 };
        (service as any).selectionCreated = false;
        (service as any).arrowDown = true;
        (service as any).ellipseService.pathData = pathTest;
        (service as any).arrowPress = [true, false, false, false];
        service.firstEllipseCoord = { x: 0, y: 20 };

        service.onArrowDown(keyboardEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(showSelectionSpy).not.toHaveBeenCalled();
    });

    it('should onArrowDown with hasDoneFirstTranslation', () => {
        (service as any).arrowDown = false;
        const keyboardEvent = {} as KeyboardEvent;
        (service as any).hasDoneFirstTranslation = true;
        (service as any).startDownCoord = { x: 14, y: 14 };
        (service as any).pathLastCoord = { x: 10, y: 10 };
        (service as any).arrowPress = [true, false, false, false];
        (service as any).imageData = { width: 10, height: 10 };
        (service as any).selectionCreated = true;
        (service as any).draggingImage = true;
        (service as any).mouseDown = true;
        service.firstEllipseCoord = { x: 0, y: 20 };
        service.mouseDownCoord = { x: 1, y: 1 };
        (service as any).pathData = pathTest;

        service.onArrowDown(keyboardEvent);
        expect((service as any).arrowCoord).toEqual({ x: 24, y: 24 });
        expect((service as any).ellipseService.mouseDownCoord).toEqual({ x: 14, y: 14 });
        expect(checkArrowHitSpy).toHaveBeenCalled();
        expect(showSelectionSpy).toHaveBeenCalled();
    });

    it('should onArrowDown WITHOUT hasDoneFirstTranslation', () => {
        (service as any).arrowDown = false;
        const keyboardEvent = {} as KeyboardEvent;
        (service as any).hasDoneFirstTranslation = false;
        (service as any).startDownCoord = { x: 14, y: 14 };
        (service as any).pathLastCoord = { x: 10, y: 10 };
        (service as any).arrowPress = [true, false, false, false];
        (service as any).imageData = { width: 10, height: 10 };
        (service as any).selectionCreated = true;
        (service as any).draggingImage = true;
        (service as any).mouseDown = true;
        service.firstEllipseCoord = { x: 0, y: 20 };
        service.mouseDownCoord = { x: 1, y: 1 };
        (service as any).pathData = pathTest;

        service.onArrowDown(keyboardEvent);
        expect((service as any).arrowCoord).toEqual({ x: 24, y: 24 });
        expect((service as any).ellipseService.mouseDownCoord).toEqual({ x: 14, y: 14 });
        expect(clearCanvasEllipseSpy).toHaveBeenCalled();
        expect(checkArrowHitSpy).toHaveBeenCalled();
    });

    it('onArrowUp should enter if arrowPress = false', () => {
        const keyboardEvent = {} as KeyboardEvent;
        (service as any).startDownCoord = { x: 14, y: 14 };
        (service as any).startSelectionPoint = { x: 14, y: 14 };
        (service as any).pathLastCoord = { x: 10, y: 10 };
        (service as any).arrowPress = [false, false, false, false];
        (service as any).imageData = { width: 10, height: 10 };
        (service as any).selectionCreated = true;
        (service as any).mouseDown = true;
        service.firstEllipseCoord = { x: 0, y: 20 };
        service.mouseDownCoord = { x: 1, y: 1 };
        (service as any).pathData = pathTest;
        service.onArrowUp(keyboardEvent);

        expect((service as any).arrowDown).toBeFalse();
        expect(clearPathSpy).toHaveBeenCalled();
        expect((service as any).ellipseService.mouseDownCoord).toEqual((service as any).startDownCoord);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect((service as any).draggingImage).toBeFalse();
    });

    it('onArrowUp should NOT enter if arrowPress = false', () => {
        const keyboardEvent = {} as KeyboardEvent;
        (service as any).startDownCoord = { x: 14, y: 14 };
        (service as any).pathLastCoord = { x: 10, y: 10 };
        (service as any).arrowPress = [true, true, true, true];
        (service as any).imageData = { width: 10, height: 10 };
        (service as any).selectionCreated = true;
        (service as any).mouseDown = true;
        service.firstEllipseCoord = { x: 0, y: 20 };
        service.mouseDownCoord = { x: 1, y: 1 };
        (service as any).pathData = pathTest;
        (service as any).arrowDown = true;

        service.onArrowUp(keyboardEvent);
        expect(onArrowDownSpy).toHaveBeenCalled();
    });
    it('should on arrowUp', () => {
        (service as any).selectionCreated = false;
        const keyboardEvent = {} as KeyboardEvent;
        service.onArrowUp(keyboardEvent);
        expect(onArrowDownSpy).not.toHaveBeenCalled();
    });

    it('onCtrlADown should assign values correctly', () => {
        service.onCtrlADown();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(resetTransformSpy).toHaveBeenCalled();
        expect((service as any).mouseDown).toBeFalse();
        expect((service as any).startDownCoord).toEqual({ x: 0, y: 0 });
        expect((service as any).firstEllipseCoord).toEqual({ x: 0, y: 0 });
        expect((service as any).ellipseService.mouseDownCoord).toEqual({ x: 0, y: 0 });

        expect(onMouseUpSpy).toHaveBeenCalled();
    });

    it('should on call on mouse move event if mouseDown is set to true for createOnMouseMoveEvent', () => {
        service.mouseDown = true;
        (service as any).startDownCoord = { x: 14, y: 14 };
        (service as any).ellipseService.shiftDown = true;
        (service as any).pathData = pathTest;
        (service as any).createOnMouseMoveEvent();
        expect(onMouseMoveSpy).toHaveBeenCalled();
    });
    it('should not call on mouse move event if mouseDown is set to false for createOnMouseMoveEvent', () => {
        service.mouseDown = false;
        (service as any).pathData = pathTest;

        (service as any).createOnMouseMoveEvent();
        expect(onMouseMoveSpy).not.toHaveBeenCalled();
    });

    it('should set correctly after resetTransform', () => {
        (service as any).resetTransform();
        expect(widthService.getWidth()).toEqual(1);
        expect(colorService.getPrimaryColor()).toEqual('#000000');
        expect(colorService.getSecondaryColor()).toEqual('#000000');
        expect(tracingService.getHasFill()).toEqual(false);
        expect(tracingService.getHasContour()).toEqual(true);
    });

    it('should correctly call getPath after showSelection is called', () => {
        (service as any).startDownCoord = { x: 14, y: 14 };
        (service as any).pathLastCoord = { x: 10, y: 10 };
        (service as any).imageData = { width: 10, height: 10 };
        (service as any).mouseDown = true;
        service.firstEllipseCoord = { x: 0, y: 20 };
        const size: Vec2 = { x: (service as any).imageData.width, y: (service as any).imageData.height };
        (service as any).showSelection(previewCtxStub, (service as any).image, size, (service as any).startDownCoord, 0);
        expect(getPathSpy).toHaveBeenCalled();
    });

    it('should return ellipsePath and not null after getPath is called', () => {
        (service as any).startDownCoord = { x: 14, y: 14 };
        (service as any).pathLastCoord = { x: 10, y: 10 };
        (service as any).imageData = { width: 10, height: 10 };
        (service as any).mouseDown = true;
        service.firstEllipseCoord = { x: 0, y: 20 };
        expect((service as any).getPath(0)).not.toBeNull();
    });
    it('should clear canvas with a white ellipse after clearCanvasEllipse', () => {
        (service as any).clearCanvasEllipse();
        expect(ellipseServiceSpy.drawEllipse).toHaveBeenCalled();
        expect((service as any).colorService.getPrimaryColor()).toEqual('#000000');
        expect((service as any).tracingService.getHasFill()).toBeFalse();
        expect((service as any).tracingService.getHasContour()).toBeTrue();
        expect(resetTransformSpy).toHaveBeenCalled();
    });
});
