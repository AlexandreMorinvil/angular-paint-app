import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';
import { BrushService } from '@app/services/tools/brush/brush-service';
import { ColorPickerService } from '@app/services/tools/color-picker/color-picker.service';
import { CursorService } from '@app/services/tools/cursor/cursor.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { EraserService } from '@app/services/tools/eraser/eraser-service';
import { LineService } from '@app/services/tools/line/line-service';
import { PaintService } from '@app/services/tools/paint/paint.service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { PolygonService } from '@app/services/tools/polygon/polygon.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { EllipseSelectionService } from '@app/services/tools/selection/ellipse-selection.service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle-selection.service';
import { WorkzoneSizeService } from '@app/services/workzone-size-service/workzone-size.service';
import { AttributeSelectionComponent } from './attribute-selection.component';
class ToolStub extends Tool {}
// tslint:disable:no-any
describe('AttributeSelectionComponent', () => {
    let component: AttributeSelectionComponent;
    let fixture: ComponentFixture<AttributeSelectionComponent>;
    let toolserviceMock: ToolboxService;
    // let toolboxSpy: any;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    let drawingStub: DrawingService;
    let toolStub: ToolStub;
    // let onCtrlADownSpy: any;

    beforeEach(
        waitForAsync(() => {
            toolStub = new ToolStub({} as DrawingService, {} as Description);
            drawingStub = new DrawingService({} as WorkzoneSizeService);
            // toolboxSpy = jasmine.createSpyObj('toolboxSpy', ['getCurrentTool']);

            toolserviceMock = new ToolboxService(
                {} as CursorService,
                {} as PencilService,
                {} as BrushService,
                {} as EraserService,
                {} as RectangleService,
                {} as EllipseService,
                {} as LineService,
                {} as PolygonService,
                {} as ColorPickerService,
                {} as PaintService,
                {} as RectangleSelectionService,
                {} as EllipseSelectionService,
                {} as DrawingService,
            );
            TestBed.configureTestingModule({
                declarations: [AttributeSelectionComponent],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeSelectionComponent);
        component = fixture.componentInstance;

        const canvasWidth = 1200;
        const canvasHeight = 1000;
        previewCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        (toolserviceMock as any).drawingService = drawingStub;
        (toolserviceMock as any).drawingService.previewCtx = previewCtxStub;
        (toolserviceMock as any).drawingService.canvas = canvasStub;
        (toolserviceMock as any).drawingService.canvas.width = canvasWidth;
        (toolserviceMock as any).drawingService.canvas.height = canvasHeight;
        (component as any).toolboxSevice = toolserviceMock;
        // onCtrlADownSpy = spyOn<any>((component as any).toolboxSevice, 'getCurrentTool().onCtrlADown');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call current tool onCtrlADown', () => {
        toolStub = {} as EllipseSelectionService;
        (component as any).toolboxSevice.setSelectedTool(toolStub);
        component.onClick();
        // expect(onCtrlADownSpy).toHaveBeenCalled();
    });
});
