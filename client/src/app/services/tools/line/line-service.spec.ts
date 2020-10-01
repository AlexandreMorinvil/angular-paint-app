import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from './line-service';

describe('LineService', () => {
    // Configuration of service spy
    // tslint:disable:no-any
    // It would be illogical to split a test file for a unique service
    // tslint:disable:max-file-line-count
    let service: LineService;
    let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasStub: HTMLCanvasElement;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;
    let drawJunctionSpy: jasmine.Spy<any>;
    let findAlignmentAngleSpy: jasmine.Spy<any>;
    let savedPointSpy: jasmine.Spy<any>;
    let onMouseDoubleClickEventSpy: jasmine.Spy<any>;
    let closeShapeSpy: jasmine.Spy<any>;
    let drawAlignLineSpy: jasmine.Spy<any>;
    let ctxStroke: jasmine.Spy<any>;
    let clearPathSpy: jasmine.Spy<any>;
    let clearPathSavedSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(LineService);
        // The disablement of the "any" tslint rule is justified in this situation as the prototype
        // of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
        // Configuration of service spy
        // tslint:disable:no-any
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        findAlignmentAngleSpy = spyOn<any>(service, 'findAlignmentAngle').and.callThrough();
        drawJunctionSpy = spyOn<any>(service, 'drawJunction').and.callThrough();
        savedPointSpy = spyOn<any>(service, 'savedPoints').and.callThrough();
        onMouseDoubleClickEventSpy = spyOn<any>(service, 'onMouseDoubleClickEvent').and.callThrough();
        closeShapeSpy = spyOn<any>(service, 'closeShape').and.callThrough();
        drawAlignLineSpy = spyOn<any>(service, 'drawAlignLine').and.callThrough();
        clearPathSpy = spyOn<any>(service, 'clearPath').and.callThrough();
        clearPathSavedSpy = spyOn<any>(service, 'clearPathSaved').and.callThrough();
        const canvasWidth = 1000;
        const canvasHeight = 800;

        // Configuration of service spy
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;
        service['drawingService'].canvas.width = canvasWidth;
        service['drawingService'].canvas.height = canvasHeight;

        ctxStroke = spyOn<any>(service['drawingService'].previewCtx, 'stroke').and.callThrough();

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
            shiftKey: false,
            movementY: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseClick should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseClick(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseClick should set mouseClick property to true on left click', () => {
        service.onMouseClick(mouseEvent);
        expect(service.mouseClick).toEqual(true);
    });

    it(' mouseClick should set mouseClick property to false on  click', () => {
        service.onMouseClick(mouseEvent);
        expect(service.mouseClick).toEqual(true);
    });

    it(' mouseClick should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1,
        } as MouseEvent;
        service.onMouseClick(mouseEventRClick);
        expect(service.mouseClick).toEqual(false);
    });

    it('onMouseMove should not call drawLine if mouse was not click', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseClick = false;
        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseClick should call drawLine, drawJunction,savedPoint if mouse is clicked one time and shift key is pressed', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseClick = true;
        service.click = 0;
        service.alignmentCoord = { x: 0, y: 0 };
        const mouseEvent2 = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
            shiftKey: true,
        } as MouseEvent;
        service.onMouseClick(mouseEvent2);

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawAlignLineSpy).toHaveBeenCalled();
        expect(drawJunctionSpy).toHaveBeenCalled();
        expect(savedPointSpy).toHaveBeenCalled();
        expect(service.pathData[0]).toBe(service.alignmentCoord);
        expect(service.mouseDownCoord).toBe(service.alignmentCoord);
    });

    it(' onMouseDoubleClick should call clearTimout set reset click to zero and call onMouseDoubleClickEvent', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseClick = true;
        service.onMouseClick(mouseEvent);
        service.onMouseClick(mouseEvent);
        expect(onMouseDoubleClickEventSpy).toHaveBeenCalled();
        expect(service.click).toBe(0);
        expect(service.mouseClick).toEqual(false);
    });

    it(' onMouseClick should call clearTimout set reset click to zero and call onMouseDoubleClickEvent', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseClick = true;
        service.onMouseClick(mouseEvent);
        service.onMouseClick(mouseEvent);
        expect(onMouseDoubleClickEventSpy).toHaveBeenCalled();
        expect(service.click).toBe(0);
        expect(service.mouseClick).toEqual(false);
    });

    it(' closeShape should return if the mouse is close enough', () => {
        service.pathDataSaved[0] = { x: 0, y: 0 };
        service.pathDataSaved[1] = { x: 5, y: 0 };
        mouseEvent = { offsetX: 5, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
        service.mouseClick = true;
        service.onMouseClick(mouseEvent);
        service.onMouseClick(mouseEvent);
        expect(closeShapeSpy).toHaveBeenCalled();
    });

    it(' closeShape should not return if the mouse is not close enough', () => {
        service.pathDataSaved[0] = { x: 0, y: 0 };
        service.pathDataSaved[1] = { x: 5, y: 10 };
        mouseEvent = { offsetX: 40, offsetY: 40, button: 0, shiftKey: false } as MouseEvent;
        service.mouseClick = true;
        service.onMouseClick(mouseEvent);
        service.onMouseClick(mouseEvent);
        expect(closeShapeSpy).not.toHaveBeenCalled();
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

    it(' onMouseMove should not call drawLine if mouse is not on canvas', () => {
        service.mouseDownCoord = { x: 10000, y: 10000 };
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' findAlignment should return correct value when its called ', () => {
        mouseEvent = { offsetX: 100, offsetY: 100, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 150, offsetY: 150, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const positionX = 50;
        const positionY = 50;
        const circleAngle = 360;
        const halfCircleAngle = 180;
        const correctAngle = 315;
        const alignment = Math.abs(circleAngle - Math.abs(Math.atan2(positionY, positionX) * halfCircleAngle) / Math.PI);
        expect(alignment).toBe(correctAngle);
        expect(findAlignmentAngleSpy).toHaveBeenCalled();
    });

    it(' findAlignment should return correct value when its called ', () => {
        mouseEvent = { offsetX: 10, offsetY: 10, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const positionX = 10;
        const positionY = 10;
        const circleAngle = 360;
        const halfCircleAngle = 180;
        const correctAngle = 315;
        const alignment = Math.abs(circleAngle - Math.abs(Math.atan2(positionY, positionX) * halfCircleAngle) / Math.PI);
        expect(service.roundToNearestAngle(alignment)).toBe(correctAngle);
        expect(findAlignmentAngleSpy).toHaveBeenCalled();
    });

    it(' findAlignment should return correct value when its called ', () => {
        mouseEvent = { offsetX: 10, offsetY: 10, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { movementX: 10, movementY: -10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const positionX = -10;
        const positionY = -10;
        const circleAngle = 360;
        const halfCircleAngle = 180;
        const correctAngle = 225;
        const alignment = Math.abs(circleAngle - Math.abs(Math.atan2(positionY, positionX) * halfCircleAngle) / Math.PI);
        expect(service.roundToNearestAngle(alignment)).toBe(correctAngle);
        expect(findAlignmentAngleSpy).toHaveBeenCalled();
    });

    it(' roundToNearestAngle should return correct value when its called with angle of 350', () => {
        const someAngle = 350;
        const correctAngle = 0;
        expect(service.roundToNearestAngle(someAngle)).toBe(correctAngle);
    });

    it(' roundToNearestAngle should return correct value when its called with angle of 30', () => {
        const someAngle = 30;
        const correctAngle = 45;
        expect(service.roundToNearestAngle(someAngle)).toBe(correctAngle);
    });

    it(' roundToNearestAngle should return correct value when its called with angle of 70', () => {
        const someAngle = 70;
        const correctAngle = 90;
        expect(service.roundToNearestAngle(someAngle)).toBe(correctAngle);
    });

    it(' roundToNearestAngle should return correct value when its called with angle of 130', () => {
        const someAngle = 130;
        const correctAngle = 135;
        expect(service.roundToNearestAngle(someAngle)).toBe(correctAngle);
    });

    it(' roundToNearestAngle should return correct value when its called with angle of 170', () => {
        const someAngle = 170;
        const correctAngle = 180;
        expect(service.roundToNearestAngle(someAngle)).toBe(correctAngle);
    });
    it(' roundToNearestAngle should return correct value when its called with angle of 220', () => {
        const someAngle = 220;
        const correctAngle = 225;
        expect(service.roundToNearestAngle(someAngle)).toBe(correctAngle);
    });

    it(' roundToNearestAngle should return correct value when its called with angle of 260', () => {
        const someAngle = 350;
        const correctAngle = 0;
        expect(service.roundToNearestAngle(someAngle)).toBe(correctAngle);
    });

    it(' roundToNearestAngle should return correct value when its called with angle of 300', () => {
        const someAngle = 300;
        const correctAngle = 315;
        expect(service.roundToNearestAngle(someAngle)).toBe(correctAngle);
    });

    it(' drawAlignLine should call assign aligmentCoord correctly for case of angle 45', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 20, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        mouseEvent = { offsetX: 30, offsetY: 30, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const correctAngleCoordX = 30;
        const correctAngleCoordY = 30;
        expect(ctxStroke).toHaveBeenCalled();
        expect(service.alignmentCoord.x).toBe(correctAngleCoordX);
        expect(service.alignmentCoord.y).toBe(correctAngleCoordY);
    });
    it(' drawAlignLine should call assign aligmentCoord correctly for case of angle 90', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 20, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 50, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const correctAngleCoordX = 20;
        const correctAngleCoordY = 50;
        expect(ctxStroke).toHaveBeenCalled();
        expect(service.alignmentCoord.x).toBe(correctAngleCoordX);
        expect(service.alignmentCoord.y).toBe(correctAngleCoordY);
    });
    it(' drawAlignLine should call assign aligmentCoord correctly for case of angle 135', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 20, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        mouseEvent = { offsetX: 10, offsetY: 30, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const correctAngleCoordX = 10;
        const correctAngleCoordY = 30;
        expect(ctxStroke).toHaveBeenCalled();
        expect(service.alignmentCoord.x).toBe(correctAngleCoordX);
        expect(service.alignmentCoord.y).toBe(correctAngleCoordY);
    });

    it(' drawAlignLine should call assign aligmentCoord correctly for case of angle 180', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 20, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        mouseEvent = { offsetX: 10, offsetY: 20, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const correctAngleCoordX = 10;
        const correctAngleCoordY = 20;
        expect(ctxStroke).toHaveBeenCalled();
        expect(service.alignmentCoord.x).toBe(correctAngleCoordX);
        expect(service.alignmentCoord.y).toBe(correctAngleCoordY);
    });

    it(' drawAlignLine should call assign aligmentCoord correctly for case of angle 225', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 20, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        mouseEvent = { offsetX: 10, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const correctAngleCoordX = 10;
        const correctAngleCoordY = 10;
        expect(ctxStroke).toHaveBeenCalled();
        expect(service.alignmentCoord.x).toBe(correctAngleCoordX);
        expect(service.alignmentCoord.y).toBe(correctAngleCoordY);
    });

    it(' drawAlignLine should call assign aligmentCoord correctly for case of angle 270', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 20, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const correctAngleCoordX = 20;
        const correctAngleCoordY = 10;
        expect(ctxStroke).toHaveBeenCalled();
        expect(service.alignmentCoord.x).toBe(correctAngleCoordX);
        expect(service.alignmentCoord.y).toBe(correctAngleCoordY);
    });

    it(' drawAlignLine should call assign aligmentCoord correctly for case of angle 315', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 20, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        mouseEvent = { offsetX: 30, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const correctAngleCoordX = 30;
        const correctAngleCoordY = 10;
        expect(ctxStroke).toHaveBeenCalled();
        expect(service.alignmentCoord.x).toBe(correctAngleCoordX);
        expect(service.alignmentCoord.y).toBe(correctAngleCoordY);
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

    it('on Backspace should set mouseDown to right coordonate', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseClick = true;
        service.click = 0;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        service.click = 0;
        mouseEvent = { offsetX: 100, offsetY: 100, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseMove(mouseEvent);
        service.onMouseClick(mouseEvent);
        service.click = 0;
        mouseEvent = { offsetX: 150, offsetY: 150, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseMove(mouseEvent);
        service.onMouseClick(mouseEvent);
        service.onBackspaceDown();
        service.onBackspaceDown();
        const mouseDownCoordX = 40;
        const mouseDownCoordY = 50;
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.mouseDownCoord.x).toEqual(mouseDownCoordX);
        expect(service.mouseDownCoord.y).toEqual(mouseDownCoordY);
    });

    it('Backspace should not work with only one junction', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseClick = true;
        service.click = 0;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        const result = service.mouseDownCoord;
        service.onBackspaceDown();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.mouseDownCoord).toEqual(result);
    });

    it('on Backspace should not work after finishing the drawing', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseClick = true;
        service.click = 0;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        service.click = 0;
        mouseEvent = { offsetX: 100, offsetY: 100, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseMove(mouseEvent);
        service.onMouseClick(mouseEvent);
        service.click = 0;
        mouseEvent = { offsetX: 150, offsetY: 150, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseMove(mouseEvent);
        service.onMouseClick(mouseEvent);
        service.onMouseClick(mouseEvent);
        const result = service.mouseDownCoord;
        service.onBackspaceDown();
        service.onBackspaceDown();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.mouseDownCoord).toEqual(result);
    });
});
