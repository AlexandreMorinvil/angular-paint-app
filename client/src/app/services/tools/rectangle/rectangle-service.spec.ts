import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { RectangleService } from './rectangle-service';

describe('RectangleService', () => {
    let service: RectangleService;
    let tracingService: TracingService;
    let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawRectangleSpy: jasmine.Spy<any>;
    let setAttributeSpy: jasmine.Spy<any>;
    let ctxFillSpy: jasmine.Spy<any>;
    let ctxContourSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(RectangleService);
        tracingService = TestBed.inject(TracingService);
        drawRectangleSpy = spyOn<any>(service, 'drawRectangle').and.callThrough();
        setAttributeSpy = spyOn<any>(service, 'setAttribute').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['tracingService'] = tracingService;

        ctxFillSpy = spyOn<any>(service['drawingService'].previewCtx, 'fill').and.callThrough();
        ctxContourSpy = spyOn<any>(service['drawingService'].previewCtx, 'stroke').and.callThrough();

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
            shiftKey: false,
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

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawRectangle if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawRectangle if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawRectangle if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should  call drawRectangle if mouse was already down and shift is pressed down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        mouseEvent = { shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawRectangle if mouse was not already down and shift is not pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;
        mouseEvent = { shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it(' on Mouse mouve should call setAttribute if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        mouseEvent = { shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(setAttributeSpy).toHaveBeenCalled();
    });

    it(' on Mouse mouve should not call setAttribute if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;
        mouseEvent = { shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(setAttributeSpy).not.toHaveBeenCalled();
    });

    it(' should be a square  when drawing rectangle and shift pressed', () => {
        mouseEvent = { offsetX: 30, offsetY: 6, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 10, offsetY: 5, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(mouseEvent.offsetX === mouseEvent.offsetY);
    });

    it(' should not be a square  when drawing rectangle and shift not pressed', () => {
        mouseEvent = { offsetX: 30, offsetY: 6, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 10, offsetY: 5, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseMove(mouseEvent);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(mouseEvent.offsetX !== mouseEvent.offsetY);
    });

    it(' should set attribute shift Down to true on shift key pressed', () => {
        mouseEvent = { offsetX: 50, offsetY: 60, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.shiftDown = true;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const event = new KeyboardEvent('keydown', {
            key: 'Shift',
        });
        service.onShiftDown(event);
        expect(service.shiftDown).toEqual(true);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it(' should set attribute shift Down to false on shift key up', () => {
        mouseEvent = { offsetX: 50, offsetY: 60, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.shiftDown = true;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const event = new KeyboardEvent('keyup', {
            key: 'Shift',
        });
        service.onShiftUp(event);
        expect(service.shiftDown).toEqual(false);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('on drawing a rectangle and shift pressed if height is negatif and width positif should stay negative and positif', () => {
        mouseEvent = { offsetX: 50, offsetY: 60, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.shiftDown = true;
        mouseEvent = { offsetX: 60, offsetY: 50, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('on drawing a rectangle and shift pressed if height is negatif and width negatif should stay negative and negatif', () => {
        mouseEvent = { offsetX: 50, offsetY: 60, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.shiftDown = true;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('on drawing a rectangle and shift pressed if height is positif and width positif should stay positif and positif', () => {
        mouseEvent = { offsetX: 50, offsetY: 60, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.shiftDown = true;
        mouseEvent = { offsetX: 60, offsetY: 70, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('on drawing a rectangle and shift pressed if height is positif and width negatif should stay positif and negatif', () => {
        mouseEvent = { offsetX: 50, offsetY: 60, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.shiftDown = true;
        mouseEvent = { offsetX: 40, offsetY: 70, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('on draw Rectangle should call set Attribute', () => {
        mouseEvent = { offsetX: 50, offsetY: 60, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.shiftDown = true;
        mouseEvent = { offsetX: 40, offsetY: 70, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(setAttributeSpy).toHaveBeenCalled();
    });

    it('on set Attribute should set fill if shape has fill ', () => {
        tracingService.setHasFill(true);
        service.setAttribute(previewCtxStub);
        expect(ctxFillSpy).toHaveBeenCalled();
    });

    it('on set Attribute should not set fill if shape has fill ', () => {
        tracingService.setHasFill(false);
        service.setAttribute(previewCtxStub);
        expect(ctxFillSpy).not.toHaveBeenCalled();
    });

    it('on set Attribute should set contour if shape has countour ', () => {
        tracingService.setHasContour(true);
        service.setAttribute(previewCtxStub);
        expect(ctxContourSpy).toHaveBeenCalled();
    });

    it('on set Attribute should not set contour if shape has no contour ', () => {
        tracingService.setHasContour(false);
        service.setAttribute(previewCtxStub);
        expect(ctxContourSpy).not.toHaveBeenCalled();
    });
});
