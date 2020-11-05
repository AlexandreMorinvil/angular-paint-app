import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainPageComponent } from '@app/components/main-page/main-page.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Observable } from 'rxjs';
import { ModalHandlerService } from './modal-handler';
describe('ModalHandlerService', () => {
    let service: ModalHandlerService;
    const dialogSpy: jasmine.SpyObj<MatDialog> = jasmine.createSpyObj('MatDialog', ['open', 'afterClosed', 'closeAll']);
    let drawingSpy: jasmine.SpyObj<DrawingService>;

    const dialogRefSpy: jasmine.SpyObj<MatDialogRef<MainPageComponent, any>> = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'close']);
    const observableSpy: jasmine.SpyObj<Observable<any>> = jasmine.createSpyObj('Observable', ['subscribe']);
    dialogRefSpy.afterClosed.and.returnValue(observableSpy);
    dialogRefSpy.close.and.callThrough();
    dialogSpy.open.and.returnValue(dialogRefSpy);
    dialogSpy.closeAll.and.callThrough();

    beforeEach(() => {
        drawingSpy = jasmine.createSpyObj('DrawingService', {
            shortcutEnable: true,
        });

        TestBed.configureTestingModule({
            imports: [MatDialogModule, BrowserAnimationsModule, HttpClientModule],
            providers: [
                { provide: DrawingService, useValue: drawingSpy },
                { provide: MatDialog, useValue: dialogSpy },
            ],
        });
        service = TestBed.inject(ModalHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should open drawingCarouselDialog', () => {
        service.openDrawingCarouselDialog();
        expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('should open drawingCarouselDialog', () => {
        service.openDrawingCarouselDialog();
        expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('should open drawingCarouselDialog', () => {
        service.openDrawingCarouselDialog();
        expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('should open openExportDialog', () => {
        service.openExportDialog();
        expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('should open openSaveDialog', () => {
        service.openSaveDialog();
        expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('should open openUserGuide', () => {
        service.openUserGuide();
        expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('should close openUserGuide', async () => {
        dialogSpy.closeAll();
        // service.openUserGuide();

        expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
    });

    it('should close openUserGuide', async () => {
        service.openUserGuide();

        expect(dialogRefSpy.afterClosed).toHaveBeenCalled();
    });
});
