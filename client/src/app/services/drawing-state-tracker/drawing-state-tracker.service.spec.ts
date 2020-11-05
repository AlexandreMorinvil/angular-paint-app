import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { PencilService } from '@app/services/tools/pencil/pencil-service';
import { DrawingStateTrackerService } from './drawing-state-tracker.service';

describe('DrawingStateTrackerService', () => {
    // The disablement of the "any" tslint rule is justified in this situation as the prototype
    // of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
    // tslint:disable:no-any
    let service: DrawingStateTrackerService;
    let servicePencil: PencilService;
    let onCtrlZDownSpy: jasmine.Spy<any>;
    let onCtrlShiftZDownSpy: jasmine.Spy<any>;
    let undoSpy: jasmine.Spy<any>;
    let redoSpy: jasmine.Spy<any>;
    let saveCanvasSpy: jasmine.Spy<any>;
    let reconstituteCanvasSpy: jasmine.Spy<any>;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawingStateTrackerService);
        servicePencil = TestBed.inject(PencilService);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;

        onCtrlZDownSpy = spyOn<any>(service, 'onCtrlZDown').and.callThrough();
        onCtrlShiftZDownSpy = spyOn<any>(service, 'onCtrlShiftZDown').and.callThrough();
        undoSpy = spyOn<any>(service, 'undo').and.callThrough();
        redoSpy = spyOn<any>(service, 'redo').and.callThrough();
        saveCanvasSpy = spyOn<any>(service, 'saveCanvas').and.callThrough();
        reconstituteCanvasSpy = spyOn<any>(service, 'reconstituteCanvas').and.callThrough();
        // Configuration of spy service
        const canvasWidth = 1000;
        const canvasHeight = 800;
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;
        service['drawingService'].canvas.width = canvasWidth;
        service['drawingService'].canvas.height = canvasHeight;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call undo when  Ctrl + Z is pressed', () => {
        service.onCtrlZDown();
        expect(onCtrlZDownSpy).toHaveBeenCalled();
        expect(undoSpy).toHaveBeenCalled();
    });

    it('should call redo when  Ctrl + Z + Shift is pressed', () => {
        service.onCtrlShiftZDown();
        expect(onCtrlShiftZDownSpy).toHaveBeenCalled();
        expect(redoSpy).toHaveBeenCalled();
    });

    it('should push a canvas with height and width in a array of canvases with a length of 0  after an action with pencil', () => {
        servicePencil.mouseDown = true;
        (service as any).canvases.length = 0;
        const mouseEvent = {
            offsetX: 1,
            offsetY: 1,
            button: 0,
        } as MouseEvent;
        (servicePencil as any).pathData = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
        ];

        servicePencil.onMouseUp(mouseEvent);
        expect((service as any).canvases.length).toEqual(1);
    });

    it('should push a canvas with height and width in a array of canvases with a length of 1  after an action with pencil', () => {
        servicePencil.mouseDown = true;
        (service as any).canvases.length = 1;
        const mouseEvent = {
            offsetX: 1,
            offsetY: 1,
            button: 0,
        } as MouseEvent;
        (servicePencil as any).pathData = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
        ];

        servicePencil.onMouseUp(mouseEvent);
        expect((service as any).canvases.length).toEqual(1);
    });

    it('should push a canvas with height and width in a array of canvases with a length of 0 and should call saveCanvas()', () => {
        servicePencil.mouseDown = true;
        (service as any).canvases.length = 0;
        (service as any).actions.length = 1;
        (service as any).intervalCanvasSave = 2;
        const mouseEvent = {
            offsetX: 1,
            offsetY: 1,
            button: 0,
        } as MouseEvent;
        (servicePencil as any).pathData = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
        ];

        servicePencil.onMouseUp(mouseEvent);
        expect((service as any).intervalCanvasSave % (service as any).actions.length).toEqual(0);
        expect(saveCanvasSpy).toHaveBeenCalled();
    });

    it('should call reconstituteCanvas when undo is called', () => {
        servicePencil.mouseDown = true;
        const mouseEvent = {
            offsetX: 1,
            offsetY: 1,
            button: 0,
        } as MouseEvent;
        (servicePencil as any).pathData = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
        ];
        servicePencil.onMouseUp(mouseEvent);
        service.undo();
        expect(reconstituteCanvasSpy).toHaveBeenCalled();
    });
    it('should early return when undo is called when there is no action to pop', () => {
        servicePencil.mouseDown = false;
        const mouseEvent = {
            offsetX: 1,
            offsetY: 1,
            button: 0,
        } as MouseEvent;
        (servicePencil as any).pathData = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
        ];
        servicePencil.onMouseUp(mouseEvent);
        service.undo();
    });

    it('should push actionsToRedo with action that was undone and push canvasesToRedo with canvas that was undone', () => {
        servicePencil.mouseDown = true;
        (service as any).canvases.length = 0;
        (service as any).actions.length = 0;
        (service as any).intervalCanvasSave = 1;
        (service as any).actionsToRedo = [];
        (service as any).canvasesToRedo = [];
        const mouseEvent = {
            offsetX: 1,
            offsetY: 1,
            button: 0,
        } as MouseEvent;
        (servicePencil as any).pathData = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
        ];
        servicePencil.onMouseUp(mouseEvent);
        service.undo();
        expect((service as any).actions.length % (service as any).intervalCanvasSave).toEqual(0);
        expect(reconstituteCanvasSpy).toHaveBeenCalled();
    });

    it('should call reconstituteCanvas when redo is called', () => {
        servicePencil.mouseDown = true;
        const mouseEvent = {
            offsetX: 1,
            offsetY: 1,
            button: 0,
        } as MouseEvent;
        (servicePencil as any).pathData = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
        ];
        servicePencil.onMouseUp(mouseEvent);
        service.undo();
        service.redo();
        expect(reconstituteCanvasSpy).toHaveBeenCalled();
    });
    it('should early return when undo is called when there is no action to pop', () => {
        servicePencil.mouseDown = false;
        const mouseEvent = {
            offsetX: 1,
            offsetY: 1,
            button: 0,
        } as MouseEvent;
        (servicePencil as any).pathData = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
        ];
        servicePencil.onMouseUp(mouseEvent);
        service.redo();
        expect(reconstituteCanvasSpy).not.toHaveBeenCalled();
    });

    it('should push actionsToRedo with action that was undone and push canvasesToRedo with canvas that was undone', () => {
        servicePencil.mouseDown = true;
        (service as any).canvases.length = 0;
        (service as any).actions.length = 0;
        (service as any).intervalCanvasSave = 1;
        (service as any).actionsToRedo = [];
        (service as any).canvasesToRedo = [];
        const mouseEvent = {
            offsetX: 1,
            offsetY: 1,
            button: 0,
        } as MouseEvent;
        (servicePencil as any).pathData = [
            { x: 0, y: 0 },
            { x: 1, y: 1 },
        ];
        servicePencil.onMouseUp(mouseEvent);
        service.undo();
        service.redo();
        expect((service as any).actions.length % (service as any).intervalCanvasSave).toEqual(0);
        expect(reconstituteCanvasSpy).toHaveBeenCalled();
    });

    it('should reset all arrays (actions,canvases,actionsToRedo,canvasesToRedo)', () => {
        (service as any).canvases = [1];
        (service as any).actions = [1];
        (service as any).intervalCanvasSave = [1];
        (service as any).actionsToRedo.length = [1];
        (service as any).canvasesToRedo.length = [1];

        service.reset();
        expect((service as any).actions.length).toEqual(0);
        expect((service as any).canvases.length).toEqual(0);
        expect((service as any).actionsToRedo.length).toEqual(0);
        expect((service as any).canvasesToRedo.length).toEqual(0);
    });
});
