import { Overlay } from '@angular/cdk/overlay';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';
import { BrushService } from '@app/services/tools/brush/brush-service';
import { CursorService } from '@app/services/tools/cursor/cursor.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { EraserService } from '@app/services/tools/eraser/eraser-service';
import { LineService } from '@app/services/tools/line/line-service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { WorkzoneSizeService } from '@app/services/workzone-size-service/workzone-size.service';
import { DrawingComponent } from './drawing.component';
class ToolStub extends Tool {}

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let toolboxService: ToolboxService;
    let cursor: CursorService;
    let pencil: PencilService;
    let brush: BrushService;
    let eraser: EraserService;
    let rectangle: RectangleService;
    let ellipse: EllipseService;
    let line: LineService;
    // tslint:disable:no-any
    let clearCanvasSpy: jasmine.Spy<any>;
    let resetDrawingSpy: jasmine.Spy<any>;
    let onShiftDownSpy: jasmine.Spy<any>;
    let onShiftUpSpy: jasmine.Spy<any>;
    let onEscapeDownSpy: jasmine.Spy<any>;
    let onBackspaceDownSpy: jasmine.Spy<any>;
    let onResizeSpy: jasmine.Spy<any>;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService, {} as Description);
        drawingStub = new DrawingService();

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            imports: [MatDialogModule],
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                PencilService,
                BrushService,
                RectangleService,
                EllipseService,
                CursorService,
                EraserService,
                LineService,
                ToolboxService,
                WorkzoneSizeService,
                MatDialog,
                Overlay,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        pencil = TestBed.inject(PencilService);
        brush = TestBed.inject(BrushService);
        rectangle = TestBed.inject(RectangleService);
        ellipse = TestBed.inject(EllipseService);
        cursor = TestBed.inject(CursorService);
        eraser = TestBed.inject(EraserService);
        line = TestBed.inject(LineService);
        toolboxService = TestBed.inject(ToolboxService);
        component = fixture.componentInstance;
        // tslint:disable:no-any
        // tslint:disable:no-string-literal
        clearCanvasSpy = spyOn<any>(drawingStub, 'clearCanvas').and.callThrough();
        resetDrawingSpy = spyOn<any>(drawingStub, 'resetDrawing').and.callThrough();
        onResizeSpy = spyOn<any>(component['workzoneSizeService'], 'onResize');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get stubTool', () => {
        toolboxService.setSelectedTool(toolStub);
        const currentTool = component.toolbox.getCurrentTool();
        expect(currentTool).toEqual(toolStub);
    });

    it('should call the tools mouse move when receiving a mouse move event', () => {
        toolboxService.setSelectedTool(toolStub);
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseMove');
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('should call the tools mouse down when receiving a mouse down event', () => {
        toolboxService.setSelectedTool(toolStub);
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDown');
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('should call the tools mouse up when receiving a mouse up event', () => {
        toolboxService.setSelectedTool(toolStub);
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseUp');
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('should call onMouseClick of current tool', () => {
        toolboxService.setSelectedTool(toolStub);
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseClick');
        component.onMouseClick(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('should call onMouseDblClick of current tool', () => {
        toolboxService.setSelectedTool(toolStub);
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDblClick');
        component.onMouseDblClick(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('should call the tool onShiftUp', () => {
        toolboxService.setSelectedTool(toolStub);
        onShiftUpSpy = spyOn<any>(toolStub, 'onShiftUp');
        const event = new KeyboardEvent('keyup', { key: 'Shift' });
        component.keyEventUp(event);
        expect(onShiftUpSpy).toHaveBeenCalled();
    });

    it('should call onShiftDown event', () => {
        toolboxService.setSelectedTool(toolStub);
        onShiftDownSpy = spyOn<any>(toolStub, 'onShiftDown');
        const eventShift = new KeyboardEvent('keydown', { key: 'Shift' });
        component.onShiftDown(eventShift);
        expect(onShiftDownSpy).toHaveBeenCalled();
    });

    it('should call onEscapeDown', () => {
        toolboxService.setSelectedTool(toolStub);
        onEscapeDownSpy = spyOn<any>(toolStub, 'onEscapeDown');
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        component.onShiftDown(event);
        expect(onEscapeDownSpy).toHaveBeenCalled();
    });

    it('should not call onEscapeDown', () => {
        toolboxService.setSelectedTool(toolStub);
        onEscapeDownSpy = spyOn<any>(toolStub, 'onEscapeDown');
        onShiftDownSpy = spyOn<any>(toolStub, 'onShiftDown');
        const event = new KeyboardEvent('keydown', { key: '6' });
        component.onShiftDown(event);
        expect(onEscapeDownSpy).not.toHaveBeenCalled();
        expect(onShiftDownSpy).not.toHaveBeenCalled();
    });

    it('should call the tool onBackspaceDown', () => {
        toolboxService.setSelectedTool(toolStub);
        onBackspaceDownSpy = spyOn<any>(toolStub, 'onBackspaceDown');
        const event = new KeyboardEvent('keydown', { key: 'Backspace' });
        component.keyEventUp(event);
        expect(onBackspaceDownSpy).toHaveBeenCalled();
    });

    it('should call the tool pencil when pressing the key C', () => {
        const event = new KeyboardEvent('keyup', { key: 'C' });
        component.keyEventUp(event);
        expect(toolboxService.getCurrentTool()).toBe(pencil);
    });

    it('should call the tool cursor when pressing the key Y', () => {
        const event = new KeyboardEvent('keyup', { key: 'Y' });
        component.keyEventUp(event);
        expect(toolboxService.getCurrentTool()).toBe(cursor);
    });

    it('should call the tool line when pressing the key L', () => {
        const event = new KeyboardEvent('keyup', { key: 'L' });
        component.keyEventUp(event);
        expect(toolboxService.getCurrentTool()).toBe(line);
    });

    it('should call the tool eraser when pressing the key E', () => {
        const event = new KeyboardEvent('keyup', { key: 'E' });
        component.keyEventUp(event);
        expect(toolboxService.getCurrentTool()).toBe(eraser);
    });

    it('should call the tool brush when pressing the key W', () => {
        const event = new KeyboardEvent('keyup', { key: 'W' });
        component.keyEventUp(event);
        expect(toolboxService.getCurrentTool()).toBe(brush);
    });

    it('should call the tool rectangle when pressing the key 1', () => {
        const event = new KeyboardEvent('keyup', { key: '1' });
        component.keyEventUp(event);
        expect(toolboxService.getCurrentTool()).toBe(rectangle);
    });

    it('should call the ellipse tool when receiving the keyup event of 2', () => {
        const event = new KeyboardEvent('keyup', { key: '2' });
        component.keyEventUp(event);
        expect(toolboxService.getCurrentTool()).toBe(ellipse);
    });

    it('should call no tool by default', () => {
        const event = new KeyboardEvent('keyup', { key: 'default' });
        component.keyEventUp(event);
    });

    it('should reset the drawing', () => {
        drawingStub.resetDrawing();
        expect(clearCanvasSpy).toHaveBeenCalled();
    });

    it('should call resetDrawing and ask before delete with answer true', () => {
        component.hasBeenDrawnOnto = true;
        const event = new KeyboardEvent('keyup', { key: 'o' });
        spyOn(window, 'confirm').and.returnValue(true);
        component.createNewDrawingKeyboardEvent(event);
        expect(resetDrawingSpy).toHaveBeenCalled();
    });

    it('should call resetDrawing and not ask before delete', () => {
        component.hasBeenDrawnOnto = false;
        const event = new KeyboardEvent('keyup', { key: 'o' });
        component.createNewDrawingKeyboardEvent(event);
        expect(resetDrawingSpy).toHaveBeenCalled();
    });

    it('should call onResize', () => {
        component.onResize(new Event('resize'));
        expect(onResizeSpy).toHaveBeenCalled();
    });
});
