import { TestBed } from '@angular/core/testing';
import { InteractionText } from '@app/classes/action/interaction-text';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextService } from './text.service';

// tslint:disable:no-any
describe('TextService', () => {
    let service: TextService;
    let mouseEvent: MouseEvent;
    let showCursorSpy: jasmine.Spy<any>;
    let drawTextSpy: jasmine.Spy<any>;
    let confirmSpy: jasmine.Spy<any>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let keyEventA: KeyboardEvent;
    let keyEventEnter: KeyboardEvent;
    let keyEventDelete: KeyboardEvent;
    let keyEventBackspace: KeyboardEvent;
    let keyEventEscape: KeyboardEvent;
    let keyEventUp: KeyboardEvent;
    let keyEventDown: KeyboardEvent;
    let keyEventLeft: KeyboardEvent;
    let keyEventRight: KeyboardEvent;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(TextService);
        showCursorSpy = spyOn<any>(service, 'showCursor').and.callThrough();
        drawTextSpy = spyOn<any>(service, 'drawText').and.callThrough();
        confirmSpy = spyOn<any>(service, 'confirm').and.callThrough();
        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
            shiftKey: false,
        } as MouseEvent;
        keyEventA = { key: 'a' } as KeyboardEvent;
        keyEventEnter = { key: 'Enter' } as KeyboardEvent;
        keyEventDelete = { key: 'Delete' } as KeyboardEvent;
        keyEventBackspace = { key: 'Backspace' } as KeyboardEvent;
        keyEventEscape = { key: 'Escape' } as KeyboardEvent;
        keyEventUp = { key: 'ArrowUp' } as KeyboardEvent;
        keyEventDown = { key: 'ArrowDown' } as KeyboardEvent;
        keyEventLeft = { key: 'ArrowLeft' } as KeyboardEvent;
        keyEventRight = { key: 'ArrowRight' } as KeyboardEvent;

        (service as any).drawingService.baseCtx = baseCtxStub;
        (service as any).drawingService.previewCtx = previewCtxStub;
        (service as any).drawingService.canvas = canvasStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should open editing mode on click', () => {
        service.onMouseDown(mouseEvent);
        expect((service as any).editingOn).toBe(true);
        expect(showCursorSpy).toHaveBeenCalled();
    });

    it('should add letter to text if a letter is typed after mouse click', () => {
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventA);
        expect((service as any).text[0]).toBe('a');
    });

    it('should not add letter to text the key pressed is not allowed', () => {
        keyEventA = { key: 'Tab' } as KeyboardEvent;
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventA);
        expect((service as any).text[0]).toBe('');
    });

    it('should not add letter to text if a letter is typed before mouse click', () => {
        service.onKeyDown(keyEventA);
        service.onMouseDown(mouseEvent);
        expect((service as any).text[0]).toBe('');
    });
    it('should clear text and close editing mode on escape ', () => {
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventEscape);
        expect((service as any).text[0]).toBe('');
        expect((service as any).editingOn).toBe(false);
    });

    it('should change line on enter ', () => {
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventEnter);
        expect((service as any).text[0]).toBe('a');
        expect((service as any).text[1]).toBe('');
        expect((service as any).numberOfLines).toBe(2);
    });

    it('should not do anthing on backspace if there is nothing to erase', () => {
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventBackspace);
        expect((service as any).text[0]).toBe('');
    });

    it('should erase character on backspace', () => {
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventBackspace);
        expect((service as any).text[0]).toBe('');
    });

    it('should go to previous line if there is nothing on the line and move up all lines after on backspace', () => {
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventEnter);
        service.onKeyDown(keyEventEnter);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventUp);
        service.onKeyDown(keyEventBackspace);
        expect((service as any).text[0]).toBe('a');
        expect((service as any).numberOfLines).toBe(2);
    });

    it('should not do anthing on delete if there is nothing to erase', () => {
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventDelete);
        expect((service as any).text[0]).toBe('');
    });

    it('should erase character on delete', () => {
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventLeft);
        service.onKeyDown(keyEventDelete);
        expect((service as any).text[0]).toBe('');
    });

    it('should merge the next line on delete at the end of a line and move all lines after', () => {
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventEnter);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventEnter);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventUp);
        service.onKeyDown(keyEventUp);
        service.onKeyDown(keyEventDelete);
        expect((service as any).text[0]).toBe('aa');
        expect((service as any).numberOfLines).toBe(2);
    });

    it('should move cursor correctly on arrow down ', () => {
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventEnter);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventUp);
        expect((service as any).cursorPosition).toEqual({ x: 1, y: 0 });
        service.onKeyDown(keyEventLeft);
        expect((service as any).cursorPosition).toEqual({ x: 0, y: 0 });
        service.onKeyDown(keyEventDown);
        expect((service as any).cursorPosition).toEqual({ x: 0, y: 1 });
        service.onKeyDown(keyEventRight);
        expect((service as any).cursorPosition).toEqual({ x: 1, y: 1 });
    });

    it('should not move cursor on arrow down if there is no text in that direction', () => {
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventUp);
        expect((service as any).cursorPosition).toEqual({ x: 0, y: 0 });
        service.onKeyDown(keyEventLeft);
        expect((service as any).cursorPosition).toEqual({ x: 0, y: 0 });
        service.onKeyDown(keyEventDown);
        expect((service as any).cursorPosition).toEqual({ x: 0, y: 0 });
        service.onKeyDown(keyEventRight);
        expect((service as any).cursorPosition).toEqual({ x: 0, y: 0 });
    });

    it('should move cursor to the end of the next line if arrow down is pressed on a line that is longer than the next', () => {
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventEnter);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventUp);
        service.onKeyDown(keyEventRight);
        service.onKeyDown(keyEventDown);
        expect((service as any).cursorPosition).toEqual({ x: 1, y: 1 });
    });

    it('should move cursor to the end of the previous line if arrow up is pressed on a line that is longer than the previous', () => {
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventEnter);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventUp);
        expect((service as any).cursorPosition).toEqual({ x: 1, y: 0 });
    });

    it('should move cursor to the correct position when text is align to the right ', () => {
        (service as any).styleService.setAlignment('droit');
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventEnter);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventUp);
        service.onKeyDown(keyEventLeft);
        service.onKeyDown(keyEventDown);
        expect((service as any).cursorPosition).toEqual({ x: 1, y: 1 });
    });

    it('should move cursor to the correct position when text is align to the center ', () => {
        (service as any).styleService.setAlignment('centre');
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventEnter);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventUp);
        service.onKeyDown(keyEventLeft);
        service.onKeyDown(keyEventDown);
        service.onKeyDown(keyEventRight);
        expect((service as any).cursorPosition).toEqual({ x: 1, y: 1 });
    });

    it('should move cursor to the end of the previous line if arrow left is pressed at the beginning of a line', () => {
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventEnter);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventLeft);
        service.onKeyDown(keyEventLeft);
        expect((service as any).cursorPosition).toEqual({ x: 1, y: 0 });
    });

    it('should move cursor to the beginning of the next line if arrow right is pressed at the end of a line', () => {
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventEnter);
        service.onKeyDown(keyEventA);
        service.onKeyDown(keyEventUp);
        service.onKeyDown(keyEventRight);
        expect((service as any).cursorPosition).toEqual({ x: 0, y: 1 });
    });

    it('should call drawText on execute ', () => {
        service.execute({ text: ['1', '2'], textPosition: { x: 0, y: 0 }, adjustment: 5, numberOfLines: 2 } as InteractionText);
        expect(drawTextSpy).toHaveBeenCalled();
    });

    it('should call drawText on attribute change ', () => {
        (service as any).styleService.setAlignment('centre');
        (service as any).styleService.setHasBold(true);
        (service as any).styleService.setHasItalic(true);

        service.onAttributeChange();
        expect(drawTextSpy).toHaveBeenCalled();
    });

    it('should call confirm on second mouse click ', () => {
        service.onMouseDown(mouseEvent);
        service.onMouseDown(mouseEvent);
        expect(confirmSpy).toHaveBeenCalled();
    });
});
