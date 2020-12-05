import { TestBed } from '@angular/core/testing';
import { InteractionStartEnd } from '@app/classes/action/interaction-start-end';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { RectangleService } from './rectangle.service';
// The disablement of the "any" tslint rule is justified in this situation as the prototype
// of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
// tslint:disable:no-any
// It would be illogical to split a test file for a unique service
// tslint:disable:max-file-line-count
describe('RectangleService', () => {
    let service: RectangleService;
    let tracingService: TracingService;
    let colorService: ColorService;
    let mouseEvent: MouseEvent;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;

    let drawRectangleSpy: jasmine.Spy<any>;
    let drawPreviewRectSpy: jasmine.Spy<any>;
    let setAttributeSpy: jasmine.Spy<any>;
    let ctxFillSpy: jasmine.Spy<any>;
    let ctxContourSpy: jasmine.Spy<any>;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(RectangleService);
        tracingService = TestBed.inject(TracingService);
        colorService = TestBed.inject(ColorService);
        drawRectangleSpy = spyOn<any>(service, 'drawRectangle').and.callThrough();
        drawPreviewRectSpy = spyOn<any>(service, 'drawPreviewRect').and.callThrough();
        setAttributeSpy = spyOn<any>(service, 'setAttribute').and.callThrough();

        const canvasWidth = 1000;
        const canvasHeight = 800;
        (service as any).drawingService.baseCtx = baseCtxStub;
        (service as any).drawingService.previewCtx = previewCtxStub;
        (service as any).drawingService.canvas = canvasStub;
        (service as any).drawingService.canvas.width = canvasWidth;
        (service as any).drawingService.canvas.height = canvasHeight;
        (service as any).tracingService = tracingService;

        ctxFillSpy = spyOn<any>((service as any).drawingService.previewCtx, 'fill').and.callThrough();
        ctxContourSpy = spyOn<any>((service as any).drawingService.previewCtx, 'stroke').and.callThrough();

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
        const mouseEventRClick = { offsetX: 25, offsetY: 25, button: 1 } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawRectangle if mouse was already down', () => {
        service.shiftDown = false;
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
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should  call drawRectangle if mouse was already down and shift is pressed down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        mouseEvent = { offsetX: 25, offsetY: 25, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawRectangle if mouse was not already down and shift is not pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;
        mouseEvent = { offsetX: 25, offsetY: 25, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it(' on Mouse mouve should call setAttribute if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        mouseEvent = { offsetX: 25, offsetY: 25, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(setAttributeSpy).toHaveBeenCalled();
    });

    it(' on Mouse mouve should not call setAttribute if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;
        mouseEvent = { offsetX: 25, offsetY: 25, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(setAttributeSpy).not.toHaveBeenCalled();
    });

    it(' should be a square  when drawing rectangle and shift pressed', () => {
        mouseEvent = { offsetX: 30, offsetY: 6, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 10, offsetY: 5, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(mouseEvent.offsetX === mouseEvent.offsetY);
    });

    it(' should not be a square  when drawing rectangle and shift not pressed', () => {
        mouseEvent = { offsetX: 30, offsetY: 6, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 10, offsetY: 5, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseMove(mouseEvent);
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

    it(' should set attribute shift Down to false on shift keyup', () => {
        mouseEvent = { offsetX: 50, offsetY: 60, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.shiftDown = true;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const event = new KeyboardEvent('keyup', { key: 'Shift' });
        service.onShiftUp(event);
        expect(service.shiftDown).toEqual(false);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('should draw a rectangle if height is negatif and width positif', () => {
        mouseEvent = { offsetX: 50, offsetY: 60, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.shiftDown = true;
        mouseEvent = { offsetX: 60, offsetY: 50, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('should draw a rectangle if height is negatif and width positif', () => {
        mouseEvent = { offsetX: 50, offsetY: 60, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.shiftDown = false;
        mouseEvent = { offsetX: 60, offsetY: 50, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('should drawing a rectangle if height is negatif and width negatif', () => {
        mouseEvent = { offsetX: 50, offsetY: 60, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.shiftDown = true;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('should drawing a rectangle if height is positif and width positif', () => {
        mouseEvent = { offsetX: 50, offsetY: 60, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.shiftDown = true;
        mouseEvent = { offsetX: 60, offsetY: 70, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('should drawing a rectangle if height is positif and width negatif', () => {
        mouseEvent = { offsetX: 50, offsetY: 60, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.shiftDown = true;
        mouseEvent = { offsetX: 40, offsetY: 70, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it(' should call setAttribute with trace of type contour', () => {
        tracingService.setHasContour(true);
        tracingService.getHasContour();
        (service as any).setAttribute(previewCtxStub);
        expect(setAttributeSpy).toHaveBeenCalled();
        expect(ctxContourSpy).toHaveBeenCalled();
    });

    it(' should call setAttribute with trace of type full', () => {
        tracingService.setHasFill(true);
        tracingService.getHasFill();
        (service as any).setAttribute(previewCtxStub);
        expect(setAttributeSpy).toHaveBeenCalled();
        expect(ctxFillSpy).toHaveBeenCalled();
    });

    it(' should call setAttribute with trace of type Full and Contour', () => {
        tracingService.setHasFill(true);
        tracingService.getHasFill();
        tracingService.setHasContour(true);
        tracingService.getHasContour();
        (service as any).setAttribute(previewCtxStub);
        expect(setAttributeSpy).toHaveBeenCalled();
        expect(ctxContourSpy).toHaveBeenCalled();
        expect(ctxFillSpy).toHaveBeenCalled();
    });

    it(' should call setAttribute with trace of type not Full and not Contour', () => {
        tracingService.setHasContour(false);
        tracingService.getHasContour();
        tracingService.setHasFill(false);
        tracingService.getHasFill();

        (service as any).setAttribute(previewCtxStub);
        expect(setAttributeSpy).toHaveBeenCalled();
        expect(ctxContourSpy).not.toHaveBeenCalled();
        expect(ctxFillSpy).not.toHaveBeenCalled();
    });

    it(' should call setAttribute for trace of type Contour with the color blue', () => {
        mouseEvent = { offsetX: 50, offsetY: 9, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        tracingService.setHasContour(true);
        tracingService.getHasContour();
        colorService.setSecondaryColor('#0000ff');
        (service as any).setAttribute(previewCtxStub);
        expect(previewCtxStub.strokeStyle).toBe('#0000ff');
    });

    it(' should call setAttribute for trace of type Full with the color red', () => {
        mouseEvent = { offsetX: 50, offsetY: 9, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        tracingService.setHasFill(true);
        tracingService.getHasFill();
        colorService.setPrimaryColor('#ff0000');
        (service as any).setAttribute(previewCtxStub);
        expect(previewCtxStub.fillStyle).toBe('#ff0000');
    });

    it(' should call setAttribute for trace of type fullContour', () => {
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
        (service as any).setAttribute(previewCtxStub);
        expect(previewCtxStub.strokeStyle).toBe('#0000ff');
        expect(previewCtxStub.fillStyle).toBe('#ff0000');
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

    it('on set Attribute should set fill if shape has fill ', () => {
        tracingService.setHasFill(true);
        (service as any).setAttribute(previewCtxStub);
        expect(ctxFillSpy).toHaveBeenCalled();
    });

    it('on set Attribute should not set fill if shape has fill ', () => {
        tracingService.setHasFill(false);
        (service as any).setAttribute(previewCtxStub);
        expect(ctxFillSpy).not.toHaveBeenCalled();
    });

    it('on set Attribute should set contour if shape has countour ', () => {
        tracingService.setHasContour(true);
        (service as any).setAttribute(previewCtxStub);
        expect(ctxContourSpy).toHaveBeenCalled();
    });

    it('on set Attribute should not set contour if shape has no contour ', () => {
        tracingService.setHasContour(false);
        (service as any).setAttribute(previewCtxStub);
        expect(ctxContourSpy).not.toHaveBeenCalled();
    });

    it('should draw a Preview rectangle if height is negatif and width positif', () => {
        const width = 22;
        (service as any).widthService.setWidth(width);
        mouseEvent = { offsetX: 50, offsetY: 60, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.shiftDown = true;
        mouseEvent = { offsetX: 60, offsetY: 50, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawPreviewRectSpy).toHaveBeenCalled();
    });

    it('should drawing a preview rectangle if height is negatif and width negatif', () => {
        const width = 22;
        (service as any).widthService.setWidth(width);
        mouseEvent = { offsetX: 50, offsetY: 60, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.shiftDown = true;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawPreviewRectSpy).toHaveBeenCalled();
    });

    it('should drawing a preview rectangle if height is positif and width positif', () => {
        const width = 22;
        (service as any).widthService.setWidth(width);
        mouseEvent = { offsetX: 50, offsetY: 60, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.shiftDown = true;
        mouseEvent = { offsetX: 60, offsetY: 70, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawPreviewRectSpy).toHaveBeenCalled();
    });

    it('should drawing a preview rectangle if height is positif and width negatif', () => {
        const width = 22;
        (service as any).widthService.setWidth(width);
        mouseEvent = { offsetX: 50, offsetY: 60, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.shiftDown = true;
        mouseEvent = { offsetX: 40, offsetY: 70, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawPreviewRectSpy).toHaveBeenCalled();
    });

    it('should execute and drawRectangle is called', () => {
        const interaction = {
            startPoint: { x: 100, y: 100 },
            path: [{}],
            shiftDown: false,
        } as InteractionStartEnd;
        service.execute(interaction);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });
});
