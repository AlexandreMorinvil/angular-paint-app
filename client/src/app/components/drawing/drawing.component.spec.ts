import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ModalHandlerService } from '@app/services/modal-handler/modal-handler';
import { GridOpacityService } from '@app/services/tool-modifier/grid-opacity/grid-opacity.service';
import { SpacingService } from '@app/services/tool-modifier/spacing/spacing.service';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';
import { BrushService } from '@app/services/tools/brush/brush.service';
import { CursorService } from '@app/services/tools/cursor/cursor.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse.service';
import { EraserService } from '@app/services/tools/eraser/eraser.service';
import { GridService } from '@app/services/tools/grid/grid.service';
import { LineService } from '@app/services/tools/line/line.service';
import { PencilService } from '@app/services/tools/pencil/pencil.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle.service';
import { WorkzoneSizeService } from '@app/services/workzone-size-service/workzone-size.service';
import { DrawingComponent } from './drawing.component';
class ToolStub extends Tool {}
// tslint:disable:no-any
// tslint:disable:max-file-line-count
describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let toolStub: ToolStub;
    let gridStub: GridService;
    let drawingStub: DrawingService;
    let toolboxService: ToolboxService;
    let modalHandlerService: ModalHandlerService;
    let tracker: DrawingStateTrackerService;
    let cursor: CursorService;
    let pencil: PencilService;
    let brush: BrushService;
    let eraser: EraserService;
    let rectangle: RectangleService;
    let ellipse: EllipseService;
    let line: LineService;
    let clearCanvasSpy: jasmine.Spy<any>;
    let resetDrawingSpy: jasmine.Spy<any>;
    let onShiftDownSpy: jasmine.Spy<any>;
    let onShiftUpSpy: jasmine.Spy<any>;
    let onEscapeDownSpy: jasmine.Spy<any>;
    let onBackspaceDownSpy: jasmine.Spy<any>;
    let onResizeSpy: jasmine.Spy<any>;
    let onArrowDownSpy: jasmine.Spy<any>;
    let onCtrlADownSpy: jasmine.Spy<any>;
    let openSaveDialogSpy: jasmine.Spy<any>;
    let openDrawingCarouselDialogSpy: jasmine.Spy<any>;
    let openExportDialogSpy: jasmine.Spy<any>;
    let onCtrlZDownSpy: jasmine.Spy<any>;
    let onCtrlShiftZDownSpy: jasmine.Spy<any>;
    let onArrowUpSpy: jasmine.Spy<any>;

    beforeEach(
        waitForAsync(() => {
            toolStub = new ToolStub({} as DrawingService, {} as Description);
            drawingStub = new DrawingService({} as WorkzoneSizeService, {} as GridService);
            gridStub = new GridService({} as SpacingService, {} as GridOpacityService);

            TestBed.configureTestingModule({
                declarations: [DrawingComponent],
                imports: [MatDialogModule],
                providers: [
                    { provide: DrawingService, useValue: drawingStub },
                    { provide: GridService, useValue: gridStub },
                    PencilService,
                    BrushService,
                    RectangleService,
                    EllipseService,
                    CursorService,
                    EraserService,
                    LineService,
                    ToolboxService,
                    ModalHandlerService,
                    DrawingStateTrackerService,
                    WorkzoneSizeService,
                    MatDialog,
                    Overlay,
                ],
            }).compileComponents();
        }),
    );

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
        modalHandlerService = TestBed.inject(ModalHandlerService);
        tracker = TestBed.inject(DrawingStateTrackerService);
        component = fixture.componentInstance;
        clearCanvasSpy = spyOn<any>(drawingStub, 'clearCanvas').and.callThrough();
        resetDrawingSpy = spyOn<any>(drawingStub, 'resetDrawing').and.callThrough();
        onResizeSpy = spyOn<any>((component as any).workzoneSizeService, 'onResize');
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

    it('should not call onArrowDown', () => {
        toolboxService.setSelectedTool(toolStub);
        onArrowDownSpy = spyOn<any>(toolStub, 'onArrowDown');
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        component.onShiftDown(event);
        expect(onArrowDownSpy).toHaveBeenCalled();
    });

    it('should not call onCtrlADown', () => {
        toolboxService.setSelectedTool(toolStub);
        onCtrlADownSpy = spyOn<any>(toolStub, 'onCtrlADown');
        const event = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true });
        component.onShiftDown(event);
        expect(onCtrlADownSpy).toHaveBeenCalled();
    });

    it('should not call openSaveDialog', () => {
        toolboxService.setSelectedTool(toolStub);
        openSaveDialogSpy = spyOn<any>(modalHandlerService, 'openSaveDialog');
        const event = new KeyboardEvent('keydown', { key: 's', ctrlKey: true });
        component.onShiftDown(event);
        expect(openSaveDialogSpy).toHaveBeenCalled();
    });

    it('should not call openDrawingCarouselDialog', () => {
        toolboxService.setSelectedTool(toolStub);
        openDrawingCarouselDialogSpy = spyOn<any>(modalHandlerService, 'openDrawingCarouselDialog');
        const event = new KeyboardEvent('keydown', { key: 'g', ctrlKey: true });
        component.onShiftDown(event);
        expect(openDrawingCarouselDialogSpy).toHaveBeenCalled();
    });

    it('should not call openExportDialog', () => {
        toolboxService.setSelectedTool(toolStub);
        openExportDialogSpy = spyOn<any>(modalHandlerService, 'openExportDialog');
        const event = new KeyboardEvent('keydown', { key: 'e', ctrlKey: true });
        component.onShiftDown(event);
        expect(openExportDialogSpy).toHaveBeenCalled();
    });

    it('should not call onCtrlZDown', () => {
        toolboxService.setSelectedTool(toolStub);
        onCtrlZDownSpy = spyOn<any>(tracker, 'onCtrlZDown');
        const event = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true });
        component.onShiftDown(event);
        expect(onCtrlZDownSpy).toHaveBeenCalled();
    });

    it('should not call onCtrlShiftZDown', () => {
        toolboxService.setSelectedTool(toolStub);
        onCtrlShiftZDownSpy = spyOn<any>(tracker, 'onCtrlShiftZDown');
        const event = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, shiftKey: true });
        component.onShiftDown(event);
        expect(onCtrlShiftZDownSpy).toHaveBeenCalled();
    });

    it('should call the tool onBackspaceDown', () => {
        toolboxService.setSelectedTool(toolStub);
        onBackspaceDownSpy = spyOn<any>(toolStub, 'onBackspaceDown');
        const event = new KeyboardEvent('keydown', { key: 'Backspace' });
        component.keyEventUp(event);
        expect(onBackspaceDownSpy).toHaveBeenCalled();
    });

    it('should call the tool onArrowUp', () => {
        toolboxService.setSelectedTool(toolStub);
        onArrowUpSpy = spyOn<any>(toolStub, 'onArrowUp');
        const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        component.keyEventUp(event);
        expect(onArrowUpSpy).toHaveBeenCalled();
    });

    it('should call the tool pencil when pressing the key C', () => {
        const event = new KeyboardEvent('keyup', { key: 'C' });
        component.keyEventUp(event);
        expect(toolboxService.getCurrentTool()).toBe(pencil);
    });

    it('should toogle the grid when pressing the key G', () => {
        const toggleGridSpy: jasmine.Spy<any> = spyOn<any>(gridStub, 'toogleGrid');
        const event = new KeyboardEvent('keydown', { key: 'G' });
        component.onShiftDown(event);
        expect(toggleGridSpy).toHaveBeenCalled();
    });

    it('should call the increment the spacing of the grid when pressing the key +', () => {
        const incrementSpacingSpy: jasmine.Spy<any> = spyOn<any>(gridStub, 'incrementSpacing');
        const event = new KeyboardEvent('keydown', { key: '+' });
        component.onShiftDown(event);
        expect(incrementSpacingSpy).toHaveBeenCalled();
    });

    it('should call the decrementSpacing the spacing of the grid when pressing the key +', () => {
        const decrementSpacingSpy: jasmine.Spy<any> = spyOn<any>(gridStub, 'decrementSpacing');
        const event = new KeyboardEvent('keydown', { key: '-' });
        component.onShiftDown(event);
        expect(decrementSpacingSpy).toHaveBeenCalled();
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
