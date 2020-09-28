import { async, ComponentFixture, TestBed } from '@angular/core/testing';
//import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
//import { WidthService } from '@app/services/tool-modifier/width/width.service';
//import { ToolboxService } from '@app/services/toolbox/toolbox.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { BrushService } from '@app/services/tools/brush/brush-service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { AttributeWidthComponent } from './attributes-width.component';
class ToolStub extends Tool {}

describe('AttributeWidthComponent', () => {
    let component: AttributeWidthComponent;
    let fixture: ComponentFixture<AttributeWidthComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttributeWidthComponent],
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
        fixture = TestBed.createComponent(AttributeWidthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
