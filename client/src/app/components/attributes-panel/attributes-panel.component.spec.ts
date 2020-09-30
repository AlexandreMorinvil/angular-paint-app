import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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

describe('AttributesPanelComponent', () => {
    let component: AttributesPanelComponent;
    let fixture: ComponentFixture<AttributesPanelComponent>;
    let toolStub: ToolStub;

    // Service
    let toolBoxSercive: ToolboxService;
    let junctionService: JunctionService;
    let textureService: TextureService;
    let tracingService: TracingService;
    let widthService: WidthService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttributesPanelComponent],
            providers: [ToolboxService, JunctionService, TextureService, TracingService, WidthService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributesPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        toolStub = new ToolStub({} as DrawingService, {} as Description);
        toolBoxSercive = TestBed.inject(ToolboxService);
        junctionService = TestBed.inject(JunctionService);
        textureService = TestBed.inject(TextureService);
        tracingService = TestBed.inject(TracingService);
        widthService = TestBed.inject(WidthService);
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
        // tslint:disable-next-line:no-string-literal
        toolStub['modifiers'] = [junctionService];
        toolBoxSercive.setSelectedTool(toolStub);
        const expectedOutput = true;
        const ouput = component.needsJunctionAttribute();
        expect(ouput).toEqual(expectedOutput);
    });

    it('if the current tool does not possess a junction modifier there should be a need for a junction atrribute modifier', () => {
        // tslint:disable-next-line:no-string-literal
        toolStub['modifiers'] = [];
        toolBoxSercive.setSelectedTool(toolStub);
        const expectedOutput = false;
        const ouput = component.needsJunctionAttribute();
        expect(ouput).toEqual(expectedOutput);
    });

    it('if the current tool possesses a texture modifier there should be a need for a texture atrribute modifier', () => {
        // tslint:disable-next-line:no-string-literal
        toolStub['modifiers'] = [textureService];
        toolBoxSercive.setSelectedTool(toolStub);
        const expectedOutput = true;
        const ouput = component.needsTextureAttribute();
        expect(ouput).toEqual(expectedOutput);
    });

    it('if the current tool does not possesses a texture modifier there should be a need for a texture atrribute modifier', () => {
        // tslint:disable-next-line:no-string-literal
        toolStub['modifiers'] = [];
        toolBoxSercive.setSelectedTool(toolStub);
        const expectedOutput = false;
        const ouput = component.needsTextureAttribute();
        expect(ouput).toEqual(expectedOutput);
    });

    it('if the current tool possesses a tracing modifier there should be a need for a tracing atrribute modifier', () => {
        // tslint:disable-next-line:no-string-literal
        toolStub['modifiers'] = [tracingService];
        toolBoxSercive.setSelectedTool(toolStub);
        const expectedOutput = true;
        const ouput = component.needsTracingAttribute();
        expect(ouput).toEqual(expectedOutput);
    });

    it('if the current tool does not possess a tracing modifier there should be a need for a tracing atrribute modifier', () => {
        // tslint:disable-next-line:no-string-literal
        toolStub['modifiers'] = [];
        toolBoxSercive.setSelectedTool(toolStub);
        const expectedOutput = false;
        const ouput = component.needsTracingAttribute();
        expect(ouput).toEqual(expectedOutput);
    });

    it('if the current tool possesses a width modifier there should be a need for a width atrribute modifier', () => {
        // tslint:disable-next-line:no-string-literal
        toolStub['modifiers'] = [widthService];
        toolBoxSercive.setSelectedTool(toolStub);
        const expectedOutput = true;
        const ouput = component.needsWidthAttribute();
        expect(ouput).toEqual(expectedOutput);
    });

    it('if the current tool does not possesses a width modifier there should be a need for a width atrribute modifier', () => {
        // tslint:disable-next-line:no-string-literal
        toolStub['modifiers'] = [];
        toolBoxSercive.setSelectedTool(toolStub);
        const expectedOutput = false;
        const ouput = component.needsWidthAttribute();
        expect(ouput).toEqual(expectedOutput);
    });
});
