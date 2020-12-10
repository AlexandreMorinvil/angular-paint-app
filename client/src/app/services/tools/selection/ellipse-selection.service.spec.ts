import { TestBed } from '@angular/core/testing';
import { InteractionSelectionEllipse } from '@app/classes/action/interaction-selection-ellipse';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { EllipseSelectionService } from './ellipse-selection.service';
// Illogical to seperate test in different file for the same service
// tslint:disable:max-file-line-count
// tslint:disable:no-any
describe('EllipseSelectionService', () => {
    let service: EllipseSelectionService;
    let tracingService: TracingService;
    let colorService: ColorService;
    let widthService: WidthService;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectionCtxStub: CanvasRenderingContext2D;
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
    let showSelectionSpy: jasmine.Spy<any>;
    let offsetAnchorsSpy: jasmine.Spy<any>;
    let getSquaredSizeSpy: jasmine.Spy<any>;
    let clearPathSpy: jasmine.Spy<any>;
    let createOnMouseMoveEventSpy: jasmine.Spy<any>;
    let onArrowDownSpy: jasmine.Spy<any>;
    let getPathSpy: jasmine.Spy<any>;
    let executeSpy: jasmine.Spy<any>;
    let onEscapeDownSpy: jasmine.Spy<any>;
    let getAnchorHitSpy: jasmine.Spy<any>;
    let drawSelectionSurroundSpy: jasmine.Spy<any>;
    let resetCanvasRotationSpy: jasmine.Spy<any>;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let ellipseServiceSpy: jasmine.SpyObj<EllipseService>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        selectionCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
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
        showSelectionSpy = spyOn<any>(service, 'showSelection').and.callThrough();
        offsetAnchorsSpy = spyOn<any>(service as any, 'offsetAnchors').and.callThrough();
        getSquaredSizeSpy = spyOn<any>(service as any, 'getSquaredSize').and.callThrough();
        onMouseDownSpy = spyOn<any>(service, 'onMouseDown').and.callThrough();
        onMouseUpSpy = spyOn<any>(service, 'onMouseUp').and.callThrough();
        clearPathSpy = spyOn<any>(service, 'clearPath').and.callThrough();
        getPathSpy = spyOn<any>(service, 'getPath').and.callThrough();
        createOnMouseMoveEventSpy = spyOn<any>(service, 'createOnMouseMoveEvent').and.callThrough();
        onArrowDownSpy = spyOn<any>(service, 'onArrowDown').and.callThrough();
        executeSpy = spyOn<any>(service, 'execute').and.callThrough();
        resetCanvasRotationSpy = spyOn<any>(service, 'resetCanvasRotation').and.callThrough();
        onEscapeDownSpy = spyOn<any>(service, 'onEscapeDown').and.callThrough();
        getAnchorHitSpy = spyOn<any>(service, 'getAnchorHit').and.callThrough();
        drawSelectionSurroundSpy = spyOn<any>(service, 'drawSelectionSurround').and.callThrough();
        const canvasWidth = 1000;
        const canvasHeight = 800;

        (service as any).tracingService = tracingService;
        (service as any).colorService = colorService;
        (service as any).widthService = widthService;
        (service as any).drawingService.baseCtx = baseCtxStub;
        (service as any).drawingService.previewCtx = previewCtxStub;
        (service as any).drawingService.selectionCtx = selectionCtxStub;
        (service as any).drawingService.canvas = canvasStub;
        (service as any).drawingService.canvas.width = canvasWidth;
        (service as any).drawingService.canvas.height = canvasHeight;

        (service as any).selectionCreated = false;
        (service as any).draggingImage = false;
        (service as any).mouseDown = false;
        (service as any).localMouseDown = false;
        (service as any).hasDoneFirstTranslation = false;
        (service as any).startDownCoord = { x: 0, y: 0 };
        (service as any).pathLastCoord = { x: 1, y: 1 };
        // Magic numbers are for testing purposes only
        // tslint:disable:no-magic-numbers
        (service as any).imageData = new ImageData(2, 2);
        (service as any).oldImageData = new ImageData(3, 3);
        (service as any).pathData = pathTest;
        (service as any).selectionSize = { x: 2, y: 2 };
        (service as any).firstSelectionCoord = { x: 0, y: 0 };
        (service as any).mouseDownCoord = { x: 0, y: 0 };
        (service as any).startSelectionPoint = { x: 0, y: 0 };

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
        (service as any).selectionCreated = false;

        (service as any).mouseDown = true;

        service.onMouseDown(mouseEvent25);

        expect((service as any).arrowPress).toEqual([false, false, false, false]);
        expect((service as any).arrowDown).toBe(false);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect((service as any).mouseDownCoord).toEqual(service.getPositionFromMouse(mouseEvent25));
        expect((service as any).mouseDown).toBeTrue();
        expect(resetTransformSpy).toHaveBeenCalled();
        expect(onMouseDownSpy).toHaveBeenCalled();
    });

    it('should set attribute correctly and translate a selection on mouse down if selection created and hit selection', () => {
        (service as any).selectionCreated = true;
        (service as any).selectionSize = { x: 100, y: 100 };
        (service as any).mouseDown = true;

        service.onMouseDown(mouseEvent25);
        expect((service as any).pathLastCoord).toEqual((service as any).getBottomRightCorner());
        expect((service as any).draggingImage).toBeTrue();
        expect(resetCanvasRotationSpy).toHaveBeenCalled();
    });

    it('should set attribute correctly and resize a selection on mouse down if selection created and first translation', () => {
        (service as any).selectionCreated = true;
        (service as any).selectionSize = { x: 100, y: 100 };
        (service as any).mouseDown = true;

        service.onMouseDown(mouseEvent25);
        service.onMouseMove(mouseEvent50);
        service.onMouseUp(mouseEvent50);

        service.onMouseDown(mouseEvent25);

        expect(resetCanvasRotationSpy).toHaveBeenCalled();
    });

    it('should set attribute correctly and translate a selection on mouse down for when selectionCreated and selection is hit', () => {
        (service as any).selectionCreated = true;
        (service as any).selectionSize = { x: 100, y: 100 };
        (service as any).imageData = { width: 100, height: 100 };
        (service as any).mouseDown = true;
        (service as any).hasDoneFirstTranslation = true;

        service.onMouseDown(mouseEvent50);
        expect(showSelectionSpy).toHaveBeenCalled();
        expect((service as any).draggingImage).toBeTrue();
    });

    it('should call onEscapeDown when on mouseDown is called', () => {
        (service as any).selectionCreated = false;
        (service as any).pathData = pathTest;
        (service as any).mouseDown = false;

        service.onMouseDown(mouseEvent50);
        expect(onEscapeDownSpy).toHaveBeenCalled();
    });

    it('should set attribute and translate a selection on mouse move if mouseDown and draggingImage are true on mouse move', () => {
        (service as any).draggingImage = true;
        (service as any).mouseDown = true;
        (service as any).localMouseDown = true;
        (service as any).selectionSize = { x: 10, y: 10 };
        service.onMouseMove(mouseEvent100);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(resetCanvasRotationSpy).toHaveBeenCalled();
        expect(showSelectionSpy).toHaveBeenCalled();
        expect((service as any).startDownCoord).toEqual((service as any).evenImageStartCoord(service.getPositionFromMouse(mouseEvent100)));
    });
    it('should set attribute and on creation of selection when on mouse move if mouseDown is true and draggingImage is false on mouse move', () => {
        (service as any).draggingImage = false;
        (service as any).mouseDown = true;
        (service as any).localMouseDown = true;
        (service as any).selectionSize = { x: 10, y: 10 };
        service.onMouseMove(mouseEvent100);
        expect(ellipseServiceSpy.onMouseMove).toHaveBeenCalled();
        expect((service as any).selectionSize).toEqual(service.getPositionFromMouse(mouseEvent100));
    });

    it('should  NOT  go in any if in the isInCanvas else if', () => {
        (service as any).draggingImage = false;
        (service as any).mouseDown = true;
        (service as any).localMouseDown = true;
        (service as any).startDownCoord = { x: 100, y: 100 };
        (service as any).selectionSize = { x: 10, y: 10 };
        service.onMouseMove(mouseEvent100);
        expect(ellipseServiceSpy.onMouseMove).toHaveBeenCalled();
        expect((service as any).selectionSize).toEqual({ x: 10, y: 10 });
    });

    it('should do nothing when mouseEvent is not in canvas on mouse move', () => {
        (service as any).draggingImage = false;
        (service as any).mouseDown = true;
        (service as any).localMouseDown = true;

        service.onMouseMove(mouseEventNotInCanvas);
        expect(ellipseServiceSpy.onMouseMove).not.toHaveBeenCalled();
        expect((service as any).pathData).not.toContain(service.getPositionFromMouse(mouseEventNotInCanvas));
    });

    it('should clear canvas and getAnchorHit called when we clicked on anchor and localMouseDown is set to true on mouse move', () => {
        (service as any).draggingImage = false;
        (service as any).mouseDown = true;
        (service as any).localMouseDown = true;
        (service as any).shiftDown = true;
        (service as any).clickOnAnchor = true;
        service.onMouseMove(mouseEvent100);
        expect(getAnchorHitSpy).toHaveBeenCalled();
    });
    it('should set attribute and translate a selection on mouse up', () => {
        (service as any).draggingImage = true;
        (service as any).mouseDown = true;
        (service as any).localMouseDown = true;
        service.onMouseUp(mouseEvent25);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(showSelectionSpy).toHaveBeenCalled();
        expect(resetCanvasRotationSpy).toHaveBeenCalled();
        expect(drawSelectionSurroundSpy).toHaveBeenCalled();

        expect((service as any).draggingImage).toBeFalse();
        expect((service as any).hasDoneFirstTranslation).toBeTrue();
    });
    it('should set attribute and translate a selection on mouse up and make sure goes inside all branches in addActionTracking', () => {
        (service as any).draggingImage = true;
        (service as any).mouseDown = true;
        (service as any).localMouseDown = true;
        service.onMouseUp(mouseEvent100);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(showSelectionSpy).toHaveBeenCalled();
    });

    it('should set attribute and create a creation on mouse up', () => {
        (service as any).draggingImage = false;
        (service as any).mouseDown = true;
        (service as any).localMouseDown = true;
        (service as any).shiftDown = true;
        service.onMouseDown(mouseEvent25);
        service.onMouseMove(mouseEvent50);
        service.onMouseUp(mouseEvent50);

        service.onMouseDown(mouseEvent25);
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
        (service as any).localMouseDown = true;
        (service as any).shiftDown = false;
        service.onMouseDown(mouseEvent25);
        service.onMouseMove(mouseEvent50);
        service.onMouseUp(mouseEvent50);

        service.onMouseDown(mouseEvent25);
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
        (service as any).localMouseDown = false;
        (service as any).shiftDown = false;
        service.onMouseDown(mouseEvent25);
        service.onMouseMove(mouseEvent50);
        service.onMouseUp(mouseEvent50);

        service.onMouseDown(mouseEvent25);
        expect((service as any).mouseDown).toBeTrue();
        expect(clearPathSpy).toHaveBeenCalled();
    });

    it('should set attribute and resize selection when clicking on anchor on mouse up', () => {
        (service as any).clickOnAnchor = true;
        (service as any).draggingImage = false;
        (service as any).mouseDown = false;
        (service as any).localMouseDown = false;
        (service as any).shiftDown = false;
        (service as any).resizeStartCoords = { x: 25, y: 25 };
        (service as any).resizeWidth = 0;
        (service as any).resizeHeight = 0;

        service.onMouseDown(mouseEvent25);
        service.onMouseMove(mouseEvent50);
        service.onMouseUp(mouseEvent50);

        expect((service as any).mouseDown).toBeTrue();
        expect(clearPathSpy).toHaveBeenCalled();
        expect(getAnchorHitSpy).toHaveBeenCalled();
        expect((service as any).clickOnAnchor).toBeFalse();
        expect((service as any).hasDoneResizing).toBeTrue();
    });

    it('should set attribute for selection when on mouse up', () => {
        (service as any).clickOnAnchor = false;
        (service as any).draggingImage = false;
        (service as any).mouseDown = false;
        (service as any).localMouseDown = false;
        (service as any).shiftDown = false;
        service.onMouseUp(mouseEvent50);
        expect((service as any).mouseDown).toBeFalse();
        expect(clearPathSpy).toHaveBeenCalled();
    });

    it('should on set attribute shiftDown to true on shiftDown', () => {
        const keyboardEvent = {} as KeyboardEvent;
        (service as any).clickOnAnchor = true;

        service.onShiftDown(keyboardEvent);
        expect((service as any).shiftDown).toBeTrue();
    });
    it('should on shiftDown with clickOnAnchor set to true and localMouseDown is also set to true', () => {
        const keyboardEvent = {} as KeyboardEvent;
        (service as any).clickOnAnchor = false;
        (service as any).localMouseDown = true;
        service.onShiftDown(keyboardEvent);
        expect(createOnMouseMoveEventSpy).toHaveBeenCalled();
    });
    it('should on shiftDown with clickOnAnchor set to true and localMouseDown is also set to false', () => {
        const keyboardEvent = {} as KeyboardEvent;
        (service as any).clickOnAnchor = false;
        (service as any).localMouseDown = false;
        service.onShiftDown(keyboardEvent);
        expect(createOnMouseMoveEventSpy).not.toHaveBeenCalled();
    });
    it('should on shiftDown and when ctrl is pressed', () => {
        const keyboardEvent = { ctrlKey: true } as KeyboardEvent;
        (service as any).clickOnAnchor = true;
        service.onShiftDown(keyboardEvent);
        expect(createOnMouseMoveEventSpy).not.toHaveBeenCalled();
    });
    it('should on shiftUp', () => {
        const keyboardEvent = {} as KeyboardEvent;
        (service as any).clickOnAnchor = true;
        service.onShiftUp(keyboardEvent);
        expect((service as any).shiftDown).toBeFalse();
    });
    it('should on shiftUp with clickOnAnchor set to true and localMouseDown is also set to true', () => {
        const keyboardEvent = {} as KeyboardEvent;
        (service as any).clickOnAnchor = false;
        (service as any).localMouseDown = true;
        service.onShiftUp(keyboardEvent);
        expect(createOnMouseMoveEventSpy).toHaveBeenCalled();
    });
    it('should on shiftUp with clickOnAnchor set to true and localMouseDown is also set to false', () => {
        const keyboardEvent = {} as KeyboardEvent;
        (service as any).clickOnAnchor = false;
        (service as any).localMouseDown = false;
        service.onShiftUp(keyboardEvent);
        expect(createOnMouseMoveEventSpy).not.toHaveBeenCalled();
    });
    it('should on shiftUp and when ctrl is pressed', () => {
        const keyboardEvent = { ctrlKey: true } as KeyboardEvent;
        (service as any).clickOnAnchor = true;
        service.onShiftUp(keyboardEvent);
        expect(createOnMouseMoveEventSpy).not.toHaveBeenCalled();
    });
    it('should enter if in onArrowDown is false', () => {
        const keyboardEvent = {} as KeyboardEvent;

        (service as any).selectionCreated = true;
        (service as any).arrowDown = false;
        (service as any).arrowPress = [true, false, false, false];
        service.onArrowDown(keyboardEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(showSelectionSpy).toHaveBeenCalled();
    });
    it('should NOT enter any if in onArrowDown is true', () => {
        const keyboardEvent = {} as KeyboardEvent;

        (service as any).selectionCreated = false;
        (service as any).arrowDown = true;
        (service as any).arrowPress = [true, false, false, false];
        service.onArrowDown(keyboardEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(showSelectionSpy).not.toHaveBeenCalled();
    });

    it('onArrowUp should enter if all arrow press are true', () => {
        const keyboardEvent = {} as KeyboardEvent;
        (service as any).arrowPress = [false, false, false, false];
        (service as any).selectionCreated = true;
        (service as any).mouseDown = true;
        (service as any).localMouseDown = true;
        service.onArrowUp(keyboardEvent);

        expect((service as any).arrowDown).toBeFalse();
        expect(clearPathSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect((service as any).draggingImage).toBeFalse();
    });

    it('onArrowUp should NOT enter if all arrowPress are set to true', () => {
        const keyboardEvent = {} as KeyboardEvent;
        (service as any).arrowPress = [true, true, true, true];
        (service as any).selectionCreated = false;
        (service as any).mouseDown = true;
        (service as any).localMouseDown = true;
        (service as any).arrowDown = true;

        service.onArrowUp(keyboardEvent);
        expect(onArrowDownSpy).not.toHaveBeenCalled();
    });
    it('should on arrowUp NOT enter if all arrowPress are set to true', () => {
        const keyboardEvent = {} as KeyboardEvent;
        (service as any).arrowPress = [true, true, true, true];
        (service as any).selectionCreated = true;
        (service as any).mouseDown = true;
        (service as any).localMouseDown = true;
        (service as any).arrowDown = true;

        service.onArrowUp(keyboardEvent);
        expect(onArrowDownSpy).toHaveBeenCalled();
    });

    it('onCtrlADown should assign values correctly', () => {
        service.onMouseDown(mouseEvent25);
        service.onMouseMove(mouseEvent50);
        service.onMouseUp(mouseEvent50);
        service.onCtrlADown();

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(resetTransformSpy).toHaveBeenCalled();
        expect((service as any).mouseDown).toBeTrue();
        expect((service as any).startDownCoord).toEqual({ x: 0, y: 0 });
        expect((service as any).ellipseService.mouseDownCoord).toEqual({ x: 0, y: 0 });

        expect(onMouseUpSpy).toHaveBeenCalled();
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
        (service as any).mouseDown = true;
        (service as any).localMouseDown = true;

        const size: Vec2 = { x: (service as any).imageData.width, y: (service as any).imageData.height };
        (service as any).showSelection(previewCtxStub, (service as any).image, size, (service as any).startDownCoord, 0);
        expect(getPathSpy).toHaveBeenCalled();
    });

    it('should return ellipsePath and not null after getPath is called', () => {
        (service as any).mouseDown = true;
        (service as any).localMouseDown = true;
        expect((service as any).getPath(0, (service as any).startDownCoord)).not.toBeNull();
    });

    it('should onEscapeDown clearCanvas and set arrowDown to true', () => {
        (service as any).selectionCreated = true;
        (service as any).mouseDown = true;

        service.onMouseDown(mouseEvent25);
        service.onMouseMove(mouseEvent50);
        service.onMouseUp(mouseEvent50);

        service.onEscapeDown();
        expect((service as any).arrowDown).toBeTrue();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should set arrowDown to true onEscapeDown when selectionCreated is set to false', () => {
        (service as any).selectionCreated = false;
        service.onEscapeDown();
        expect((service as any).arrowDown).toBeTrue();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });
    it('should show selection on drawOnBaseCanvas when selection is already created', () => {
        (service as any).selectionCreated = true;
        (service as any).hasDoneFirstTranslation = true;
        (service as any).mouseDown = true;
        service.drawOnBaseCanvas();
        expect((service as any).selectionCreated).toBeFalse();
    });
    it('should show rotate canvas on drawOnBaseCanvas when selection is already created and has done first rotation', () => {
        (service as any).selectionCreated = true;
        (service as any).hasDoneFirstTranslation = true;
        (service as any).hasDoneFirstRotation = true;
        (service as any).mouseDown = true;
        service.drawOnBaseCanvas();
        expect((service as any).selectionCreated).toBeFalse();
    });
    it('should NOT show selection on drawOnBaseCanvas when selection is already created and has done first rotation', () => {
        (service as any).selectionCreated = false;
        (service as any).hasDoneFirstTranslation = true;
        (service as any).hasDoneFirstRotation = true;
        (service as any).mouseDown = true;
        service.drawOnBaseCanvas();
        expect((service as any).selectionCreated).toBeFalse();
    });

    it('should onMouseWheel rotate correctly the canvas', () => {
        (service as any).selectionCreated = true;
        (service as any).mouseDown = true;

        const wheelEvent = {
            deltaY: 100,
        } as WheelEvent;

        service.onMouseDown(mouseEvent25);
        service.onMouseMove(mouseEvent50);
        service.onMouseUp(mouseEvent50);

        service.onMouseWheel(wheelEvent);
    });

    it('should onMouseWheel rotate correctly the canvas', () => {
        (service as any).selectionCreated = true;
        (service as any).mouseDown = true;

        const wheelEvent = {
            deltaY: 100,
        } as WheelEvent;

        service.onMouseDown(mouseEvent25);
        service.onMouseMove(mouseEvent50);
        service.onMouseUp(mouseEvent50);
        (service as any).mouseDown = false;
        service.onMouseWheel(wheelEvent);
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
