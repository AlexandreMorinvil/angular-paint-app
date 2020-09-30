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
    let findAlignmentAngleSpy: jasmine.Spy<any>;
    let ctxStroke: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(LineService);

        // tslint:disable:no-any
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();
        findAlignmentAngleSpy = spyOn<any>(service, 'findAlignmentAngle').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;
        service['drawingService'].canvas.width = 1000;
        service['drawingService'].canvas.height = 800;

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

    it(' mouseClick should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1, // TODO: Avoir ceci dans un enum accessible
        } as MouseEvent;
        service.onMouseClick(mouseEventRClick);
        expect(service.mouseClick).toEqual(false);
    });

    it(' onMouseClick should call drawLine if mouse is Click one time and shift key is not press', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseClick = true;
        const mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
            shiftKey: false,
        } as MouseEvent;
        service.onMouseClick(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine if mouse is already clicked', () => {
        mouseEvent = { offsetX: 10, offsetY: 10, button: 0, shiftKey: true } as MouseEvent;

        service.mouseClick = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawLine if mouse was not already down', () => {
        mouseEvent = { offsetX: 10, offsetY: 10, button: 0, shiftKey: false } as MouseEvent;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        expect(drawLineSpy).not.toHaveBeenCalled();
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
        let alignment = Math.abs(360 - Math.abs(Math.atan2(50, 50) * 180) / Math.PI);
        expect(alignment).toBe(315);
        expect(findAlignmentAngleSpy).toHaveBeenCalled();
    });

    it(' findAlignment should return correct value when its called ', () => {
        mouseEvent = { offsetX: 10, offsetY: 10, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        let alignment = Math.abs(360 - Math.abs(Math.atan2(10, 10) * 180) / Math.PI);
        expect(service.roundToNearestAngle(alignment)).toBe(315);
        expect(findAlignmentAngleSpy).toHaveBeenCalled();
    });

    it(' findAlignment should return correct value when its called ', () => {
        mouseEvent = { offsetX: 10, offsetY: 10, button: 0, shiftKey: false } as MouseEvent;
        service.onMouseClick(mouseEvent);
        mouseEvent = { movementX: 10, movementY: -10, button: 0, shiftKey: true } as MouseEvent;
        service.onMouseMove(mouseEvent);
        let alignment = Math.abs(360 - Math.abs(Math.atan2(-10, -10) * 180) / Math.PI);
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

    it(' roundToNearestAngle should return correct value when its called with angle of 1000', () => {
        expect(service.roundToNearestAngle(1000)).toBe(1);
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
});
