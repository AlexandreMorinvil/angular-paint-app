import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CursorService } from './cursor.service';

describe('CursorService', () => {
    let service: CursorService;
    let mouseEvent25: MouseEvent;
    let mouseEvent500: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let drawnAnchorSpy: jasmine.Spy<any>;
    let checkHitSpy: jasmine.Spy<any>;
    let moveHeightSpy: jasmine.Spy<any>;
    let moveWidthSpy: jasmine.Spy<any>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(CursorService);
        drawnAnchorSpy = spyOn<any>(service, 'drawnAnchor').and.callThrough();
        checkHitSpy = spyOn<any>(service, 'checkHit').and.callThrough();
        moveHeightSpy = spyOn<any>(service, 'moveHeight').and.callThrough();
        moveWidthSpy = spyOn<any>(service, 'moveWidth').and.callThrough();

        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;

        mouseEvent25 = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        mouseEvent500 = {
            offsetX: 500,
            offsetY: 500,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent25);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent500);
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should call drawAnchor and checkHit', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseDown(mouseEvent500);
        expect(drawnAnchorSpy).toHaveBeenCalled();
        expect(checkHitSpy).toHaveBeenCalled();
    });

    it(' mouseMove should call moveHeight', () => {
        service.mouseDownCoord = { x: 600, y: 700 };
        service.mouseDown = true;
        service.clickOnAnchor = true;
        service.anchorHit = 3;

        service.onMouseMove(mouseEvent500);
        expect(moveHeightSpy).toHaveBeenCalled();

        service.onMouseMove(mouseEvent25);
        expect(moveHeightSpy).toHaveBeenCalled();
    });

    it(' mouseMove should call moveWidth', () => {
        service.mouseDownCoord = { x: 600, y: 700 };
        service.mouseDown = true;
        service.clickOnAnchor = true;
        service.anchorHit = 2;

        service.onMouseMove(mouseEvent500);
        expect(moveWidthSpy).toHaveBeenCalled();
        service.onMouseMove(mouseEvent25);
        expect(moveWidthSpy).toHaveBeenCalled();
    });

    it(' mouseMove should call moveWidth and moveHeight', () => {
        service.mouseDownCoord = { x: 600, y: 700 };
        service.mouseDown = true;
        service.clickOnAnchor = true;
        service.anchorHit = 1;

        service.onMouseMove(mouseEvent500);
        expect(moveWidthSpy).toHaveBeenCalled();
        expect(moveHeightSpy).toHaveBeenCalled();
        service.onMouseMove(mouseEvent25);
        expect(moveWidthSpy).toHaveBeenCalled();
        expect(moveHeightSpy).toHaveBeenCalled();
    });

    it(' mouseMove should call switch default', () => {
        service.mouseDownCoord = { x: 600, y: 700 };
        service.mouseDown = true;
        service.clickOnAnchor = true;
        service.anchorHit = 0;

        service.onMouseMove(mouseEvent500);
        expect(service.anchorHit).toEqual(0);
    });

    it(' checkHit should set anchorHit to 1', () => {
        service.mouseDownCoord = { x: 1000, y: 800 };
        service.dotsize = 10;
        service['drawingService'].canvas.width = 1000;
        service['drawingService'].canvas.height = 800;

        service.checkHit(service.mouseDownCoord, service['drawingService'].canvas);
        expect(service.anchorHit).toEqual(1);
        expect(service.clickOnAnchor).toEqual(true);
    });

    it(' checkHit should set anchorHit to 2', () => {
        service.mouseDownCoord = { x: 1000, y: 400 };
        service.dotsize = 10;
        service['drawingService'].canvas.width = 1000;
        service['drawingService'].canvas.height = 800;

        service.checkHit(service.mouseDownCoord, service['drawingService'].canvas);
        expect(service.anchorHit).toEqual(2);
        expect(service.clickOnAnchor).toEqual(true);
    });

    it(' checkHit should set anchorHit to 3', () => {
        service.mouseDownCoord = { x: 500, y: 800 };
        service.dotsize = 10;
        service['drawingService'].canvas.width = 1000;
        service['drawingService'].canvas.height = 800;

        service.checkHit(service.mouseDownCoord, service['drawingService'].canvas);
        expect(service.anchorHit).toEqual(3);
        expect(service.clickOnAnchor).toEqual(true);
    });
});
