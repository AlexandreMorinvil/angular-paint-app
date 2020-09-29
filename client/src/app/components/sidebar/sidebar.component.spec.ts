// tslint:disable:ordered-imports
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Description } from '@app/classes/description';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from '@app/services/tools/brush/brush-service';
import { CursorService } from '@app/services/tools/cursor/cursor.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { EraserService } from '@app/services/tools/eraser/eraser-service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';
import { SidebarComponent } from './sidebar.component';
// tslint:disable:prettier
class ToolStub extends Tool{}

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let toolserviceMock: ToolboxService;
    // tslint:disable:no-any
    let toolboxSpy: any;
    let routerSpy: jasmine.Spy<any>;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService, {} as Description);
        drawingStub = new DrawingService();
        toolboxSpy = jasmine.createSpyObj('toolboxSpy', ['getAvailableTools', 'getCurrentTool', 'setSelectedTool']);
        toolserviceMock = new ToolboxService(
            {} as CursorService,
            {} as PencilService,
            {} as BrushService,
            {} as EraserService,
            {} as RectangleService,
            {} as EllipseService,
        );

        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [SidebarComponent],
            providers: [
                { provide: PencilService, useValue: toolStub },
                { provide: BrushService, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                { provide: RectangleService, useValue: toolStub },
                { provide: EllipseService, useValue: toolStub },
                { provide: CursorService, useValue: toolStub },
                { provide: ToolboxService, useValue: toolboxSpy },
                { provide: RouterModule, useValue: routerSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        // tslint:disable:no-string-literal
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        component['toolboxSevice'] = toolserviceMock;
        routerSpy = spyOn<any>(component['router'], 'navigate').and.callThrough();
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
        component.setCurrentTool({} as PencilService);
        expect(component.getCurrentTool()).toEqual({} as PencilService);
    });

    it('should navigate to main', () => {
        component.navigateToMain();
        expect(routerSpy).toHaveBeenCalled();
    });
});
