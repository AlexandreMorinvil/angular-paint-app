import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { LoadService } from './load.service';
// tslint:disable:no-any
describe('LoadService', () => {
    let service: LoadService;
    let colorService: ColorService;
    let tracingService: TracingService;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let dataMock: jasmine.SpyObj<MatDialog>;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasStub: HTMLCanvasElement;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        dataMock = jasmine.createSpyObj('MatDialog', ['closeAll']);
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: MatDialog, useValue: dataMock },
            ],
        });
        const canvasWidth = 1000;
        const canvasHeight = 800;
        service = TestBed.inject(LoadService);
        tracingService = TestBed.inject(TracingService);
        colorService = TestBed.inject(ColorService);
        (service as any).drawingService.baseCtx = baseCtxStub;
        (service as any).drawingService.previewCtx = previewCtxStub;
        (service as any).drawingService.canvas = canvasStub;
        (service as any).drawingService.canvas.width = canvasWidth;
        (service as any).drawingService.canvas.height = canvasHeight;
        (service as any).tracingService = tracingService;
        (service as any).tracingService = colorService;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should load image', () => {
        spyOn(window, 'confirm').and.returnValue(true);
        service.loadDraw('/example');
        service.fillDraw();
        expect(dataMock.closeAll).toHaveBeenCalled();
    });

    it('should not load image', (done) => {
        spyOn(window, 'confirm').and.returnValue(false);
        service.loadDraw('/example');
        service.fillDraw();
        expect(dataMock.closeAll).not.toHaveBeenCalled();
        done();
    });

    it('should no load if the nothing image was given', () => {
        service.loadDraw('assets/images/nothing.png');
        expect(dataMock.closeAll).not.toHaveBeenCalled();
    });

    it('should load given a white canvas', () => {
        (service as any).drawingService.baseCtx.fillStyle = '#FFFFFF';
        (service as any).drawingService.baseCtx.fillRect(
            0,
            0,
            (service as any).drawingService.baseCtx.canvas.width,
            (service as any).drawingService.baseCtx.canvas.height,
        );
        service.loadDraw('/example');
        service.fillDraw();
        expect(dataMock.closeAll).toHaveBeenCalled();
    });
});
