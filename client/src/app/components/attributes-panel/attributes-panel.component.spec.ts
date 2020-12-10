import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { JunctionService } from '@app/services/tool-modifier/junction/junction.service';
import { TextureService } from '@app/services/tool-modifier/texture/texture.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';
import { AttributesPanelComponent } from './attributes-panel.component';
class ToolStub extends Tool {}

// The disablement of the "any" tslint rule is justified in this situation as the prototype
// of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
// tslint:disable:no-any
describe('AttributesPanelComponent', () => {
    let component: AttributesPanelComponent;
    let fixture: ComponentFixture<AttributesPanelComponent>;
    let toolStub: ToolStub;
    const canvasWidth = 1200;
    const canvasHeight = 1000;

    let toolBoxService: ToolboxService;
    let junctionService: JunctionService;
    let textureService: TextureService;
    let tracingService: TracingService;
    let widthService: WidthService;
    let previewCtxStub: CanvasRenderingContext2D;
    let selectionCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AttributesPanelComponent],
                providers: [ToolboxService, JunctionService, TextureService, TracingService, WidthService],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        selectionCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        fixture = TestBed.createComponent(AttributesPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        toolStub = new ToolStub({} as DrawingService, {} as Description);
        toolBoxService = TestBed.inject(ToolboxService);
        junctionService = TestBed.inject(JunctionService);
        textureService = TestBed.inject(TextureService);
        tracingService = TestBed.inject(TracingService);
        widthService = TestBed.inject(WidthService);
        (toolBoxService as any).drawingService.selectionCtx = selectionCtxStub;
        (toolBoxService as any).drawingService.previewCtx = previewCtxStub;
        (toolBoxService as any).drawingService.canvas = canvasStub;
        (toolBoxService as any).drawingService.canvas.width = canvasWidth;
        (toolBoxService as any).drawingService.canvas.height = canvasHeight;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('the capitalizeFirstLetter function should set the first character to a capital letter', () => {
        const inputString = 'string';
        const expectedOutput = 'String';
        const ouputString = component.capitalizeFirstLetter(inputString);
        expect(ouputString).toEqual(expectedOutput);
    });

    it('if the current tool possesses a junction modifier there should be a need for a junction atrribute modifier', () => {
        (toolStub as any).modifiers = [junctionService];
        toolBoxService.setSelectedTool(toolStub);
        const expectedOutput = true;
        const ouput = component.needsJunctionAttribute();
        expect(ouput).toEqual(expectedOutput);
    });

    it('if the current tool does not possess a junction modifier there should be a need for a junction atrribute modifier', () => {
        (toolStub as any).modifiers = [];
        toolBoxService.setSelectedTool(toolStub);
        const expectedOutput = false;
        const ouput = component.needsJunctionAttribute();
        expect(ouput).toEqual(expectedOutput);
    });

    it('if the current tool possesses a texture modifier there should be a need for a texture atrribute modifier', () => {
        (toolStub as any).modifiers = [textureService];
        toolBoxService.setSelectedTool(toolStub);
        const expectedOutput = true;
        const ouput = component.needsTextureAttribute();
        expect(ouput).toEqual(expectedOutput);
    });

    it('if the current tool does not possesses a texture modifier there should be a need for a texture atrribute modifier', () => {
        (toolStub as any).modifiers = [];
        toolBoxService.setSelectedTool(toolStub);
        const expectedOutput = false;
        const ouput = component.needsTextureAttribute();
        expect(ouput).toEqual(expectedOutput);
    });

    it('if the current tool possesses a tracing modifier there should be a need for a tracing atrribute modifier', () => {
        (toolStub as any).modifiers = [tracingService];
        toolBoxService.setSelectedTool(toolStub);
        const expectedOutput = true;
        const ouput = component.needsTracingAttribute();
        expect(ouput).toEqual(expectedOutput);
    });

    it('if the current tool does not possess a tracing modifier there should be a need for a tracing atrribute modifier', () => {
        (toolStub as any).modifiers = [];
        toolBoxService.setSelectedTool(toolStub);
        const expectedOutput = false;
        const ouput = component.needsTracingAttribute();
        expect(ouput).toEqual(expectedOutput);
    });

    it('if the current tool possesses a width modifier there should be a need for a width atrribute modifier', () => {
        (toolStub as any).modifiers = [widthService];
        toolBoxService.setSelectedTool(toolStub);
        const expectedOutput = true;
        const ouput = component.needsWidthAttribute();
        expect(ouput).toEqual(expectedOutput);
    });

    it('if the current tool does not possesses a width modifier there should be a need for a width atrribute modifier', () => {
        (toolStub as any).modifiers = [];
        toolBoxService.setSelectedTool(toolStub);
        const expectedOutput = false;
        const ouput = component.needsWidthAttribute();
        expect(ouput).toEqual(expectedOutput);
    });
});
