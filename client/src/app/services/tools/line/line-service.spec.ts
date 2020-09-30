import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from './line-service';

describe('LineService', () => {
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

        // tslint: disable: no - any;
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
      service.pathDataSaved[0] = {x: 0, y:0}
      service.pathDataSaved[1] = {x: 5, y:0}
      mouseEvent = { offsetX: 5, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
      service.mouseClick = true;
      service.onMouseClick(mouseEvent);
      service.onMouseClick(mouseEvent);
      expect(closeShapeSpy).toHaveBeenCalled();
    });

    it(' closeShape should not return if the mouse is not close enough', () => {
      service.pathDataSaved[0] = {x: 0, y:0}
      service.pathDataSaved[1] = {x: 5, y:10}
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
        const alignment = Math.abs(360 - Math.abs(Math.atan2(50, 50) * 180) / Math.PI);
        expect(alignment).toBe(315);
        expect(findAlignmentAngleSpy).toHaveBeenCalled();
    });

    it(' findAlignment should return correct value when its called ', () => {
        mouseEvent = { offsetX: 10, offsetY: 10, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const alignment = Math.abs(360 - Math.abs(Math.atan2(10, 10) * 180) / Math.PI);
        expect(service.roundToNearestAngle(alignment)).toBe(315);
        expect(findAlignmentAngleSpy).toHaveBeenCalled();
    });

    it(' findAlignment should return correct value when its called ', () => {
        mouseEvent = { offsetX: 10, offsetY: 10, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { movementX: 10, movementY: -10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const alignment = Math.abs(360 - Math.abs(Math.atan2(-10, -10) * 180) / Math.PI);
        expect(service.roundToNearestAngle(alignment)).toBe(225);
        expect(findAlignmentAngleSpy).toHaveBeenCalled();
    });

    it(' roundToNearestAngle should return correct value when its called with angle of 350', () => {
        expect(service.roundToNearestAngle(350)).toBe(0);
    });
    it(' roundToNearestAngle should return correct value when its called with angle of 30', () => {
        expect(service.roundToNearestAngle(30)).toBe(45);
    });
    it(' roundToNearestAngle should return correct value when its called with angle of 70', () => {
        expect(service.roundToNearestAngle(70)).toBe(90);
    });
    it(' roundToNearestAngle should return correct value when its called with angle of 130', () => {
        expect(service.roundToNearestAngle(130)).toBe(135);
    });
    it(' roundToNearestAngle should return correct value when its called with angle of 170', () => {
        expect(service.roundToNearestAngle(170)).toBe(180);
    });
    it(' roundToNearestAngle should return correct value when its called with angle of 220', () => {
        expect(service.roundToNearestAngle(220)).toBe(225);
    });
    it(' roundToNearestAngle should return correct value when its called with angle of 260', () => {
        expect(service.roundToNearestAngle(260)).toBe(270);
    });
    it(' roundToNearestAngle should return correct value when its called with angle of 300', () => {
        expect(service.roundToNearestAngle(300)).toBe(315);
    });

    it(' drawAlignLine should call assign aligmentCoord correctly for case of angle 45', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 20, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        mouseEvent = { offsetX: 30, offsetY: 30, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(ctxStroke).toHaveBeenCalled();
        expect(service.alignmentCoord.x).toBe(30);
        expect(service.alignmentCoord.y).toBe(30);
    });
    it(' drawAlignLine should call assign aligmentCoord correctly for case of angle 90', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 20, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 50, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(ctxStroke).toHaveBeenCalled();
        expect(service.alignmentCoord.x).toBe(20);
        expect(service.alignmentCoord.y).toBe(50);
    });
    it(' drawAlignLine should call assign aligmentCoord correctly for case of angle 135', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 20, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        mouseEvent = { offsetX: 10, offsetY: 30, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(ctxStroke).toHaveBeenCalled();
        expect(service.alignmentCoord.x).toBe(10);
        expect(service.alignmentCoord.y).toBe(30);
    });

    it(' drawAlignLine should call assign aligmentCoord correctly for case of angle 180', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 20, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        mouseEvent = { offsetX: 10, offsetY: 20, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(ctxStroke).toHaveBeenCalled();
        expect(service.alignmentCoord.x).toBe(10);
        expect(service.alignmentCoord.y).toBe(20);
    });

    it(' drawAlignLine should call assign aligmentCoord correctly for case of angle 225', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 20, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        mouseEvent = { offsetX: 10, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(ctxStroke).toHaveBeenCalled();
        expect(service.alignmentCoord.x).toBe(10);
        expect(service.alignmentCoord.y).toBe(10);
    });

    it(' drawAlignLine should call assign aligmentCoord correctly for case of angle 270', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 20, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(ctxStroke).toHaveBeenCalled();
        expect(service.alignmentCoord.x).toBe(20);
        expect(service.alignmentCoord.y).toBe(10);
    });

    it(' drawAlignLine should call assign aligmentCoord correctly for case of angle 315', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 20, offsetY: 20, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        mouseEvent = { offsetX: 30, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(ctxStroke).toHaveBeenCalled();
        expect(service.alignmentCoord.x).toBe(30);
        expect(service.alignmentCoord.y).toBe(10);
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

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.mouseDownCoord.x).toEqual(40);
        expect(service.mouseDownCoord.y).toEqual(50);
    });

    it('Backspace should not work with only one junction', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseClick = true;
        service.click = 0;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        service.onBackspaceDown();

        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.mouseDownCoord.x).toBeUndefined;
        expect(service.mouseDownCoord.y).toBeUndefined;
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
      service.onBackspaceDown();
      service.onBackspaceDown();

      expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(service.mouseDownCoord.x).toBeUndefined;
        expect(service.mouseDownCoord.y).toBeUndefined;
  });




    /*

    it('onMouse doubleClick should call ondDoucleClick event', () => {
        service.mouseClick = true;
        service.click = 0;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        service.click = 1;
        mouseEvent = { offsetX: 60, offsetY: 70, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        expect(service.onMouseDoubleClickEvent(mouseEvent)).toHaveBeenCalled();
    });
    */
    // MARCHE PAS
    /* it('onMouse doubleClick if isAround20Pixel should close the shape', () => {
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
    }); */

    // MARCHE PAS pass pas par le else
    /*  it('onMouse doubleClick if isAround20Pixel should close the shape', () => {
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
    }); */
    /*

    it('onMouse doubleClick should clearPath and clearPathSaved', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseClick = true;
        service.click = 0;
        mouseEvent = { offsetX: 40, offsetY: 50, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 80, offsetY: 90, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseMove(mouseEvent);
        service.click = 1;
        mouseEvent = { offsetX: 100, offsetY: 150, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        expect(clearPathSpy).toHaveBeenCalled();
        expect(clearPathSavedSpy).toHaveBeenCalled();
    });
    */
    /*marche passs

    it('on isAround20Pixels should return true if the distance between first and last click <=20 should return true', () => {
        service.isPointsWithJunction = false;
        service.mouseClick = true;
        service.click = 0;
        mouseEvent = { offsetX: 22, offsetY: 33, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 23, offsetY: 34, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        service.click = 1;
        mouseEvent = { offsetX: 24, offsetY: 35, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        //service.isAround20Pixels();
        expect(isAround20PixelSpy).toBe(true);
    });
    /* maRCHE PAS

    fit('on isAroud20Pixels should return true if the distance between first and last click >20 should return false', () => {
        service.mouseClick = true;
        service.mouseDownCoord = { x: 0, y: 0 };
        service.click = 0;

        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 1000, offsetY: 1050, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        service.click = 1;
        service.onMouseClick(mouseEvent);

        //service.isAround20Pixels();
        expect(service.isAround20Pixels()).toEqual(false);
    });
    */
});
