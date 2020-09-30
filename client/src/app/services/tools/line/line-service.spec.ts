import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from './line-service';

describe('LineService', () => {
    let service: LineService;
    let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;
    let canvasStub: HTMLCanvasElement;
    let clearPathSpy: jasmine.Spy<any>;
    let clearPathSavedSpy: jasmine.Spy<any>;
    let drawAlignLineSpy: jasmine.Spy<any>;
    // let drawJunctionSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(LineService);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        clearPathSpy = spyOn<any>(service, 'clearPath').and.callThrough();
        clearPathSavedSpy = spyOn<any>(service, 'clearPathSaved').and.callThrough();
        drawAlignLineSpy = spyOn<any>(service, 'drawAlignLine').and.callThrough();
        // drawJunctionSpy = spyOn<any>(service, 'drawJunction').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;
        service['drawingService'].canvas.width = 1000;
        service['drawingService'].canvas.height = 800;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseMove should not call drawLine if mouse was not click', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseClick = false;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove if mouse is Click and shift not press should drawLine if its in canvas', () => {
        previewCtxStub.canvas.width = 1000;
        previewCtxStub.canvas.height = 800;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseClick = true;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('onMouseMove if mouse is Click and shift not press should not drawLine if its not in canvas', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseClick = true;
        mouseEvent = { offsetX: 1500, offsetY: 1500, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(clearPathSpy).toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove if mouse is Click and shift is press should drawAllLines', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseClick = true;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawAlignLineSpy).toHaveBeenCalled();
    });

    it('onShift Up should drawLines', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseClick = true;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        service.onShiftUp();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('onEscpape down should set mouse Click to false', () => {
        service.onEscapeDown();
        expect(service.mouseClick).toEqual(false);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('onEscpape down should clearPath and clearPathSaved', () => {
        service.onEscapeDown();
        expect(clearPathSpy).toHaveBeenCalled();
        expect(clearPathSavedSpy).toHaveBeenCalled();
    });
    //MARCHE PAS

    it('onMouse doubleClick should call ondDoucleClick event', () => {
        service.click = 1;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        expect(service.onMouseDoubleClickEvent(mouseEvent)).toHaveBeenCalled();
    });
    //MARCHE PAS
    it('onMouse doubleClick if isAround20Pixel should close the shape', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.mouseClick = true;
        service.click = 0;
        mouseEvent = { offsetX: 2, offsetY: 2, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 7, offsetY: 7, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        service.click = 1;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        expect(service.isAround20Pixels()).toBe(true);
        expect(service.closeShape()).toHaveBeenCalled();
    });

    //MARCHE PAS pass pas par le else
    it('onMouse doubleClick if isAround20Pixel should close the shape', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;
        service.mouseClick = true;
        service.click = 0;
        mouseEvent = { offsetX: 10, offsetY: 10, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 60, offsetY: 60, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        service.click = 1;
        mouseEvent = { offsetX: 100, offsetY: 100, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        expect(service.isAround20Pixels()).toBe(false);
        expect(service.closeShape()).not.toHaveBeenCalled();
    });

    /*it('onMouse doubleClick should clearPath and clearPathSaved', () => {
        service.click = 2;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        expect(clearPathSpy).toHaveBeenCalled();
        expect(clearPathSavedSpy).toHaveBeenCalled();
    });

    /*it('on isAroud20Pixels should return true if the distance between first and last click <=20 should return true', () => {
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        waits(10);
        mouseEvent = { offsetX: 42, offsetY: 55, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        service.isAround20Pixels();
        expect(service.isAround20Pixels()).toBe(true);
    });

    it('on isAroud20Pixels should return true if the distance between first and last click >20 should return false', () => {
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        waits(30);
        mouseEvent = { offsetX: 150, offsetY: 150, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        service.isAround20Pixels();
        expect(service.isAround20Pixels()).toBe(false);
    });
    */

    it('on Backspace should set mouseDown to right coordonate', () => {
        service.mouseClick = true;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        service.click = 0;
        mouseEvent = { offsetX: 150, offsetY: 150, button: 0, shiftKey: false } as MouseEvent;
        service.onBackspaceDown();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.mouseDownCoord.x).toEqual(40);
        expect(service.mouseDownCoord.y).toEqual(50);
    });
});
