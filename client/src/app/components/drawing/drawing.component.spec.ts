import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';
import { BrushService } from '@app/services/tools/brush/brush-service';
import { CursorService } from '@app/services/tools/cursor/cursor.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { EraserService } from '@app/services/tools/eraser/eraser-service';
import { DrawingComponent } from './drawing.component';
class ToolStub extends Tool {}

// TODO : Déplacer dans un fichier accessible à tous
const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 800;

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let toolboxService: ToolboxService;
    let clearCanvasSpy: jasmine.Spy<any>;
    let resetDrawingSpy: jasmine.Spy<any>;
    //let toolboxSpy: jasmine.SpyObj<ToolboxService>;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService, {} as Description);
        drawingStub = new DrawingService();
        //toolboxSpy = jasmine.createSpyObj('toolboxSpy', ['getCurrentTool']);

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: PencilService, useValue: toolStub },
                { provide: BrushService, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                { provide: RectangleService, useValue: toolStub },
                { provide: EllipseService, useValue: toolStub },
                { provide: CursorService, useValue: toolStub },
                { provide: EraserService, useValue: toolStub },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        toolboxService = TestBed.inject(ToolboxService);
        component = fixture.componentInstance;
        component['toolbox'] = toolboxService;
        clearCanvasSpy = spyOn<any>(drawingStub, 'clearCanvas').and.callThrough();
        resetDrawingSpy = spyOn<any>(component, 'resetDrawing').and.callThrough();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a default WIDTH and HEIGHT', () => {
        const height = component.height;
        const width = component.width;
        expect(height).toEqual(DEFAULT_HEIGHT);
        expect(width).toEqual(DEFAULT_WIDTH);
    });

    it('should get stubTool', () => {
        const currentTool = component.toolbox.getCurrentTool();
        expect(currentTool).toEqual(toolStub);
    });

    it('should call the tools mouse move when receiving a mouse move event', () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseMove').and.callThrough();
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('should call the tools mouse down when receiving a mouse down event', () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDown').and.callThrough();
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('should call the tools mouse up when receiving a mouse up event', () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it('should call the tool onShiftUp', () => {
        const event = new KeyboardEvent('keyup', { 'key': 'Shift' });
        component.keyEventUp(event);
        //expect(toolboxService.getCurrentTool().onShiftUp(event)).toHaveBeenCalled;
    });

    it('should call the tool onBackspaceDown', () => {
        const event = new KeyboardEvent('keyup', { 'key': 'Backspace' });
        component.keyEventUp(event);
        //expect(toolboxService.getCurrentTool().onShiftUp(event)).toHaveBeenCalled;
    });

    it('should call the tool pencil when pressing the key C', () => {
        const event = new KeyboardEvent('keyup', { 'key': 'C' });
        component.keyEventUp(event);
        expect(toolboxService.getCurrentTool()).toBe(toolStub);
    });

    it('should call the tool rectangle when pressing the key 1', () => {
        const event = new KeyboardEvent('keyup', { 'key': '1' });
        component.keyEventUp(event);
        expect(toolboxService.getCurrentTool()).toBe(toolStub);
    });

    it('should call the ellipse tool when receiving the keyup event of 2', () => {
        const event = new KeyboardEvent('keyup', { 'key': '2' });
        component.keyEventUp(event);
        expect(toolboxService.getCurrentTool()).toBe(toolStub);
    });

    it('should call no tool by default', () => {
        const event = new KeyboardEvent('keyup', { 'key': 'default' });
        component.keyEventUp(event);
    });

    it('should call onShiftDown event', () => {
        const event = new KeyboardEvent('keyup', { 'key': '1' });
        component.onShiftDown(event);
        //expect(toolboxSpy.getCurrentTool).not.toHaveBeenCalled();

        const eventShift = new KeyboardEvent('keyup', { 'key': 'Shift' });
        component.onShiftDown(eventShift);
        //expect(toolboxSpy.getCurrentTool).toHaveBeenCalled();
    });

    it('should call onEscapeDown', () => {
        const event = new KeyboardEvent('keyup', { 'key': 'Escape' });
        component.onShiftDown(event);
        //expect(onShiftDownSpy).not.toHaveBeenCalled();
    });

    it('should reset the drawing', () => {
        component.resetDrawing();
        expect(clearCanvasSpy).toHaveBeenCalled();
    });

    it('should call resetDrawing and ask before delete with answer true', () => {
        component.hasBeenDrawnOnto = true;
        const event = new KeyboardEvent('keyup', { 'key': 'o' });
        spyOn(window, 'confirm').and.returnValue(true);
        component.createNewDrawingKeyboardEvent(event);
        expect(resetDrawingSpy).toHaveBeenCalled();
    });

    it('should call resetDrawing and ask before delete with answer false', () => {
        component.hasBeenDrawnOnto = true;
        const event = new KeyboardEvent('keyup', { 'key': 'o' });
        spyOn(window, 'confirm').and.returnValue(false);
        component.createNewDrawingKeyboardEvent(event);
        expect(resetDrawingSpy).not.toHaveBeenCalled();
    });

    it('should call resetDrawing and not ask before delete', () => {
        component.hasBeenDrawnOnto = false;
        const event = new KeyboardEvent('keyup', { 'key': 'o' });
        component.createNewDrawingKeyboardEvent(event);
        expect(resetDrawingSpy).toHaveBeenCalled();
    });
});
