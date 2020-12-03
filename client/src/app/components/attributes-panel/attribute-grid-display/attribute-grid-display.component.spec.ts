// import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// import { Description } from '@app/classes/description';
// import { Tool } from '@app/classes/tool';
// import { DrawingService } from '@app/services/drawing/drawing.service';
// import { ToolboxService } from '@app/services/toolbox/toolbox.service';
// import { WorkzoneSizeService } from '@app/services/workzone-size-service/workzone-size.service';
// import { AttributeSelectionComponent } from './attribute-selection.component';
// class ToolStub extends Tool {}

// // tslint:disable:no-any
// describe('AttributeSelectionComponent', () => {
//     let component: AttributeSelectionComponent;
//     let fixture: ComponentFixture<AttributeSelectionComponent>;
//     let toolboxService: ToolboxService;
//     let drawingStub: DrawingService;
//     let toolStub: ToolStub;
//     let clearCanvasSpy: jasmine.Spy<any>;
//     let onCtrlADownSpy: jasmine.Spy<any>;

//     beforeEach(
//         waitForAsync(() => {
//             toolStub = new ToolStub({} as DrawingService, {} as Description);
//             drawingStub = new DrawingService({} as WorkzoneSizeService);
//             TestBed.configureTestingModule({
//                 declarations: [AttributeSelectionComponent],
//                 providers: [{ provide: DrawingService, useValue: drawingStub }, ToolboxService],
//             }).compileComponents();
//         }),
//     );

//     beforeEach(() => {
//         fixture = TestBed.createComponent(AttributeSelectionComponent);
//         toolboxService = TestBed.inject(ToolboxService);
//         component = fixture.componentInstance;
//         clearCanvasSpy = spyOn<any>(drawingStub, 'clearCanvas');
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('should call current tool onCtrlADown', () => {
//         toolboxService.setSelectedTool(toolStub);
//         onCtrlADownSpy = spyOn<any>(toolStub, 'onCtrlADown');
//         component.onClick();
//         expect(clearCanvasSpy).toHaveBeenCalled();
//         expect(onCtrlADownSpy).toHaveBeenCalled();
//     });
// });
