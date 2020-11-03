import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Description } from '@app/classes/description';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionToolService } from './selection-tool.service';

describe('SelectionToolService', () => {
    // tslint:disable:no-any
    // tslint:disable:no-magic-numbers
    let service: SelectionToolService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    // tslint:disable-next-line:prefer-const
    let descriptionSpy: jasmine.SpyObj<Description>;
    const startCoord: Vec2 = { x: 10, y: 10 };

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: Description, useValue: descriptionSpy },
            ],
        });
        service = TestBed.inject(SelectionToolService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onEscapeDown should call clearCanvas and set selectionCreated to false and arrowDown to true', () => {
        (service as any).selectionCreated = true;
        (service as any).arrowDown = false;
        service.onEscapeDown();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect((service as any).selectionCreated).toEqual(false);
        expect((service as any).arrowDown).toEqual(true);
    });

    it('should clear pathData', () => {
        (service as any).pathData = [startCoord];
        (service as any).clearPath();
        expect((service as any).pathData).toEqual([]);
    });

    it('hitSelection should return the right value depending of the mouse position', () => {
        (service as any).startDownCoord = startCoord;
        (service as any).imageData = new Image(25, 25);
        let result: boolean = (service as any).hitSelection(15, 15);
        expect(result).toEqual(true);

        (service as any).startDownCoord = { x: 10, y: 10 };
        (service as any).imageData = new ImageData(25, 25);
        result = (service as any).hitSelection(60, 60);
        expect(result).toEqual(false);

        (service as any).startDownCoord = startCoord;
        (service as any).imageData = new Image(25, 25);
        result = (service as any).hitSelection(15, 60);
        expect(result).toEqual(false);

        (service as any).startDownCoord = startCoord;
        (service as any).imageData = new Image(25, 25);
        result = (service as any).hitSelection(60, 15);
        expect(result).toEqual(false);
    });

    it('offsetAnchors should set the right value depending of the start point and stop point', () => {
        (service as any).startDownCoord = { x: 100, y: 100 };
        (service as any).pathData = [startCoord];
        (service as any).offsetAnchors((service as any).startDownCoord);
        expect((service as any).startDownCoord).toEqual(startCoord);

        (service as any).startDownCoord = { x: 10, y: 100 };
        (service as any).pathData = [startCoord];
        (service as any).offsetAnchors((service as any).startDownCoord);
        expect((service as any).startDownCoord).toEqual(startCoord);

        (service as any).startDownCoord = { x: 100, y: 10 };
        (service as any).pathData = [startCoord];
        (service as any).offsetAnchors((service as any).startDownCoord);
        expect((service as any).startDownCoord).toEqual(startCoord);

        (service as any).startDownCoord = { x: 100, y: 100 };
        (service as any).pathData = [{ x: 150, y: 150 }];
        (service as any).offsetAnchors((service as any).startDownCoord);
        expect((service as any).startDownCoord).toEqual({ x: 100, y: 100 });
    });

    it('getSquaredSize should return a Vec2 containing the same number in the x and y, and the value is the smallest of the in-values', () => {
        (service as any).startDownCoord = { x: 100, y: 100 };
        let position = { x: 250, y: 300 };
        let result = (service as any).getSquaredSize(position);
        expect(result).toEqual({ x: 150, y: 150 });

        position = { x: 300, y: 250 };
        result = (service as any).getSquaredSize(position);
        expect(result).toEqual({ x: 150, y: 150 });

        position = { x: 300, y: 90 };
        result = (service as any).getSquaredSize(position);
        expect(result).toEqual({ x: 10, y: -10 });

        position = { x: 90, y: 250 };
        result = (service as any).getSquaredSize(position);
        expect(result).toEqual({ x: -10, y: 10 });

        position = { x: 90, y: 85 };
        result = (service as any).getSquaredSize(position);
        expect(result).toEqual({ x: -15, y: -15 });
    });

    it('checkArrowHit should set value in arrowPress[] and modify the coords accordingly', () => {
        (service as any).arrowDown = false;
        (service as any).startDownCoord = { x: 100, y: 100 };
        (service as any).arrowPress = [0, 0, 0, 0];
        (service as any).pathLastCoord = { x: 150, y: 150 };
        let keyboardEvent = new KeyboardEvent('keypress', { key: 'ArrowLeft' });
        (service as any).checkArrowHit(keyboardEvent);
        expect((service as any).startDownCoord).toEqual({ x: 97, y: 100 });
        expect((service as any).pathLastCoord).toEqual({ x: 147, y: 150 });
        expect((service as any).arrowPress[0]).toEqual(true);
        expect((service as any).arrowDown).toEqual(true);

        (service as any).arrowDown = false;
        (service as any).startDownCoord = { x: 100, y: 100 };
        (service as any).arrowPress = [0, 0, 0, 0];
        (service as any).pathLastCoord = { x: 150, y: 150 };
        keyboardEvent = new KeyboardEvent('keypress', { key: 'ArrowRight' });
        (service as any).checkArrowHit(keyboardEvent);
        expect((service as any).startDownCoord).toEqual({ x: 103, y: 100 });
        expect((service as any).pathLastCoord).toEqual({ x: 153, y: 150 });
        expect((service as any).arrowPress[1]).toEqual(true);
        expect((service as any).arrowDown).toEqual(true);

        (service as any).arrowDown = false;
        (service as any).startDownCoord = { x: 100, y: 100 };
        (service as any).arrowPress = [0, 0, 0, 0];
        (service as any).pathLastCoord = { x: 150, y: 150 };
        keyboardEvent = new KeyboardEvent('keypress', { key: 'ArrowUp' });
        (service as any).checkArrowHit(keyboardEvent);
        expect((service as any).startDownCoord).toEqual({ x: 100, y: 97 });
        expect((service as any).pathLastCoord).toEqual({ x: 150, y: 147 });
        expect((service as any).arrowPress[2]).toEqual(true);
        expect((service as any).arrowDown).toEqual(true);

        (service as any).arrowDown = false;
        (service as any).startDownCoord = { x: 100, y: 100 };
        (service as any).arrowPress = [0, 0, 0, 0];
        (service as any).pathLastCoord = { x: 150, y: 150 };
        keyboardEvent = new KeyboardEvent('keypress', { key: 'ArrowDown' });
        (service as any).checkArrowHit(keyboardEvent);
        expect((service as any).startDownCoord).toEqual({ x: 100, y: 103 });
        expect((service as any).pathLastCoord).toEqual({ x: 150, y: 153 });
        expect((service as any).arrowPress[3]).toEqual(true);
        expect((service as any).arrowDown).toEqual(true);

        (service as any).arrowDown = false;
        (service as any).startDownCoord = { x: 100, y: 100 };
        (service as any).arrowPress = [0, 0, 0, 0];
        (service as any).pathLastCoord = { x: 150, y: 150 };
        keyboardEvent = new KeyboardEvent('keypress', { key: 'Enter' });
        (service as any).checkArrowHit(keyboardEvent);
        expect((service as any).startDownCoord).toEqual({ x: 100, y: 100 });
        expect((service as any).pathLastCoord).toEqual({ x: 150, y: 150 });
        expect((service as any).arrowPress).toEqual([0, 0, 0, 0]);
        expect((service as any).arrowDown).toEqual(false);
    });

    it('checkArrowUnhit should set value in arrowPress[] and modify the coords accordingly', () => {
        (service as any).arrowPress = [1, 0, 0, 0];
        let keyboardEvent = new KeyboardEvent('keyup', { key: 'ArrowLeft' });
        (service as any).checkArrowUnhit(keyboardEvent);
        expect((service as any).arrowPress[0]).toEqual(false);

        (service as any).arrowPress = [0, 1, 0, 0];
        keyboardEvent = new KeyboardEvent('keyup', { key: 'ArrowRight' });
        (service as any).checkArrowUnhit(keyboardEvent);
        expect((service as any).arrowPress[1]).toEqual(false);

        (service as any).arrowPress = [0, 0, 1, 0];
        keyboardEvent = new KeyboardEvent('keyup', { key: 'ArrowUp' });
        (service as any).checkArrowUnhit(keyboardEvent);
        expect((service as any).arrowPress[2]).toEqual(false);

        (service as any).arrowPress = [0, 0, 0, 1];
        keyboardEvent = new KeyboardEvent('keyup', { key: 'ArrowDown' });
        (service as any).checkArrowUnhit(keyboardEvent);
        expect((service as any).arrowPress[3]).toEqual(false);

        (service as any).arrowPress = [0, 0, 0, 1];
        keyboardEvent = new KeyboardEvent('keyup', { key: 'Enter' });
        (service as any).checkArrowUnhit(keyboardEvent);
        expect((service as any).arrowPress).toEqual([0, 0, 0, 1]);
    });

    it('evenImageStartCoord return the startCoord even upwards', () => {
        (service as any).imageData = new Image(25, 25);
        const position = { x: 300, y: 300 };
        let result = (service as any).evenImageStartCoord(position);
        expect(result).toEqual({ x: 287, y: 287 });

        (service as any).imageData = new Image(26, 25);
        result = (service as any).evenImageStartCoord(position);
        expect(result).toEqual({ x: 287, y: 287 });

        (service as any).imageData = new Image(25, 26);
        result = (service as any).evenImageStartCoord(position);
        expect(result).toEqual({ x: 287, y: 287 });

        (service as any).imageData = new Image(26, 26);
        result = (service as any).evenImageStartCoord(position);
        expect(result).toEqual({ x: 287, y: 287 });
    });

    it('putImageData should put the imageData on canvas', () => {
        // tslint:disable:no-string-literal
        const baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service['drawingService'].baseCtx = baseCtxStub;
        (service as any).imageData = new ImageData(1, 1);
        const position = { x: 50, y: 50 };
        (service as any).putImageData(position, baseCtxStub, (service as any).imageData);
    });

    it('drawImage should put the image on canvas', () => {
        // tslint:disable:no-string-literal
        const baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service['drawingService'].baseCtx = baseCtxStub;
        (service as any).image = new Image(10, 10);
        const position = { x: 0, y: 0 };
        (service as any).imageData = new ImageData(10, 10);
        (service as any).drawImage(baseCtxStub, position, position, position, (service as any).image);
    });

    it('getOldImageData should return the good imageData', () => {
        // tslint:disable:no-string-literal
        const baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service['drawingService'].baseCtx = baseCtxStub;
        const position = { x: 15, y: 15 };
        (service as any).startDownCoord = { x: 10, y: 10 };
        let result: ImageData = (service as any).getOldImageData(position);
        expect(result.width).toEqual(10);
        expect(result.height).toEqual(10); // Double cause mouse is in the middle of the selection

        (service as any).startDownCoord = { x: 15, y: 15 };
        result = (service as any).getOldImageData(position);
        expect(result.width).toEqual(1);
        expect(result.height).toEqual(1); // Default height and width
    });

    it('drawnAnchor should draw anchors in the corner of the imageData', () => {
        // tslint:disable:no-string-literal
        const baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const canvasStub = canvasTestHelper.canvas;
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].canvas = canvasStub;
        service['drawingService'].canvas.width = 1000;
        service['drawingService'].canvas.height = 800;
        (service as any).imageData = startCoord;
        (service as any).startDownCoord = startCoord;
        (service as any).drawnAnchor(service['drawingService'].baseCtx, service['drawingService'].canvas);
        const p = service['drawingService'].baseCtx.getImageData((service as any).startDownCoord.x, (service as any).startDownCoord.y, 1, 1).data;
        // tslint:disable:no-bitwise
        const x = '#' + ((1 << 24) + (p[0] << 16) + (p[1] << 8) + p[2]).toString(16).slice(1);
        expect(x).toEqual('#000000');
    });
});
