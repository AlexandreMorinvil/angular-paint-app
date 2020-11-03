import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { EllipseSelectionService } from './ellipse-selection.service';
import { SelectionToolService } from './selection-tool.service';

fdescribe('EllipseSelectionService', () => {
    let service: EllipseSelectionService;
    let tracingService: TracingService;
    let colorService: ColorService;
    let selectionToolService: SelectionToolService;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    //let mouseEvent5: MouseEvent;
    let mouseEvent25: MouseEvent;
    let mouseEvent50: MouseEvent;
    let mouseEvent100: MouseEvent;

    let resetTransformSpy: jasmine.Spy<any>;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;

        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(EllipseSelectionService);
        tracingService = TestBed.inject(TracingService);
        colorService = TestBed.inject(ColorService);

        resetTransformSpy = spyOn<any>(service, 'resetTransform').and.callThrough();

        service['tracingService'] = tracingService;
        service['colorService'] = colorService;

        const canvasWidth = 1000;
        const canvasHeight = 800;
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;
        service['drawingService'].canvas.width = canvasWidth;
        service['drawingService'].canvas.height = canvasHeight;
        service['tracingService'] = tracingService;
        /* mouseEvent5 = {
            offsetX: 5,
            offsetY: 5,
            button: 0,
            shiftKey: false,
        } as MouseEvent; */

        mouseEvent25 = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
            shiftKey: false,
        } as MouseEvent;

        mouseEvent50 = {
            offsetX: 50,
            offsetY: 50,
            button: 0,
            shiftKey: false,
        } as MouseEvent;
        mouseEvent100 = {
            offsetX: 100,
            offsetY: 100,
            button: 0,
            shiftKey: false,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be call resetTransform on mouse down,set attribute correctly and create a selection', () => {
        service.onMouseDown(mouseEvent25);

        service.onMouseDown(mouseEvent25);
        service.onMouseMove(mouseEvent50);
        service.onMouseUp(mouseEvent100);

        expect((service as any).arrowPress).toEqual([false, false, false, false]);
        expect((service as any).arrowDown).toBe(false);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect((service as any).mouseDownCoord).toEqual(service.getPositionFromMouse(mouseEvent25));
        expect((service as any).mouseDown).toBeFalse();
        expect(resetTransformSpy).toHaveBeenCalled();
    });

    fit('should set attribute correctly and translate a selection', () => {
        /*  (service as any).selectionCreated = true;
        (service as any).startDownCoord = { x: 0, y: 0 };
        (service as any).imageData = { width: 10, height: 10 }; */
        (selectionToolService as any).pathData = [
            { x: 5, y: 5 },
            { x: 10, y: 10 },
        ];
        service.pathLastCoord = { x: 0, y: 0 };
        service.clearCanvasEllipse();
        //service.onMouseDown(mouseEvent5);
        /* service.onMouseMove(mouseEvent100);
        service.onMouseUp(mouseEvent100);

        service.onMouseDown(mouseEvent50);
        service.onMouseMove(mouseEvent100);
        service.onMouseUp(mouseEvent100); */
    });
});
