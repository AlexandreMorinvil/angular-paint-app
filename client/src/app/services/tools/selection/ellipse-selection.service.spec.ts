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
    let selectionTool: SelectionToolService;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    let mouseEvent: MouseEvent;

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
        service['arrowCoord'];
        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
            shiftKey: false,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be call resetTransform on mouse down and set attribute correctly', () => {
        service.onMouseDown(mouseEvent);
        expect(resetTransformSpy).toHaveBeenCalled();

        expect((selectionTool as any).arrowPress).toBe([false, false, false, false]);
        expect((selectionTool as any).arrowDown).toBe(false);
        expect(resetTransformSpy).toHaveBeenCalled();
        expect(resetTransformSpy).toHaveBeenCalled();
    });
});
