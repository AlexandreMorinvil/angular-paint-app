import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { AutoSaveService } from '@app/services/auto-save/auto-save.service';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ModalHandlerService } from '@app/services/modal-handler/modal-handler';
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
import { SidebarComponent } from './sidebar.component';
class ToolStub extends Tool {}
// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let drawingStateStub: DrawingStateTrackerService;
    let modalHandlerService: ModalHandlerService;
    let toolserviceMock: ToolboxService;
    let toolboxSpy: jasmine.SpyObj<any>;
    let routerSpy: jasmine.Spy<any>;
    let undoSpy: jasmine.Spy<any>;
    let redoSpy: jasmine.Spy<any>;
    let resetDrawingWithWarningSpy: jasmine.Spy<any>;
    let openGuideSpy: jasmine.Spy<any>;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    let modalHandlerServiceSpy: jasmine.Spy<any>;

    beforeEach(
        waitForAsync(() => {
            toolStub = new ToolStub({} as DrawingService, {} as Description);
            drawingStub = new DrawingService({} as WorkzoneSizeService);
            drawingStateStub = new DrawingStateTrackerService({} as DrawingService, {} as AutoSaveService);
            toolboxSpy = jasmine.createSpyObj('toolboxSpy', ['getAvailableTools', 'getCurrentTool', 'setSelectedTool']);

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
                imports: [RouterTestingModule, HttpClientModule],
                declarations: [SidebarComponent],
                providers: [
                    { provide: PencilService, useValue: toolStub },
                    { provide: LineService, useValue: toolStub },
                    { provide: BrushService, useValue: toolStub },
                    { provide: DrawingService, useValue: drawingStub },
                    { provide: RectangleService, useValue: toolStub },
                    { provide: EllipseService, useValue: toolStub },
                    { provide: PolygonService, useValue: toolStub },
                    { provide: CursorService, useValue: toolStub },
                    { provide: ToolboxService, useValue: toolboxSpy },
                    { provide: DrawingStateTrackerService, useValue: drawingStateStub },
                    { provide: RouterModule, useValue: routerSpy },
                    { provide: MAT_DIALOG_DATA, useValue: {} },
                    { provide: MatDialogRef, useValue: {} },
                    { provide: MatDialog, useValue: {} },
                    ModalHandlerService,
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        modalHandlerService = TestBed.inject(ModalHandlerService);
        component = fixture.componentInstance;
        (component as any).toolboxSevice = toolserviceMock;
        routerSpy = spyOn<any>((component as any).router, 'navigate').and.callThrough();
        resetDrawingWithWarningSpy = spyOn<any>((component as any).drawingService, 'resetDrawingWithWarning');
        openGuideSpy = spyOn<any>((component as any).modalHandler, 'openUserGuide');

        undoSpy = spyOn<any>((component as any).drawingStateTracker, 'undo');
        redoSpy = spyOn<any>((component as any).drawingStateTracker, 'redo');

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get stubTool', () => {
        const currentTool = component.getCurrentTool();
        expect(currentTool).toEqual({} as CursorService);
    });

    it('should get list of stubTool', () => {
        const currentTool = component.getListOfTools();
        expect(currentTool).toEqual(toolserviceMock.getAvailableTools());
    });

    it('should set currentTool to right stubTool', () => {
        toolStub = {} as PencilService;
        toolStub.mouseDown = false;
        const canvasWidth = 1200;
        const canvasHeight = 1000;
        previewCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        (toolserviceMock as any).drawingService = drawingStub;
        (toolserviceMock as any).drawingService.previewCtx = previewCtxStub;
        (toolserviceMock as any).drawingService.canvas = canvasStub;
        (toolserviceMock as any).drawingService.canvas.width = canvasWidth;
        (toolserviceMock as any).drawingService.canvas.height = canvasHeight;
        component.setCurrentTool(toolStub);
        expect(component.getCurrentTool()).toEqual(toolStub);
    });

    it('should navigate to main', () => {
        component.navigateToMain();
        expect(routerSpy).toHaveBeenCalled();
    });

    it('should call resetDrawingWithWarning', () => {
        component.resetDrawing();
        expect(resetDrawingWithWarningSpy).toHaveBeenCalled();
    });

    it('should call openUserGuide', () => {
        component.openGuide();
        expect(openGuideSpy).toHaveBeenCalled();
    });

    it('should call openSaveDialog', () => {
        modalHandlerServiceSpy = spyOn<any>(modalHandlerService, 'openSaveDialog');
        component.openSaveDialog();
        expect(modalHandlerServiceSpy).toHaveBeenCalled();
    });

    it('should call openCarouselDialog', () => {
        modalHandlerServiceSpy = spyOn<any>(modalHandlerService, 'openDrawingCarouselDialog');
        component.openCarouselDialog();
        expect(modalHandlerServiceSpy).toHaveBeenCalled();
    });

    it('should call openExportDialog', () => {
        modalHandlerServiceSpy = spyOn<any>(modalHandlerService, 'openExportDialog');
        component.openExportDialog();
        expect(modalHandlerServiceSpy).toHaveBeenCalled();
    });

    it('should call undo', () => {
        component.undo();
        expect(undoSpy).toHaveBeenCalled();
    });

    it('should call redo', () => {
        component.redo();
        expect(redoSpy).toHaveBeenCalled();
    });
});
