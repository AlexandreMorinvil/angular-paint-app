import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '../drawing/drawing.service';
// import { DrawingService } from '@app/services/drawing/drawing.service';
import { ClipBoardService } from './clipboard.service';

// tslint:disable:no-any
describe('ClipBoardService', () => {
    let service: ClipBoardService;
    let drawingService: DrawingService;
    let computeDimensionsSpy: jasmine.Spy<any>;
    let computeCenterSpy: jasmine.Spy<any>;
    let computeUpperLeftCornerSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClipBoardService);

        drawingService = TestBed.inject(DrawingService);
        drawingService.canvas = canvasTestHelper.canvas;
        drawingService.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingService.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        drawingService.selectionCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        (service as any).drawingService.previewCtx = drawingService.previewCtx;
        service.canvas = canvasTestHelper.drawCanvas;
        service.clipboardCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    });

    fit('should be created', () => {
        expect(service).toBeTruthy();
    });

    fit('should store the image procided with the right selection size', () => {
        computeDimensionsSpy = spyOn<any>(service, 'computeDimensions').and.callThrough();
        computeCenterSpy = spyOn<any>(service, 'computeCenter').and.callThrough();
        computeUpperLeftCornerSpy = spyOn<any>(service, 'computeUpperLeftCorner').and.callThrough();

        const START_COORD: Vec2 = { x: 10, y: 10 };
        const DIMENSIONS: Vec2 = { x: 20, y: 20 };
        const ANGLE = 20;
        service.memorize(START_COORD, DIMENSIONS, ANGLE);

        expect(computeDimensionsSpy).toHaveBeenCalled();
        expect(computeCenterSpy).toHaveBeenCalled();
        expect(computeUpperLeftCornerSpy).toHaveBeenCalled();
    });

    fit('should return the data URL of the data stored', () => {
        expect(service.provide()).toBe((new Image()).src);
    });

    fit('should return the height of the image stored', () => {
        expect(service.getHeight()).toBe(service.canvas.height);
    });

    fit('should return the width of the image stored', () => {
        expect(service.getWidth()).toBe(service.canvas.width);
    });
});
