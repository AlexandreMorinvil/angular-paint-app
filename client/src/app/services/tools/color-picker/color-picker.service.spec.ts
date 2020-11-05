/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ColorPickerService } from './color-picker.service';

describe('Service: ColorPicker', () => {
    let service: ColorPickerService;
    let canvasStub: HTMLCanvasElement;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        TestBed.configureTestingModule({
            providers: [ColorPickerService],
        });
        service = TestBed.inject(ColorPickerService);

        // tslint:disable: no-any
        (service as any).drawingService.baseCtx = baseCtxStub;
        (service as any).drawingService.previewCtx = previewCtxStub;
        (service as any).drawingService.canvas = canvasStub;

        // tslint:disable:no-magic-numbers
        (service as any).drawingService.canvas.width = 1000;
        (service as any).drawingService.canvas.height = 800;

        // imageDataSpy = spyOn<any>((service as any).drawingService.baseCtx, 'save').and.callThrough();
    });

    it('it should be created', () => {
        expect(service).toBeTruthy();
    });

    it('it should convert component to HEX with length 1', () => {
        // tslint:disable-next-line: no-any
        const val = (service as any).componentToHex(1);
        expect(val).toEqual('01');
    });

    it('it should convert component to HEX with length 2', () => {
        const input = 200;
        // tslint:disable-next-line: no-any
        const val = (service as any).componentToHex(input);
        expect(val).toEqual('c8');
    });

    it('it should convert white to hex string', () => {
        // tslint:disable-next-line: no-any
        const val = (service as any).rgbColorToHEXString(0, 0, 0);
        expect(val).toEqual('#000000');
    });

    it('it should convert color to hex string', () => {
        const r = 85;
        const g = 123;
        const b = 205;
        // tslint:disable-next-line: no-any
        const val = (service as any).rgbColorToHEXString(r, g, b);
        expect(val).toEqual('#557bcd');
    });

    it('left-click should trigger setPrimaryColor', () => {
        const setPrimaryColorSpy = spyOn<any>((service as any).colorService, 'setPrimaryColor');
        const ev1 = new MouseEvent('mousedown', {
            button: 0,
        });

        service.onMouseDown(ev1);
        expect(setPrimaryColorSpy).toHaveBeenCalled();
    });

    it('right-click should trigger setSecondaryColor', () => {
        const setSecondaryColorSpy = spyOn<any>((service as any).colorService, 'setSecondaryColor');
        const ev1 = new MouseEvent('mousedown', {
            button: 2,
        });

        service.onMouseDown(ev1);
        expect(setSecondaryColorSpy).toHaveBeenCalled();
    });

    it('on MouseMove should call visualizeColorPixel', () => {
        const visualizeColorSpy = spyOn<any>(service, 'visualizeColorPixel');
        const ev1 = new MouseEvent('mousemove');

        service.onMouseMove(ev1);
        expect(visualizeColorSpy).toHaveBeenCalled();
    });

    it('on MouseMove should call updatePrevisualizationData', () => {
        const updatePrevisualizationDataSpy = spyOn<any>(service, 'updatePrevisualizationData');
        const ev1 = new MouseEvent('mousemove');

        service.onMouseMove(ev1);
        expect(updatePrevisualizationDataSpy).toHaveBeenCalled();
    });
});
