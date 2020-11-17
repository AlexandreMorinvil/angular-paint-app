import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { AerosolService } from './aerosol.service';

// The disablement of the "any" tslint rule is justified in this situation as the prototype
// of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
// tslint:disable:no-any
fdescribe('AerosolService', () => {
    let service: AerosolService;
    let mouseEvent: MouseEvent;
    let colorService: ColorService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;

    let sprayPaintSpy: jasmine.Spy<any>;
    let setAttributeSpy: jasmine.Spy<any>;
    let clearPathSpy: jasmine.Spy<any>;
    // let ctxFillSpy: jasmine.Spy<any>;
    // let ctxBeginPath: jasmine.Spy<any>;
    // let ctxArc: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(AerosolService);

        colorService = TestBed.inject(ColorService);
        sprayPaintSpy = spyOn<any>(service, 'sprayPaint').and.callThrough();
        setAttributeSpy = spyOn<any>(service, 'setAttribute').and.callThrough();
        clearPathSpy = spyOn<any>(service, 'clearPath').and.callThrough();

        // ctxFillSpy = spyOn<any>((service as any).drawingService.previewCtx, 'fill').and.callThrough();
        // ctxBeginPath = spyOn<any>((service as any).drawingService.previewCtx, 'beginPath').and.callThrough();
        // ctxArc = spyOn<any>((service as any).drawingService.previewCtx, 'arc').and.callThrough();

        const canvasWidth = 1000;
        const canvasHeight = 800;

        (service as any).drawingService.baseCtx = baseCtxStub;
        (service as any).drawingService.previewCtx = previewCtxStub;
        (service as any).drawingService.canvas = canvasStub;
        (service as any).drawingService.canvas.width = canvasWidth;
        (service as any).drawingService.canvas.height = canvasHeight;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseMove should set mousePosition to correct position if mouse is already down', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        const result = (service as any).pathData[0];
        expect(result).toEqual(expectedResult);
    });

    it(' mouseMove should not set mousePosition to correct position if mouse is not already down', () => {
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        const result = (service as any).pathData[0];
        expect(result).toEqual(undefined);
    });

    it(' should call set sprayPaint on mouseDown if mouse is already down', () => {
        previewCtxStub.lineCap = 'round';
        previewCtxStub.lineJoin = 'round';
        colorService.setSecondaryColor('#0000ff');
        (service as any).drawingService.previewCtx = previewCtxStub;
        service.mouseDown = true;
        service.onMouseDown(mouseEvent);
        expect(sprayPaintSpy).toHaveBeenCalled();
    });

    it(' should not call set sprayPaint on mouseDown if mouse is not already down', () => {
        const mouseEvent2 = {
            offsetX: 25,
            offsetY: 25,
            button: 1,
        } as MouseEvent;
        previewCtxStub.lineCap = 'round';
        previewCtxStub.lineJoin = 'round';
        colorService.setSecondaryColor('#0000ff');
        (service as any).drawingService.previewCtx = previewCtxStub;
        service.onMouseDown(mouseEvent2);
        expect(sprayPaintSpy).not.toHaveBeenCalled();
    });

    it(' should call set attribute on spray paint', () => {
        const path: Vec2[] = [{ x: 25, y: 25 }];
        (service as any).numberSprayTransmissionService.setNumberSprayTransmission(50);
        previewCtxStub.lineCap = 'round';
        previewCtxStub.lineJoin = 'round';
        colorService.setSecondaryColor('#0000ff');
        (service as any).sprayPaint(previewCtxStub, path);
        expect(setAttributeSpy).toHaveBeenCalled();
    });

    it(' mouseUp should set mouseDown to false if mouse is already down', () => {
        service.mouseDown = true;
        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toEqual(false);
    });

    it(' mouseUp should clearPath if mouse is already down', () => {
        service.mouseDown = true;
        service.onMouseUp(mouseEvent);
        expect(clearPathSpy).toHaveBeenCalled();
    });

    it(' mouseUp should clearPath if mouse is not already down', () => {
        service.mouseDown = false;
        service.onMouseUp(mouseEvent);
        expect(clearPathSpy).toHaveBeenCalled();
    });
});
