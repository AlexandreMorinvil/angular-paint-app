import { TestBed } from '@angular/core/testing';
import { InteractionPaint } from '@app/classes/action/interaction-paint';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { ToleranceService } from '@app/services/tool-modifier/tolerance/tolerance.service';
import { PaintService } from './paint.service';
// The disablement of the "any" tslint rule is justified in this situation as the prototype
// of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
// tslint:disable:no-any
describe('PaintService', () => {
    let service: PaintService;
    let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let colorService: ColorService;
    let toleranceService: ToleranceService;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;

    let sameColorFillSpy: jasmine.Spy<any>;
    let floodFillSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(PaintService);
        colorService = TestBed.inject(ColorService);
        toleranceService = TestBed.inject(ToleranceService);

        // No need to justify numbers to create a mock rectangles
        // tslint:disable:no-magic-numbers
        const canvasWidth = 100;
        const canvasHeight = 100;
        colorService.setPrimaryColor('#050505');
        toleranceService.setTolerance(0);
        (service as any).drawingService.baseCtx = baseCtxStub;
        (service as any).drawingService.previewCtx = previewCtxStub;
        (service as any).drawingService.canvas = canvasStub;
        (service as any).drawingService.canvas.width = canvasWidth;
        (service as any).drawingService.canvas.height = canvasHeight;
        (service as any).colorService = colorService;
        (service as any).toleranceService = toleranceService;
        (service as any).drawingService.baseCtx.fillStyle = '#000000';
        (service as any).drawingService.baseCtx.fillRect(0, 0, 100, 100);
        (service as any).drawingService.baseCtx.fillStyle = '#010101';
        (service as any).drawingService.baseCtx.fillRect(50, 50, 5, 5);
        (service as any).drawingService.baseCtx.fillStyle = '#000100';
        (service as any).drawingService.baseCtx.fillRect(1, 1, 50, 50);

        mouseEvent = {
            offsetX: 60,
            offsetY: 60,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' Left click should call floodFill ', () => {
        floodFillSpy = spyOn<any>(service, 'floodFill').and.callThrough();
        service.onMouseDown(mouseEvent);
        expect(floodFillSpy).toHaveBeenCalled();
    });

    it(' Right click should call sameColorFill ', () => {
        sameColorFillSpy = spyOn<any>(service, 'sameColorFill').and.callThrough();
        const mouseEvent2 = {
            offsetX: 25,
            offsetY: 25,
            button: 2,
        } as MouseEvent;
        service.onMouseDown(mouseEvent2);
        expect(sameColorFillSpy).toHaveBeenCalled();
    });

    it(' should make sure that matchStartColor verify correctly with fill rgb and target surface', () => {
        colorService.setPrimaryColor('#010102');
        floodFillSpy = spyOn<any>(service, 'floodFill').and.callThrough();

        const mouseEvent2 = {
            offsetX: 51,
            offsetY: 51,
            button: 0,
        } as MouseEvent;
        service.onMouseDown(mouseEvent2);

        expect(floodFillSpy).toHaveBeenCalled();
    });

    it(' should make sure that function are not called if mouseEvent is not in canvas', () => {
        const mouseEvent2 = {
            offsetX: 0,
            offsetY: 2000,
            button: 0,
        } as MouseEvent;
        floodFillSpy = spyOn<any>(service, 'floodFill').and.callThrough();
        service.onMouseDown(mouseEvent2);
        expect(floodFillSpy).not.toHaveBeenCalled();
    });

    it(' should make sure that function are not called if mouseEvent is not in canvas', () => {
        const mouseEvent2 = {
            offsetX: 0,
            offsetY: 0,
            button: 1,
        } as MouseEvent;
        service.onMouseDown(mouseEvent2);
        floodFillSpy = spyOn<any>(service, 'floodFill').and.callThrough();
        sameColorFillSpy = spyOn<any>(service, 'sameColorFill').and.callThrough();
        expect(floodFillSpy).not.toHaveBeenCalled();
        expect(sameColorFillSpy).not.toHaveBeenCalled();
    });

    it(' should execute and call floodfill if left mouse button is pressed with correct rgb colors assigned', () => {
        const interactionPaint = {
            mouseButton: 0,
            mouseDownCoord: { x: 201, y: 201 },
            startR: 1,
            startG: 1,
            startB: 1,
            fillColorR: 255,
            fillColorG: 255,
            fillColorB: 255,
        } as InteractionPaint;
        floodFillSpy = spyOn<any>(service, 'floodFill').and.callThrough();
        (service as any).execute(interactionPaint);
        expect(floodFillSpy).toHaveBeenCalled();
    });

    it(' should execute and call samefill if right mouse button is pressed with correct rgb colors assigned', () => {
        const interactionPaint = {
            mouseButton: 2,
            mouseDownCoord: { x: 201, y: 201 },
            startR: 1,
            startG: 1,
            startB: 1,
            fillColorR: 255,
            fillColorG: 255,
            fillColorB: 255,
        } as InteractionPaint;
        sameColorFillSpy = spyOn<any>(service, 'sameColorFill').and.callThrough();
        (service as any).execute(interactionPaint);
        expect(sameColorFillSpy).toHaveBeenCalled();
    });

    it(' should execute and not call samefill/floodfill if right mouse button or left button is not pressed', () => {
        const interactionPaint = {
            mouseButton: 1,
            mouseDownCoord: { x: 201, y: 201 },
            startR: 1,
            startG: 1,
            startB: 1,
            fillColorR: 255,
            fillColorG: 255,
            fillColorB: 255,
        } as InteractionPaint;
        floodFillSpy = spyOn<any>(service, 'floodFill').and.callThrough();
        sameColorFillSpy = spyOn<any>(service, 'sameColorFill').and.callThrough();
        (service as any).execute(interactionPaint);
        expect(sameColorFillSpy).not.toHaveBeenCalled();
        expect(floodFillSpy).not.toHaveBeenCalled();
    });
});
