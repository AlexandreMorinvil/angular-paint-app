import { TestBed } from '@angular/core/testing';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolboxService } from './toolbox.service';
class ToolStub extends Tool {}

describe('ToolboxService', () => {
    let service: ToolboxService;
    let toolStub: ToolStub;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ToolboxService],
        });
        service = TestBed.inject(ToolboxService);
        toolStub = new ToolStub({} as DrawingService, {} as Description);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setSelectedTool shoud set the current tool to the tool given as an input', () => {
        service.setSelectedTool(toolStub);
        const currentTool: Tool = service.getCurrentTool();
        expect(currentTool).toEqual(toolStub);
    });

    it('getAvailableTools shoud return a list of tools', () => {
        const availableTools: Tool[] = service.getAvailableTools();
        const outputIsArrau = Array.isArray(availableTools);
        expect(outputIsArrau).toEqual(true);
    });
});
