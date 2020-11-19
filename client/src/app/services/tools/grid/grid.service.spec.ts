import { TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SpacingService } from '@app/services/tool-modifier/spacing/spacing.service';
import { GridService } from './grid.service';
// tslint: disable: no - any;
describe('GridService', () => {
    let service: GridService;
    let spacingService: SpacingService;
    let resetGridSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridService);
        spacingService = TestBed.inject(SpacingService);
        service.gridCanvas = canvasTestHelper.canvas;
        service.gridCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        resetGridSpy = spyOn<any>(service, 'resetGrid').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should draw the grid if the grid is activated', () => {
        const drawGridSpy = spyOn<any>(service, 'drawGrid').and.callThrough();
        const setAttributesGridSpy = spyOn<any>(service, 'setAttribtes').and.callThrough();
        (service as any).isGridOn = true;
        service.resetGrid();
        expect(drawGridSpy).toHaveBeenCalled();
        expect(setAttributesGridSpy).toHaveBeenCalled();
    });

    it('should not draw the grid if the grid is deactivated', () => {
        const drawGridSpy = spyOn<any>(service, 'drawGrid').and.callThrough();
        const setAttributesGridSpy = spyOn<any>(service, 'setAttribtes').and.callThrough();
        (service as any).isGridOn = false;
        service.resetGrid();
        expect(drawGridSpy).not.toHaveBeenCalled();
        expect(setAttributesGridSpy).not.toHaveBeenCalled();
    });

    it('should turn the grid from on to off', () => {
        (service as any).isGridOn = true;
        service.toogleGrid();
        expect(service.isGridActivated()).toBe(false);
        expect(resetGridSpy).toHaveBeenCalled();
    });

    it('should turn the grid from off to on', () => {
        (service as any).isGridOn = false;
        service.toogleGrid();
        expect(service.isGridActivated()).toBe(true);
        expect(resetGridSpy).toHaveBeenCalled();
    });

    it(' should increment the spacing of the grid', () => {
        const spacingServiceSpy = spyOn<any>(spacingService, 'stepUp').and.callThrough();
        service.incrementSpacing();
        expect(spacingServiceSpy).toHaveBeenCalled();
        expect(resetGridSpy).toHaveBeenCalled();
    });

    it(' should decrement the spacing of the grid', () => {
        const spacingServiceSpy = spyOn<any>(spacingService, 'stepDown').and.callThrough();
        service.decrementSpacing();
        expect(spacingServiceSpy).toHaveBeenCalled();
        expect(resetGridSpy).toHaveBeenCalled();
    });

    it('should call resetDrawingWithWarning and ask before delete with answer true', () => {
        const newWidth = 222;
        const newHeight = 333;
        service.resize(newWidth, newHeight);
        expect(service.gridCanvas.width).toBe(newWidth);
        expect(service.gridCanvas.height).toBe(newHeight);
        expect(resetGridSpy).toHaveBeenCalled();
    });
});
