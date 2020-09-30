import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { EllipseService } from './ellipse-service';

describe('EllipseService', () => {
    let service: EllipseService;
    let tracingService: TracingService;
    let colorService: ColorService;
    let widthService: WidthService;
    let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasStub: HTMLCanvasElement;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    // tslint:disable:no-any
    let drawEllipseSpy: jasmine.Spy<any>;
    let drawCircleSpy: jasmine.Spy<any>;
    let applyTraceSpy: jasmine.Spy<any>;
    let ctxFillSpy: jasmine.Spy<any>;
    let ctxContourSpy: jasmine.Spy<any>;
    let getWidthSpy: jasmine.Spy<any>;
    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(EllipseService);
        tracingService = TestBed.inject(TracingService);
        colorService = TestBed.inject(ColorService);
        widthService = TestBed.inject(WidthService);
        // tslint:disable:no-any
        drawEllipseSpy = spyOn<any>(service, 'drawEllipse').and.callThrough();
        drawCircleSpy = spyOn<any>(service, 'drawCircle').and.callThrough();
        applyTraceSpy = spyOn<any>(service, 'applyTrace').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;
        // tslint:disable:no-magic-numbers
        service['drawingService'].canvas.width = 1000;
        service['drawingService'].canvas.height = 800;

        ctxFillSpy = spyOn<any>(service['drawingService'].previewCtx, 'fill').and.callThrough();
        ctxContourSpy = spyOn<any>(service['drawingService'].previewCtx, 'stroke').and.callThrough();
        getWidthSpy = spyOn<any>(widthService, 'getWidth').and.callThrough();

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

    it(' onMouseUp should call drawEllipse if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawEllipse if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawEllipse if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawEllipseSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawEllipse if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawEllipseSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawCircle if mouse was already down and shift is pressed down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        mouseEvent = { shiftKey: true } as MouseEvent;

        service.onMouseMove(mouseEvent);
        expect(drawCircleSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should call drawCircle if mouse down and shift is pressed down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        mouseEvent = { shiftKey: true } as MouseEvent;

        service.onMouseUp(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawCircleSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should call drawCircle if mouse down and shift is pressed down ', () => {
        // bottom right
        mouseEvent = { offsetX: 10, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 11, offsetY: 11, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawCircleSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should call drawCircle if mouse down and shift is pressed down ', () => {
        // top right
        mouseEvent = { offsetX: 10, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 9, offsetY: 9, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawCircleSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should call drawCircle if mouse down and shift is pressed down ', () => {
        mouseEvent = { offsetX: 20, offsetY: 9, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 50, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawCircleSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should call drawCircle if mouse down and shift is pressed down  ', () => {
        // top right
        mouseEvent = { offsetX: 10, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 9, offsetY: 9, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);

        expect(drawCircleSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should change height of canvas with the position of mouse in y ', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        const baseHeight = 800;

        mouseEvent = { offsetX: 1, offsetY: 1, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(previewCtxStub.canvas.height).toEqual(baseHeight);

        mouseEvent = { offsetX: 500, offsetY: 1200, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(previewCtxStub.canvas.height).toBe(mouseEvent.offsetY);
    });

    it(' onMouseMove should change width of canvas with the position of mouse in x', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        const baseWidth = 1000;

        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(previewCtxStub.canvas.width).toEqual(baseWidth);

        mouseEvent = { offsetX: 1200, offsetY: 500, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(previewCtxStub.canvas.width).toBe(mouseEvent.offsetX);
    });

    it(' should call applyTrace with trace of type contour', () => {
        tracingService.setHasContour(true);
        tracingService.getHasContour();

        service.applyTrace(previewCtxStub);
        expect(applyTraceSpy).toHaveBeenCalled();
        expect(ctxContourSpy).toHaveBeenCalled();
    });

    it(' should call applyTrace with trace of type full', () => {
        tracingService.setHasFill(true);
        tracingService.getHasFill();

        service.applyTrace(previewCtxStub);
        expect(applyTraceSpy).toHaveBeenCalled();
        expect(ctxFillSpy).toHaveBeenCalled();
    });

    it(' should call applyTrace with trace of type Full and Contour', () => {
        tracingService.setHasFill(true);
        tracingService.getHasFill();
        tracingService.setHasContour(true);
        tracingService.getHasContour();

        service.applyTrace(previewCtxStub);
        expect(applyTraceSpy).toHaveBeenCalled();
        expect(ctxContourSpy).toHaveBeenCalled();
        expect(ctxFillSpy).toHaveBeenCalled();
    });

    it(' should call applyTrace with trace of type not Full and not Contour', () => {
        tracingService.setHasContour(false);
        tracingService.getHasContour();
        tracingService.setHasFill(false);
        tracingService.getHasFill();

        service.applyTrace(previewCtxStub);
        expect(applyTraceSpy).toHaveBeenCalled();

        expect(ctxContourSpy).not.toHaveBeenCalled();
        expect(ctxFillSpy).not.toHaveBeenCalled();
    });

    it(' on drawEllipse with fill and no contour should call getWidth', () => {
        tracingService.setHasContour(false);
        tracingService.getHasContour();
        tracingService.setHasFill(true);
        tracingService.getHasFill();

        mouseEvent = { offsetX: 50, offsetY: 9, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        service.drawEllipse(previewCtxStub, service.pathData);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawEllipseSpy).toHaveBeenCalled();
        expect(getWidthSpy).toHaveBeenCalled();
    });
    it(' should call applyTrace on drawEllipse', () => {
        mouseEvent = { offsetX: 50, offsetY: 9, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        service.drawEllipse(previewCtxStub, service.pathData);
        expect(applyTraceSpy).toHaveBeenCalled();
    });

    it(' should call applyTrace for trace of type Contour with the color blue', () => {
        mouseEvent = { offsetX: 50, offsetY: 9, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        tracingService.setHasContour(true);
        tracingService.getHasContour();
        colorService.setSecondaryColor('#0000ff');
        service.applyTrace(previewCtxStub);
        expect(previewCtxStub.strokeStyle).toBe('#0000ff');
    });

    it(' should call applyTrace for trace of type Full with the color red', () => {
        mouseEvent = { offsetX: 50, offsetY: 9, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        tracingService.setHasFill(true);
        tracingService.getHasFill();
        colorService.setPrimaryColor('#ff0000');
        service.applyTrace(previewCtxStub);
        expect(previewCtxStub.fillStyle).toBe('#ff0000');
    });

    it(' should call applyTrace for trace of type fullContour', () => {
        mouseEvent = { offsetX: 50, offsetY: 9, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        tracingService.setHasFill(true);
        tracingService.getHasFill();
        tracingService.setHasContour(true);
        tracingService.getHasContour();
        colorService.setPrimaryColor('#ff0000');
        colorService.setSecondaryColor('#0000ff');
        service.applyTrace(previewCtxStub);
        expect(previewCtxStub.strokeStyle).toBe('#0000ff');
        expect(previewCtxStub.fillStyle).toBe('#ff0000');
    });

    it(' onShiftDown should call drawCircle and drawPreviewRect', () => {
        mouseEvent = { offsetX: 50, offsetY: 9, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        service.onShiftDown();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawCircleSpy).toHaveBeenCalled();
    });

    it(' onShiftUp should call drawEllipse and drawPreviewRect', () => {
        mouseEvent = { offsetX: 50, offsetY: 9, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 10, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseMove(mouseEvent);
        service.onShiftUp();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawEllipseSpy).toHaveBeenCalled();
    });
});
