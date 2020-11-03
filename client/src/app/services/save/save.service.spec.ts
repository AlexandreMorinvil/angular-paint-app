import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SaveService } from './save.service';

describe('SaveService', () => {
    let service: SaveService;
    //let drawingService: DrawingService;
    let baseCtxStub: CanvasRenderingContext2D;
    let saveSpy: jasmine.Spy<any>;
    let restoreSpy: jasmine.Spy<any>;
    let drawImageSpy: jasmine.Spy<any>;

    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [MatDialog],
        });
        service = TestBed.inject(SaveService);
        saveSpy = spyOn<any>(baseCtxStub, 'save').and.callThrough();
        restoreSpy = spyOn<any>(baseCtxStub, 'restore').and.callThrough();
        drawImageSpy = spyOn<any>(baseCtxStub, 'drawImage').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should save the imgSource on saveDraw', () => {
        service.saveDraw();
        expect(service.imageSource).not.toBeNull();
        expect(baseCtxStub.globalCompositeOperation).toEqual('destination-over');
        expect(baseCtxStub.fillStyle).toEqual('white');
        expect(saveSpy).toHaveBeenCalled();
        expect(restoreSpy).toHaveBeenCalled();
        expect(drawImageSpy).toHaveBeenCalled();
    });
});
