import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from './eraser-service';

// tslint:disable:no-any
describe('EraserService', () => {
    let service: EraserService;
    let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(EraserService);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
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

    it(' Preview canvas should be empty if the mouse moves out of the canvas', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;
        const mouseEvent2 = { offsetX: -5, offsetY: 0, button: 0 } as MouseEvent;

        service.onMouseMove(mouseEvent2);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    // it(' onMouseUp should call drawLine if mouse was already down', () => {
    //     service.mouseDownCoord = { x: 0, y: 0 };
    //     service.mouseDown = true;

    //     service.onMouseUp(mouseEvent);
    //     expect(drawLineSpy).toHaveBeenCalled();
    // });

    it(' onMouseUp should not call drawLine if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseMove should not call drawLine if mouse was not already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = false;

        service.onMouseMove(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });
});
