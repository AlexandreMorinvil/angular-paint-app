import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { AerosolService } from './aerosol.service';

// The disablement of the "any" tslint rule is justified in this situation as the prototype
// of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
// tslint:disable:no-any
describe('AerosolService', () => {
    let service: AerosolService;
    let mouseEvent: MouseEvent;
    // let colorService: ColorService;
    // let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    // let baseCtxStub: CanvasRenderingContext2D;
    // let previewCtxStub: CanvasRenderingContext2D;
    // let canvasStub: HTMLCanvasElement;

    // let sprayPaintSpy: jasmine.Spy<any>;
    // let setAttributeSpy: jasmine.Spy<any>;

    beforeEach(() => {
        // baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        // previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        // canvasStub = canvasTestHelper.canvas;
        // drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            // providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(AerosolService);

        // colorService = TestBed.inject(ColorService);
        // sprayPaintSpy = spyOn<any>(service, 'sprayPaint').and.callThrough();
        // setAttributeSpy = spyOn<any>(service, 'setAttribute').and.callThrough();

        // const canvasWidth = 1000;
        // const canvasHeight = 800;

        // (service as any).drawingService.baseCtx = baseCtxStub;
        // (service as any).drawingService.previewCtx = previewCtxStub;
        // (service as any).drawingService.canvas = canvasStub;
        // (service as any).drawingService.canvas.width = canvasWidth;
        // (service as any).drawingService.canvas.height = canvasHeight;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' mouseMove should set mousePosition to correct position if mouse is already down', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.mouseDown = true;
        service.onMouseMove(mouseEvent);
        const result = (service as any).pathData[0];
        expect(result).toEqual(expectedResult);
    });

    it(' mouseMove should not set mousePosition to correct position if mouse is not already down', () => {
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        const result = (service as any).pathData[0];
        expect(result).toEqual(undefined);
    });
});
