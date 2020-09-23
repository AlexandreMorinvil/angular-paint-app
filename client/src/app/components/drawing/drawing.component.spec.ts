import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from '@app/services/tools/brush/brush-service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
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

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService, {} as Description);
        drawingStub = new DrawingService();

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: PencilService, useValue: toolStub },
                { provide: BrushService, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                { provide: RectangleService, useValue: toolStub },
                { provide: EllipseService, useValue: toolStub },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
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

    it(" should call the tool's mouse move when receiving a mouse move event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseMove').and.callThrough();
        component.onMouseMove(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse down when receiving a mouse down event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDown').and.callThrough();
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse up when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });
    it('sould call the tool pencil when pressing the key C', () => {
        const event = {} as KeyboardEvent;
        event.key == 'C';
        component.keyEventUp(event);
        expect(component.toolbox.getCurrentTool()).toBe(toolStub);
    });
    it('sould call the tool rectangle when pressing the key 1', () => {
        const event = {} as KeyboardEvent;
        event.key == '1';
        component.keyEventUp(event);
        expect(component.toolbox.getCurrentTool()).toBe(toolStub);
    });
    it('sould call no tool by default', () => {
        const event = {} as KeyboardEvent;
        event.key == 'default';
        component.keyEventUp(event);

        it(' should call the default tool when receiving a keyup event', () => {
            const event = {} as KeyboardEvent;
            component.keyEventUp(event);

            expect(component.toolbox.getCurrentTool()).toBe(toolStub);
        });

        it(' should call the crayon tool when receiving a keyup event of c', () => {
            const event = new KeyboardEvent('key', {
                key: 'c',
            });
            component.keyEventUp(event);

            expect(component.toolbox.getCurrentTool()).toBe(toolStub);
        });

        it(' should call the ellipse tool when receiving the keyup event of 2', () => {
            const event = new KeyboardEvent('key', {
                key: '2',
            });
            component.keyEventUp(event);

            expect(component.toolbox.getCurrentTool()).toBe(toolStub);
        });
    });
});
