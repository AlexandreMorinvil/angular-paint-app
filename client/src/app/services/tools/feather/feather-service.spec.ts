/* import { TestBed } from '@angular/core/testing';
import { InteractionPath } from '@app/classes/action/interaction-path';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { FeatherService } from './feather-service';
// tslint:disable:no-any
describe('FeatherService', () => {
    let service: FeatherService;
    let mouseEvent: MouseEvent;
    let keyboardEvent: KeyboardEvent;

    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasStub: HTMLCanvasElement;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let onMouseScrollUpSpy: jasmine.Spy<any>;
    let onMouseScrollDownSpy: jasmine.Spy<any>;
    let featherDrawSpy: jasmine.Spy<any>;
    let resetBorderSpy: jasmine.Spy<any>;
    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(FeatherService);
        onMouseScrollUpSpy = spyOn<any>(service, 'onMouseScrollUp').and.callThrough();
        onMouseScrollDownSpy = spyOn<any>(service, 'onMouseScrollDown').and.callThrough();
        featherDrawSpy = spyOn<any>(service, 'featherDraw').and.callThrough();
        resetBorderSpy = spyOn<any>(service, 'resetBorder').and.callThrough();
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
            shiftKey: false,
            movementY: 0,
        } as MouseEvent;

        keyboardEvent = {} as KeyboardEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it(' onAltDown should set isAltDown to true', () => {
        service.onAltDown(keyboardEvent);
        expect((service as any).isAltDown).toBeTrue();
    });

    it(' onAltUp should set isAltDown to false', () => {
        service.onAltUp(keyboardEvent);
        expect((service as any).isAltDown).toBeFalse();
    });

    it(' onMouseScrollUp should be called', () => {
        service.onMouseScrollUp(mouseEvent);
        expect(onMouseScrollUpSpy).toHaveBeenCalled();
    });

    it(' onMouseScrollUp when alt is not pressed should set angleInRadian correctly ', () => {
        const arbitraryNumber = 345;
        service.onMouseScrollUp(mouseEvent);
        expect((service as any).angleInRadian).toEqual(arbitraryNumber);
        expect(onMouseScrollUpSpy).toHaveBeenCalled();
    });

    it(' onMouseScrollUp when alt is pressed should set angleInRadian correctly ', () => {
        const arbitraryNumber = 359;
        (service as any).isAltDown = true;
        service.onMouseScrollUp(mouseEvent);
        expect((service as any).angleInRadian).toEqual(arbitraryNumber);
        expect(onMouseScrollUpSpy).toHaveBeenCalled();
    });

    it(' onMouseScrollUp else path when angleInRadian is not equal to resetAngle ', () => {
        service.onMouseScrollUp(mouseEvent);
        service.onMouseScrollUp(mouseEvent);
        expect(onMouseScrollUpSpy).toHaveBeenCalled();
    });

    it(' onMouseScrollDown should be called', () => {
        service.onMouseScrollDown(mouseEvent);
        expect(onMouseScrollDownSpy).toHaveBeenCalled();
    });

    it(' onMouseScrollDown when alt is not pressed should set angleInRadian correctly ', () => {
        const arbitraryNumber = 15;
        service.onMouseScrollDown(mouseEvent);
        expect((service as any).angleInRadian).toEqual(arbitraryNumber);
        expect(onMouseScrollDownSpy).toHaveBeenCalled();
    });

    it(' onMouseScrollDown when alt is pressed should set angleInRadian correctly ', () => {
        (service as any).isAltDown = true;
        service.onMouseScrollDown(mouseEvent);
        expect((service as any).angleInRadian).toEqual(1);
        expect(onMouseScrollDownSpy).toHaveBeenCalled();
    });

    it(' onMouseScrollDown else path when angleInRadian is not equal to resetAngle ', () => {
        const nbOfMouseScroll = 25;
        for (let i = 0; i < nbOfMouseScroll; i++) {
            service.onMouseScrollDown(mouseEvent);
        }
        expect(onMouseScrollDownSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should call featherDraw ', () => {
        (service as any).mouseDown = true;
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent);
        service.onMouseUp(mouseEvent);
        expect(featherDrawSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it(' onMouseUp should not call featherDraw if mouseDown was set to false', () => {
        (service as any).mouseDown = false;
        service.onMouseUp(mouseEvent);
        expect(featherDrawSpy).not.toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call featherDraw if mouseDown is true and is inside the Canvas', () => {
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent);

        expect(featherDrawSpy).toHaveBeenCalled();
        expect(resetBorderSpy).toHaveBeenCalled();
    });
    it(' onMouseMove should NOT call featherDraw if mouseDown is true and is outside the canvas', () => {
        const mouseEvent1000 = {
            offsetX: 1000,
            offsetY: 1000,
            shiftKey: false,
        } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent1000);

        expect(featherDrawSpy).not.toHaveBeenCalled();
        expect(resetBorderSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should NOT call featherDraw if mouseDown is true and is outside the canvas', () => {
        const mouseEvent1000 = {
            offsetX: -1000,
            offsetY: -1000,
            shiftKey: false,
        } as MouseEvent;
        service.onMouseDown(mouseEvent);
        service.onMouseMove(mouseEvent1000);

        expect(featherDrawSpy).not.toHaveBeenCalled();
        expect(resetBorderSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should NOT call featherDraw if mouseDown is false', () => {
        const mouseEvent1000 = {
            offsetX: 1000,
            offsetY: 1000,
            shiftKey: false,
        } as MouseEvent;
        service.onMouseDown(mouseEvent1000);
        service.onMouseMove(mouseEvent1000);

        expect(featherDrawSpy).not.toHaveBeenCalled();
        expect(resetBorderSpy).not.toHaveBeenCalled();
    });

    it(' convertDegreeToRad should convert correctly', () => {
        const convertedValue = (service as any).convertDegreeToRad(0);
        expect(convertedValue).toEqual(0);
    });

    it(' clearPath should clear pathData', () => {
        (service as any).clearPath();
        expect((service as any).pathData).toEqual([]);
    });

    it(' resetboarder should set width and height of preview canvas correctly', () => {
        (service as any).resetBorder();
        expect((service as any).drawingService.previewCtx.canvas.width).toEqual((service as any).drawingService.baseCtx.canvas.width);
        expect((service as any).drawingService.previewCtx.canvas.height).toEqual((service as any).drawingService.baseCtx.canvas.height);
    });

    it('should execute and drawLine is called and if is around20Pixels', () => {
        const interaction = {
            path: [
                { x: 0, y: 0 },
                { x: 1, y: 1 },
            ],
        } as InteractionPath;
        service.execute(interaction);
        expect(featherDrawSpy).toHaveBeenCalled();
    });
});
 */
