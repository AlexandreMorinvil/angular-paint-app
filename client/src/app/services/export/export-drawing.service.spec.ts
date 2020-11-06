import { TestBed } from '@angular/core/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportDrawingService } from '@app/services/export/export-drawing.service';
// tslint:disable:no-any
describe('ExportDrawingService', () => {
    let service: ExportDrawingService;
    let canvasStub: HTMLCanvasElement;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let saveSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        TestBed.configureTestingModule({
            providers: [{ provide: MAT_DIALOG_DATA, useValue: {} }, { provide: MatDialog, useValue: {} }, DrawingService],
        });
        service = TestBed.inject(ExportDrawingService);

        (service as any).drawingService.baseCtx = baseCtxStub;
        (service as any).drawingService.previewCtx = previewCtxStub;
        (service as any).drawingService.canvas = canvasStub;

        // tslint:disable:no-magic-numbers
        (service as any).drawingService.canvas.width = 1000;
        (service as any).drawingService.canvas.height = 800;

        saveSpy = spyOn<any>((service as any).drawingService.baseCtx, 'save').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('applyFilter should applyFilter', () => {
        expect(service).toBeTruthy();
    });

    it('export should trigger context save', () => {
        service.currentFilter = 'aucun';
        service.exportDraw('dessin', 'jpeg');
        expect(baseCtxStub.globalCompositeOperation).toEqual('source-over');
        expect(baseCtxStub.fillStyle).toEqual('#000000');
        expect(saveSpy).toHaveBeenCalled();
    });

    it('ExportDraw with filter set to aucun should trigger download', () => {
        const spy = spyOn<any>(service, 'downloadImage');
        service.currentFilter = 'aucun';
        service.exportDraw('dessin', 'jpeg');

        expect(spy).toHaveBeenCalled();
    });

    it('ExportDraw with filter set to blur should trigger download', () => {
        const spy = spyOn<any>(service, 'downloadImage');
        service.currentFilter = 'blur';
        service.exportDraw('dessin', 'jpeg');

        expect(spy).toHaveBeenCalled();
    });

    it('ExportDraw with filter set to sepia should trigger download', () => {
        const spy = spyOn<any>(service, 'downloadImage');
        service.currentFilter = 'sepia';
        service.exportDraw('dessin', 'jpeg');

        expect(spy).toHaveBeenCalled();
    });

    it('ExportDraw with filter set to grayscale should trigger download', () => {
        const spy = spyOn<any>(service, 'downloadImage');
        service.currentFilter = 'grayscale';
        service.exportDraw('dessin', 'jpeg');

        expect(spy).toHaveBeenCalled();
    });

    it('ExportDraw with filter set to saturate should trigger download', () => {
        const spy = spyOn<any>(service, 'downloadImage');
        service.currentFilter = 'saturate';
        service.exportDraw('dessin', 'jpeg');

        expect(spy).toHaveBeenCalled();
    });
    it('ExportDraw with filter set to invert should trigger download', () => {
        const spy = spyOn<any>(service, 'downloadImage');
        service.currentFilter = 'invert';
        service.exportDraw('dessin', 'jpeg');

        expect(spy).toHaveBeenCalled();
    });

    it('apply filter with filter set to aucun should apply filter', () => {
        document.getElementById = jasmine.createSpy('HTMLCanvasElement').and.returnValue(canvasStub);
        service.applyFilter('aucun');
        expect((service as any).ctx.filter).toEqual('none');
    });

    it('apply filter with filter set to blur should apply filter', () => {
        document.getElementById = jasmine.createSpy('HTMLCanvasElement').and.returnValue(canvasStub);
        service.applyFilter('blur');
        expect((service as any).ctx.filter).toEqual('blur(10px)');
    });

    it('apply filter with filter set to grayscale should apply filter', () => {
        document.getElementById = jasmine.createSpy('HTMLCanvasElement').and.returnValue(canvasStub);
        service.applyFilter('grayscale');
        expect((service as any).ctx.filter).toEqual('grayscale(100%)');
    });

    it('apply filter with filter set to sepia should apply filter', () => {
        document.getElementById = jasmine.createSpy('HTMLCanvasElement').and.returnValue(canvasStub);
        service.applyFilter('sepia');
        expect((service as any).ctx.filter).toEqual('sepia(100%)');
    });

    it('apply filter with filter set to saturate should apply filter', () => {
        document.getElementById = jasmine.createSpy('HTMLCanvasElement').and.returnValue(canvasStub);
        service.applyFilter('saturate');
        expect((service as any).ctx.filter).toEqual('saturate(100%)');
    });

    it('apply filter with filter set to invert should apply filter', () => {
        document.getElementById = jasmine.createSpy('HTMLCanvasElement').and.returnValue(canvasStub);
        service.applyFilter('invert');
        expect((service as any).ctx.filter).toEqual('invert(100%)');
    });
});
