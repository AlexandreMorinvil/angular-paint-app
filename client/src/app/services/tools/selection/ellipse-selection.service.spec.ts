import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { EllipseSelectionService } from './ellipse-selection.service';

describe('EllipseSelectionService', () => {
    // tslint:disable:no-any
    let service: EllipseSelectionService;
    let tracingService: TracingService;
    let colorService: ColorService;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    // let imageStub: HTMLImageElement;
    // let mouseEvent5: MouseEvent;
    let mouseEvent25: MouseEvent;
    let mouseEvent50: MouseEvent;
    let mouseEvent100: MouseEvent;
    const pathTest: Vec2[] = [
        { x: 10, y: 10 },
        { x: 11, y: 11 },
        { x: 12, y: 12 },
    ];

    let resetTransformSpy: jasmine.Spy<any>;
    let onMouseDownSpy: jasmine.Spy<any>;
    let clearCanvasEllipseSpy: jasmine.Spy<any>;
    let showSelectionSpy: jasmine.Spy<any>;
    let offsetAnchorsSpy: jasmine.Spy<any>;

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(EllipseSelectionService);
        tracingService = TestBed.inject(TracingService);
        colorService = TestBed.inject(ColorService);

        resetTransformSpy = spyOn<any>(service, 'resetTransform').and.callThrough();
        clearCanvasEllipseSpy = spyOn<any>(service, 'clearCanvasEllipse').and.callThrough();
        showSelectionSpy = spyOn<any>(service, 'showSelection').and.callThrough();
        offsetAnchorsSpy = spyOn<any>(service as any, 'offsetAnchors').and.callThrough();

        onMouseDownSpy = spyOn<any>(service, 'onMouseDown').and.callThrough();

        const canvasWidth = 1000;
        const canvasHeight = 800;
        // tslint:disable:no-string-literal
        service['tracingService'] = tracingService;
        service['colorService'] = colorService;
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;
        service['drawingService'].canvas.width = canvasWidth;
        service['drawingService'].canvas.height = canvasHeight;
        service['tracingService'] = tracingService;

        /* mouseEvent5 = {
            offsetX: 5,
            offsetY: 5,
            button: 0,
            shiftKey: false,
        } as MouseEvent; */

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

    /*  fit('should set attribute correctly and create a selection on mouse down', () => {
        (service as any).selectionCreated = false;
        (service as any).firstTranslation = false;
        (service as any).startDownCoord = { x: 0, y: 0 };
        (service as any).imageData = { width: 100, height: 100 };

        service.pathLastCoord = { x: 100, y: 100 };
        service.onMouseDown(mouseEvent50);
    }); */

    // Need help with this test
    it('should set attribute correctly and translate a selection on mouse down if selection created and hit selection', () => {
        (service as any).selectionCreated = true;
        (service as any).startDownCoord = { x: 0, y: 0 };
        (service as any).imageData = { width: 100, height: 100 };
        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseDown(mouseEvent50);
        expect((service as any).pathData).toContain(service.pathLastCoord);
        expect(clearCanvasEllipseSpy).toHaveBeenCalled();
        expect((service as any).draggingImage).toBeTrue();
    });
    // Need help with this test
    it('should set attribute correctly and translate a selection on mouse down for first translation', () => {
        (service as any).selectionCreated = true;
        (service as any).hasDoneFirstTranslation = true;
        (service as any).startDownCoord = { x: 0, y: 0 };
        (service as any).imageData = { width: 100, height: 100 };
        service.mouseDown = true;
        service.mouseDownCoord = { x: 10, y: 10 };
        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseDown(mouseEvent50);
        expect(clearCanvasEllipseSpy).toHaveBeenCalled();
        expect(showSelectionSpy).toHaveBeenCalled();
        expect((service as any).draggingImage).toBeTrue();
    });

    fit('should set attribute and translate a selection on mouse move if mouseDown and draggingImage are true', () => {
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

    it('should set attribute and translate a selection', () => {
        (service as any).draggingImage = true;
        (service as any).mouseDown = true;
        service.firstEllipseCoord = { x: 0, y: 0 };
        (service as any).startDownCoord = { x: 0, y: 0 };
        (service as any).imageData = { width: 10, height: 10 };

        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseMove(mouseEvent100);
    });
    it('should set attribute and translate a selection', () => {
        (service as any).draggingImage = true;
        (service as any).mouseDown = true;
        service.firstEllipseCoord = { x: 20, y: 0 };
        (service as any).startDownCoord = { x: 0, y: 0 };
        (service as any).imageData = { width: 10, height: 10 };

        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseMove(mouseEvent100);
    });
    it('should set attribute and translate a selection', () => {
        (service as any).draggingImage = true;
        (service as any).mouseDown = true;
        service.firstEllipseCoord = { x: 0, y: 20 };
        (service as any).startDownCoord = { x: 0, y: 0 };
        (service as any).imageData = { width: 10, height: 10 };

        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseMove(mouseEvent100);
    });

    it('should set attribute and create a selection', () => {
        (service as any).draggingImage = false;
        (service as any).mouseDown = true;
        service.firstEllipseCoord = { x: 0, y: 20 };
        (service as any).startDownCoord = { x: 0, y: 0 };
        (service as any).imageData = { width: 10, height: 10 };

        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseMove(mouseEvent100);
    });

    it('should set attribute and create a selection', () => {
        (service as any).draggingImage = true;
        (service as any).mouseDown = false;
        service.firstEllipseCoord = { x: 0, y: 20 };
        (service as any).startDownCoord = { x: 0, y: 0 };
        (service as any).imageData = { width: 10, height: 10 };

        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseMove(mouseEvent100);
    });
    // Need help with this test
    it('should set attribute and create a selection', () => {
        (service as any).draggingImage = false;
        (service as any).mouseDown = true;
        service.firstEllipseCoord = { x: 0, y: 20 };
        (service as any).startDownCoord = { x: 14, y: 14 };
        service.mouseDownCoord = { x: 1, y: 1 };
        (service as any).imageData = { width: 10, height: 10 };

        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseMove(mouseEvent100);
    });

    it('should set attribute and create a selection', () => {
        (service as any).draggingImage = true;
        service.firstEllipseCoord = { x: 0, y: 20 };
        (service as any).startDownCoord = { x: 14, y: 14 };
        service.mouseDownCoord = { x: 1, y: 1 };
        (service as any).imageData = { width: 10, height: 10 };

        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseUp(mouseEvent100);
    });

    it('should set attribute and create a selection', () => {
        (service as any).draggingImage = false;
        (service as any).mouseDown = true;

        service.firstEllipseCoord = { x: 0, y: 20 };
        (service as any).startDownCoord = { x: 14, y: 14 };
        service.mouseDownCoord = { x: 1, y: 1 };
        (service as any).imageData = { width: 10, height: 10 };

        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseUp(mouseEvent100);
    });
    it('should set attribute and create a selection', () => {
        (service as any).draggingImage = false;
        (service as any).mouseDown = false;

        service.firstEllipseCoord = { x: 0, y: 20 };
        (service as any).startDownCoord = { x: 14, y: 14 };
        service.mouseDownCoord = { x: 1, y: 1 };
        (service as any).imageData = { width: 10, height: 10 };
        (service as any).ellipseService.shiftDown = true; // why its not working???
        service.pathLastCoord = { x: 10, y: 10 };
        (service as any).pathData = pathTest;
        service.onMouseUp(mouseEvent100);
    });

    it('should on shiftDown', () => {
        const keyboardEvent = {} as KeyboardEvent;
        service.onShiftDown(keyboardEvent);
    });

    it('should on onShiftUp', () => {
        const keyboardEvent = {} as KeyboardEvent;
        service.onShiftUp(keyboardEvent);
    });

    it('should on arrowDown', () => {
        const keyboardEvent = {} as KeyboardEvent;
        service.onArrowDown(keyboardEvent);
    });
    it('should on arrowDown', () => {
        (service as any).arrowDown = false;
        const keyboardEvent = {} as KeyboardEvent;
        (service as any).selectionCreated = true;
        service.onArrowDown(keyboardEvent);
    });
    it('should on arrowUp', () => {
        const keyboardEvent = {} as KeyboardEvent;
        (service as any).selectionCreated = true;

        service.onArrowUp(keyboardEvent);
    });

    it('should on onCtrlADown', () => {
        service.onCtrlADown();
    });

    it('should on call on mouse move if mouse is not down for createOnMouseMoveEvent', () => {
        service.mouseDown = true;
        (service as any).pathData = pathTest;
        (service as any).createOnMouseMoveEvent();
    });
    it('should on call on mouse move if mouse is not down for createOnMouseMoveEvent', () => {
        service.mouseDown = false;
        (service as any).pathData = pathTest;
        (service as any).createOnMouseMoveEvent();
    });

    /* it('should set correctly after resetTransform', () => {
        (service as any).resetTransform();
    });

    it('should ... correctly after showSelection', () => {
        (service as any).showSelection(previewCtxStub, imageStub, 0);
    });

    it('should ... correctly after getPath', () => {
        (service as any).getPath(0);
    });

    it('should ... correctly after clearCanvasEllipse', () => {
        (service as any).clearCanvasEllipse();
    });*/
});
