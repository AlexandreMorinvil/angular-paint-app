import { TestBed } from '@angular/core/testing';
import { InteractionPaint } from '@app/classes/action/interaction-paint';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
// import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { PaintService } from './paint.service';

describe('PaintService', () => {
    let service: PaintService;
    // let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let colorService: ColorService;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    // The disablement of the "any" tslint rule is justified in this situation as the prototype
    // of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
    // tslint:disable:no-any
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
        // tslint:disable:no-any
        sameColorFillSpy = spyOn<any>(service, 'sameColorFill').and.callThrough();
        floodFillSpy = spyOn<any>(service, 'floodFill').and.callThrough();

        const canvasWidth = 1000;
        const canvasHeight = 800;
        colorService.setPrimaryColor('#050505');
        // tslint:disable:no-magic-numbers
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;
        service['drawingService'].canvas.width = canvasWidth;
        service['drawingService'].canvas.height = canvasHeight;
        service['colorService'] = colorService;
        // No need to justify numbers to create a mock rectangles
        // tslint:disable:no-magic-numbers
        service['drawingService'].baseCtx.fillStyle = '#000000';
        service['drawingService'].baseCtx.fillRect(0, 0, 1000, 800);
        service['drawingService'].baseCtx.fillStyle = '#010101';
        service['drawingService'].baseCtx.fillRect(200, 200, 25, 25);
        service['drawingService'].baseCtx.fillStyle = '#000100';
        service['drawingService'].baseCtx.fillRect(50, 50, 50, 50);

        // mouseEvent = {
        //     offsetX: 25,
        //     offsetY: 25,
        //     button: 0,
        // } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it(' Left click should call floodFill ', () => {
    //     service.onMouseDown(mouseEvent);
    //     expect(floodFillSpy).toHaveBeenCalled();
    // });

    // it(' Right click should call sameColorFill ', () => {
    //     let mouseEvent2 = {
    //         offsetX: 25,
    //         offsetY: 25,
    //         button: 2,
    //     } as MouseEvent;
    //     service.onMouseDown(mouseEvent2);
    //     expect(sameColorFillSpy).toHaveBeenCalled();
    // });

    // it(' should make sure that matchStartColor verify correctly with fill rgb and target surface', () => {
    //     colorService.setPrimaryColor('#010102');

    //     let mouseEvent2 = {
    //         offsetX: 200,
    //         offsetY: 200,
    //         button: 0,
    //     } as MouseEvent;
    //     service.onMouseDown(mouseEvent2);

    //     expect(floodFillSpy).toHaveBeenCalled();
    // });

    it(' should make sure that function are not called if mouseEvent is not in canvas', () => {
        const mouseEvent2 = {
            offsetX: 0,
            offsetY: 2000,
            button: 0,
        } as MouseEvent;
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
        service.execute(interactionPaint);
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
        service.execute(interactionPaint);
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
        service.execute(interactionPaint);
        expect(sameColorFillSpy).not.toHaveBeenCalled();
        expect(floodFillSpy).not.toHaveBeenCalled();
    });
});
