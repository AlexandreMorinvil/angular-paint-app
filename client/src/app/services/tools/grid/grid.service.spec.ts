// import { TestBed } from '@angular/core/testing';
// import { canvasTestHelper } from '@app/classes/canvas-test-helper';
// import { GridService } from './grid.service';
// // tslint: disable: no - any;
// describe('GridService', () => {
//     let service: GridService;

//     let resetDrawingSpy: jasmine.Spy<any>;
//     beforeEach(() => {
//         TestBed.configureTestingModule({});
//         service = TestBed.inject(GridService);
//         service.gridCanvas = canvasTestHelper.canvas;
//         service.gridCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('should clear the whole canvas', () => {
//         service.clearCanvas(service.baseCtx);
//         const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
//         const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
//         expect(hasColoredPixels).toEqual(false);
//     });

// //     it('should clear the whole canvas', () => {
// //         service.clearCanvas(service.baseCtx);
// //         const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
// //         const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
// //         expect(hasColoredPixels).toEqual(false);
// //     });

// //     it('should call resetDrawingWithWarning and ask before delete with answer true', () => {
// //         service.hasBeenDrawnOnto = true;
// //         resetDrawingSpy = jasmine.createSpy('resetDrawingWithWarning');
// //         spyOn(window, 'confirm').and.returnValue(true);
// //         service.resetDrawingWithWarning();
// //         expect(resetDrawingSpy).not.toHaveBeenCalled();
// //     });

// //     it('should call resetDrawingWithWarning and ask before delete with answer false', () => {
// //         service.hasBeenDrawnOnto = true;
// //         resetDrawingSpy = jasmine.createSpy('resetDrawingWithWarning');
// //         spyOn(window, 'confirm').and.returnValue(false);
// //         service.resetDrawingWithWarning();
// //         expect(resetDrawingSpy).not.toHaveBeenCalled();
// //     });
// });
