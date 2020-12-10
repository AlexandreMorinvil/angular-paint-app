import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Description } from '@app/classes/description';
import { Vec2 } from '@app/classes/vec2';
import { ClipBoardService } from '@app/services/clipboard/clipboard.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagnetismService } from '@app/services/magnetism/magnetism.service';
import { SelectionToolService } from './selection-tool.service';
// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:max-file-line-count
export enum Anchors {
    Default = 0,
    TopLeft = 1,
    TopMiddle = 2,
    TopRight = 3,
    MiddleLeft = 4,
    MiddleRight = 5,
    BottomLeft = 6,
    BottomMiddle = 7,
    BottomRight = 8,
}

describe('SelectionToolService', () => {
    let service: SelectionToolService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    // tslint:disable-next-line:prefer-const
    let descriptionSpy: jasmine.SpyObj<Description>;
    let magnetismServiceSpy: jasmine.SpyObj<MagnetismService>;
    // tslint:disable-next-line:prefer-const
    let clipBoardServiceSpy: jasmine.SpyObj<ClipBoardService>;
    const startCoord: Vec2 = { x: 10, y: 10 };
    magnetismServiceSpy = jasmine.createSpyObj('MagnetismService', [
        'getAdjustedPositionFromCenter',
        'getGridHorizontalJumpDistance',
        'getVerticalJumpDistance',
    ]);
    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: Description, useValue: descriptionSpy },
                { provide: MagnetismService, useValue: magnetismServiceSpy },
                { provide: ClipBoardService, useValue: clipBoardServiceSpy },
            ],
        });
        service = TestBed.inject(SelectionToolService);
        (service as any).magnetismService.isActivated = false;
        (service as any).shiftDown = false;
        (service as any).hasDoneFirstRotation = false;
        (service as any).hasDoneFirstTranslation = false;
        (service as any).selectionCreated = false;
        (service as any).hasDoneResizing = false;
        (service as any).arrowDown = false;
        (service as any).clickOnAnchor = false;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should clear pathData', () => {
        (service as any).pathData = [startCoord];
        (service as any).clearPath();
        expect((service as any).pathData).toEqual([]);
    });

    /*it('should give back good mouse position with magnetism on', () => {
        let mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
            shiftKey: false,
        } as MouseEvent;
        (service as any).selectionSize = { x: 25, y: 25 };
        (service as any).magnetismService.isActivated = true;
        const result = (service as any).getPositionFromMouse(mouseEvent, true);
        expect(result).toEqual({ x: 0, y: 0 });
    });*/

    it('should call checkHit with hasDoneFirstRotation to true', () => {
        (service as any).hasDoneFirstRotation = true;
        (service as any).startDownCoord = startCoord;
        (service as any).selectionSize = { x: 50, y: 50 };
        (service as any).angle = 180;
        const baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const previewCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const selectionCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const canvasStub = canvasTestHelper.canvas;
        (service as any).drawingService.baseCtx = baseCtxStub;
        (service as any).drawingService.previewCtx = previewCtxStub;
        (service as any).drawingService.selectionCtx = selectionCtx;
        (service as any).drawingService.canvas = canvasStub;
        (service as any).drawingService.canvas.width = 1000;
        (service as any).drawingService.canvas.height = 800;
        let mouse = { x: 60, y: 60 };
        (service as any).checkHit(mouse);
        expect((service as any).clickOnAnchor).toEqual(true);
        expect((service as any).anchorHit).toEqual(Anchors.TopLeft);

        mouse = { x: 35, y: 60 };
        (service as any).checkHit(mouse);
        expect((service as any).clickOnAnchor).toEqual(true);
        expect((service as any).anchorHit).toEqual(Anchors.TopMiddle);

        mouse = { x: 10, y: 60 };
        (service as any).checkHit(mouse);
        expect((service as any).clickOnAnchor).toEqual(true);
        expect((service as any).anchorHit).toEqual(Anchors.TopRight);

        mouse = { x: 10, y: 10 };
        (service as any).checkHit(mouse);
        expect((service as any).clickOnAnchor).toEqual(true);
        expect((service as any).anchorHit).toEqual(Anchors.BottomRight);

        mouse = { x: 60, y: 10 };
        (service as any).checkHit(mouse);
        expect((service as any).clickOnAnchor).toEqual(true);
        expect((service as any).anchorHit).toEqual(Anchors.BottomLeft);

        mouse = { x: 35, y: 10 };
        (service as any).checkHit(mouse);
        expect((service as any).clickOnAnchor).toEqual(true);
        expect((service as any).anchorHit).toEqual(Anchors.BottomMiddle);

        mouse = { x: 10, y: 35 };
        (service as any).checkHit(mouse);
        expect((service as any).clickOnAnchor).toEqual(true);
        expect((service as any).anchorHit).toEqual(Anchors.MiddleRight);

        mouse = { x: 60, y: 35 };
        (service as any).checkHit(mouse);
        expect((service as any).clickOnAnchor).toEqual(true);
        expect((service as any).anchorHit).toEqual(Anchors.MiddleLeft);
    });

    it('should call calculateRotation and put angle value to 0', () => {
        (service as any).angle = 359;
        const altDown = true;
        const orientation = 1;
        (service as any).calculateRotation(altDown, orientation);
        expect((service as any).angle).toEqual(0);
    });

    it('hitSelection should return the right value depending of the mouse position', () => {
        (service as any).startDownCoord = startCoord;
        (service as any).selectionSize = { x: 25, y: 25 };
        let result: boolean = (service as any).hitSelection(15, 15);
        expect(result).toEqual(true);

        (service as any).startDownCoord = { x: 10, y: 10 };
        (service as any).selectionSize = { x: 25, y: 25 };
        result = (service as any).hitSelection(60, 60);
        expect(result).toEqual(false);

        (service as any).startDownCoord = startCoord;
        (service as any).selectionSize = { x: 25, y: 25 };
        result = (service as any).hitSelection(15, 60);
        expect(result).toEqual(false);

        (service as any).startDownCoord = startCoord;
        (service as any).selectionSize = { x: 25, y: 25 };
        result = (service as any).hitSelection(60, 15);
        expect(result).toEqual(false);
    });

    it('offsetAnchors should set the right value depending of the start point and stop point', () => {
        (service as any).startDownCoord = { x: 100, y: 100 };
        (service as any).pathData = [startCoord];
        let result = (service as any).offsetAnchors((service as any).startDownCoord);
        expect(result).toEqual(startCoord);

        (service as any).startDownCoord = { x: 10, y: 100 };
        (service as any).pathData = [startCoord];
        result = (service as any).offsetAnchors((service as any).startDownCoord);
        expect(result).toEqual(startCoord);

        (service as any).startDownCoord = { x: 100, y: 10 };
        (service as any).pathData = [startCoord];
        result = (service as any).offsetAnchors((service as any).startDownCoord);
        expect(result).toEqual(startCoord);

        (service as any).startDownCoord = { x: 100, y: 100 };
        (service as any).pathData = [{ x: 150, y: 150 }];
        result = (service as any).offsetAnchors((service as any).startDownCoord);
        expect(result).toEqual({ x: 100, y: 100 });
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
        (service as any).selectionSize = { x: 50, y: 50 };
        let keyboardEvent = new KeyboardEvent('keypress', { key: 'ArrowLeft' });
        (service as any).checkArrowHit(keyboardEvent);
        expect((service as any).startDownCoord).toEqual({ x: 97, y: 100 });
        expect((service as any).pathLastCoord).toEqual({ x: 147, y: 150 });
        expect((service as any).arrowPress[0]).toEqual(true);
        expect((service as any).arrowDown).toEqual(true);

        (service as any).arrowDown = false;
        (service as any).startDownCoord = { x: 100, y: 100 };
        (service as any).arrowPress = [0, 0, 0, 0];
        keyboardEvent = new KeyboardEvent('keypress', { key: 'ArrowRight' });
        (service as any).checkArrowHit(keyboardEvent);
        expect((service as any).startDownCoord).toEqual({ x: 103, y: 100 });
        expect((service as any).pathLastCoord).toEqual({ x: 153, y: 150 });
        expect((service as any).arrowPress[1]).toEqual(true);
        expect((service as any).arrowDown).toEqual(true);

        (service as any).arrowDown = false;
        (service as any).startDownCoord = { x: 100, y: 100 };
        (service as any).arrowPress = [0, 0, 0, 0];
        keyboardEvent = new KeyboardEvent('keypress', { key: 'ArrowUp' });
        (service as any).checkArrowHit(keyboardEvent);
        expect((service as any).startDownCoord).toEqual({ x: 100, y: 97 });
        expect((service as any).pathLastCoord).toEqual({ x: 150, y: 147 });
        expect((service as any).arrowPress[2]).toEqual(true);
        expect((service as any).arrowDown).toEqual(true);

        (service as any).arrowDown = false;
        (service as any).startDownCoord = { x: 100, y: 100 };
        (service as any).arrowPress = [0, 0, 0, 0];
        keyboardEvent = new KeyboardEvent('keypress', { key: 'ArrowDown' });
        (service as any).checkArrowHit(keyboardEvent);
        expect((service as any).startDownCoord).toEqual({ x: 100, y: 103 });
        expect((service as any).pathLastCoord).toEqual({ x: 150, y: 153 });
        expect((service as any).arrowPress[3]).toEqual(true);
        expect((service as any).arrowDown).toEqual(true);

        (service as any).arrowDown = false;
        (service as any).startDownCoord = { x: 100, y: 100 };
        (service as any).arrowPress = [0, 0, 0, 0];
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
        (service as any).selectionSize = { x: 20, y: 20 };
        const position = { x: 300, y: 300 };
        let result = (service as any).evenImageStartCoord(position);
        expect(result).toEqual({ x: 290, y: 290 });

        (service as any).selectionSize = { x: 21, y: 20 };
        result = (service as any).evenImageStartCoord(position);
        expect(result).toEqual({ x: 289, y: 290 });

        (service as any).selectionSize = { x: 20, y: 21 };
        result = (service as any).evenImageStartCoord(position);
        expect(result).toEqual({ x: 290, y: 289 });
    });

    it('drawImage should put the image on canvas', () => {
        const baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        (service as any).drawingService.baseCtx = baseCtxStub;
        (service as any).image = new Image(10, 10);
        const position = { x: 0, y: 0 };
        const size: Vec2 = { x: 10, y: 10 };
        (service as any).drawImage(baseCtxStub, (service as any).image, position, size, position, size);
    });

    it('drawnAnchor should draw anchors in the corner of the image', () => {
        const baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const canvasStub = canvasTestHelper.canvas;
        (service as any).drawingService.baseCtx = baseCtxStub;
        (service as any).drawingService.canvas = canvasStub;
        (service as any).drawingService.canvas.width = 1000;
        (service as any).drawingService.canvas.height = 800;
        const size = { x: 25, y: 25 };
        (service as any).startDownCoord = startCoord;
        (service as any).drawnAnchor((service as any).drawingService.baseCtx, size);
        const p = (service as any).drawingService.baseCtx.getImageData((service as any).startDownCoord.x, (service as any).startDownCoord.y, 1, 1)
            .data;
        // tslint:disable:no-bitwise
        const x = '#' + ((1 << 24) + (p[0] << 16) + (p[1] << 8) + p[2]).toString(16).slice(1);
        expect(x).toEqual('#000000');
    });

    it('getAnchorHit should resize the image correctly', () => {
        const baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const previewCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const selectionCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const canvasStub = canvasTestHelper.canvas;
        (service as any).drawingService.baseCtx = baseCtxStub;
        (service as any).drawingService.previewCtx = previewCtxStub;
        (service as any).drawingService.selectionCtx = selectionCtx;
        (service as any).drawingService.canvas = canvasStub;
        (service as any).drawingService.canvas.width = 1000;
        (service as any).drawingService.canvas.height = 800;
        (service as any).selectionSize = { x: 26, y: 26 };
        (service as any).firstSelectionCoord = { x: 0, y: 0 };
        (service as any).image = new Image(26, 26);
        (service as any).angle = 0;
        (service as any).startDownCoord = startCoord;

        (service as any).resizeWidth = 0;
        (service as any).resizeHeight = 0;
        (service as any).resizeStartCoords = { x: 0, y: 0 };
        (service as any).anchorHit = Anchors.TopLeft;
        let position = { x: 60, y: 8 };
        (service as any).getAnchorHit((service as any).drawingService.baseCtx, position, 2);
        expect((service as any).resizeStartCoords).toEqual({ x: 36, y: 36 });
        expect((service as any).resizeWidth).toEqual(24);
        expect((service as any).resizeHeight).toEqual(-28);

        (service as any).resizeWidth = 0;
        (service as any).resizeHeight = 0;
        (service as any).resizeStartCoords = { x: 0, y: 0 };
        (service as any).anchorHit = Anchors.TopMiddle;
        position = { x: 15, y: 0 };
        (service as any).getAnchorHit((service as any).drawingService.baseCtx, position, 2);
        expect((service as any).resizeStartCoords).toEqual({ x: 10, y: 36 });
        expect((service as any).resizeWidth).toEqual(26);
        expect((service as any).resizeHeight).toEqual(-36);

        (service as any).resizeWidth = 0;
        (service as any).resizeHeight = 0;
        (service as any).resizeStartCoords = { x: 0, y: 0 };
        (service as any).anchorHit = Anchors.TopRight;
        position = { x: 8, y: 40 };
        (service as any).getAnchorHit((service as any).drawingService.baseCtx, position, 2);
        expect((service as any).resizeStartCoords).toEqual({ x: 10, y: 36 });
        expect((service as any).resizeWidth).toEqual(-2);
        expect((service as any).resizeHeight).toEqual(4);

        (service as any).resizeWidth = 0;
        (service as any).resizeHeight = 0;
        (service as any).resizeStartCoords = { x: 0, y: 0 };
        (service as any).anchorHit = Anchors.BottomLeft;
        position = { x: 9, y: 8 };
        (service as any).getAnchorHit((service as any).drawingService.baseCtx, position, 2);
        expect((service as any).resizeStartCoords).toEqual({ x: 36, y: 10 });
        expect((service as any).resizeWidth).toEqual(-27);
        expect((service as any).resizeHeight).toEqual(-2);

        (service as any).resizeWidth = 0;
        (service as any).resizeHeight = 0;
        (service as any).resizeStartCoords = { x: 0, y: 0 };
        (service as any).anchorHit = Anchors.BottomMiddle;
        position = { x: 15, y: 60 };
        (service as any).getAnchorHit((service as any).drawingService.baseCtx, position, 2);
        expect((service as any).resizeStartCoords).toEqual({ x: 10, y: 10 });
        expect((service as any).resizeWidth).toEqual(26);
        expect((service as any).resizeHeight).toEqual(50);

        (service as any).resizeWidth = 0;
        (service as any).resizeHeight = 0;
        (service as any).resizeStartCoords = { x: 0, y: 0 };
        (service as any).anchorHit = Anchors.BottomRight;
        position = { x: 60, y: 60 };
        (service as any).getAnchorHit((service as any).drawingService.baseCtx, position, 2);
        expect((service as any).resizeStartCoords).toEqual({ x: 10, y: 10 });
        expect((service as any).resizeWidth).toEqual(50);
        expect((service as any).resizeHeight).toEqual(50);

        (service as any).resizeWidth = 0;
        (service as any).resizeHeight = 0;
        (service as any).resizeStartCoords = { x: 0, y: 0 };
        (service as any).anchorHit = Anchors.MiddleLeft;
        position = { x: 8, y: 23 };
        (service as any).getAnchorHit((service as any).drawingService.baseCtx, position, 2);
        expect((service as any).resizeStartCoords).toEqual({ x: 36, y: 10 });
        expect((service as any).resizeWidth).toEqual(-28);
        expect((service as any).resizeHeight).toEqual(26);

        (service as any).resizeWidth = 0;
        (service as any).resizeHeight = 0;
        (service as any).resizeStartCoords = { x: 0, y: 0 };
        (service as any).anchorHit = Anchors.MiddleRight;
        position = { x: 60, y: 26 };
        (service as any).getAnchorHit((service as any).drawingService.baseCtx, position, 2);
        expect((service as any).resizeStartCoords).toEqual({ x: 10, y: 10 });
        expect((service as any).resizeWidth).toEqual(50);
        expect((service as any).resizeHeight).toEqual(26);
    });

    it('getAnchorHit should resize the image correctly with shiftDown', () => {
        const baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const previewCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const selectionCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        const canvasStub = canvasTestHelper.canvas;
        (service as any).drawingService.baseCtx = baseCtxStub;
        (service as any).drawingService.previewCtx = previewCtxStub;
        (service as any).drawingService.selectionCtx = selectionCtx;
        (service as any).drawingService.canvas = canvasStub;
        (service as any).drawingService.canvas.width = 1000;
        (service as any).drawingService.canvas.height = 800;
        (service as any).selectionSize = { x: 16, y: 9 };
        (service as any).firstSelectionCoord = { x: 0, y: 0 };
        (service as any).image = new Image(16, 9);
        (service as any).angle = 0;
        (service as any).startDownCoord = startCoord;
        (service as any).shiftDown = true;
        (service as any).ratio = 1;

        (service as any).resizeWidth = 0;
        (service as any).resizeHeight = 0;
        (service as any).resizeStartCoords = { x: 0, y: 0 };
        (service as any).anchorHit = Anchors.BottomRight;
        let position = { x: 100, y: 100 };
        (service as any).getAnchorHit((service as any).drawingService.baseCtx, position, 2);
        expect((service as any).resizeStartCoords).toEqual({ x: 10, y: 10 });
        expect((service as any).resizeWidth).toEqual(80);
        expect((service as any).resizeHeight).toEqual(45);

        (service as any).resizeWidth = 0;
        (service as any).resizeHeight = 0;
        (service as any).resizeStartCoords = { x: 0, y: 0 };
        (service as any).anchorHit = Anchors.BottomRight;
        position = { x: 100, y: 50 };
        (service as any).getAnchorHit((service as any).drawingService.baseCtx, position, 2);
        expect((service as any).resizeStartCoords).toEqual({ x: 10, y: 10 });
        expect((service as any).resizeWidth).toEqual(64);
        expect((service as any).resizeHeight).toEqual(36);
    });

    it('adjustEdgePixelCoord should resize the image correctly', () => {
        (service as any).selectionSize = { x: 16, y: 9 };
        (service as any).firstSelectionCoord = { x: 0, y: 0 };
        (service as any).image = new Image(16, 9);
        (service as any).angle = 0;
        (service as any).startDownCoord = startCoord;
        (service as any).shiftDown = true;
        const relativePosition: Vec2 = {
            x: (10 - (service as any).startDownCoord.x) / (service as any).selectionSize.x,
            y: (10 - (service as any).startDownCoord.y) / (service as any).selectionSize.y,
        };
        (service as any).edgePixelsSplitted = [{ edgePixels: [relativePosition] }];
        (service as any).edgePixelsSplittedRelativePosition = [{ edgePixels: [relativePosition] }];

        const result = (service as any).adjustEdgePixelCoord(startCoord, { x: 16, y: 9 });
        const path = new Path2D();
        path.moveTo(relativePosition.x, relativePosition.y);
        expect(result).toEqual(path);
    });
});
