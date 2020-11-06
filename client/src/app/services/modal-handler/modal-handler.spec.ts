import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EMPTY, Subject } from 'rxjs';
import { ModalHandlerService } from './modal-handler';
// tslint:disable:no-any
describe('ModalHandlerService', () => {
    let service: ModalHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule, BrowserAnimationsModule, HttpClientModule],
            providers: [{ provide: DrawingService }],
        });
        service = TestBed.inject(ModalHandlerService);
    });

    it('openDrawingCarouselDialog should open a DrawingCarouselDialog', () => {
        const spy = spyOn(service.dialog, 'open').and.returnValue({ afterClosed: () => EMPTY } as any);
        service.openDrawingCarouselDialog();
        expect(spy).toHaveBeenCalled();
    });

    it('should set shortcutenable to true after close openUserGuide dialog', () => {
        (service as any).drawingService.shortcutEnable = false;
        const spy = jasmine.createSpyObj('MathDialogRef', ['afterClosed']);
        const newSubject = new Subject<any>();
        spy.afterClosed.and.returnValue(newSubject.asObservable());
        spyOn(service.dialog, 'open').and.returnValue(spy);
        service.openDrawingCarouselDialog();
        newSubject.next(null);
        const result = ((service as any).drawingService.shortcutEnable = true);
        expect(result).toBeTruthy();
    });
    it('openSaveDialog should open a SaveDialog', () => {
        const spy = spyOn(service.dialog, 'open').and.returnValue({ afterClosed: () => EMPTY } as any);
        service.openSaveDialog();
        expect(spy).toHaveBeenCalled();
    });

    it('should set shortcutenable to true after close openSaveDialog', () => {
        (service as any).drawingService.shortcutEnable = false;
        const spy = jasmine.createSpyObj('MathDialogRef', ['afterClosed']);
        const newSubject = new Subject<any>();
        spy.afterClosed.and.returnValue(newSubject.asObservable());
        spyOn(service.dialog, 'open').and.returnValue(spy);
        service.openSaveDialog();
        newSubject.next(null);
        const result = ((service as any).drawingService.shortcutEnable = true);
        expect(result).toBeTruthy();
    });
    it('openExportDialog should open a ExportDialog', () => {
        const spy = spyOn(service.dialog, 'open').and.returnValue({ afterClosed: () => EMPTY } as any);
        service.openExportDialog();
        expect(spy).toHaveBeenCalled();
    });

    it('should set shortcutenable to true after close openExportDialog', () => {
        (service as any).drawingService.shortcutEnable = false;
        const spy = jasmine.createSpyObj('MathDialogRef', ['afterClosed']);
        const newSubject = new Subject<any>();
        spy.afterClosed.and.returnValue(newSubject.asObservable());
        spyOn(service.dialog, 'open').and.returnValue(spy);
        service.openExportDialog();
        newSubject.next(null);
        const result = ((service as any).drawingService.shortcutEnable = true);
        expect(result).toBeTruthy();
    });

    it('openUserGuide should open a openUserGuide dialog', () => {
        const spy = spyOn(service.dialog, 'open').and.returnValue({ afterClosed: () => EMPTY } as any);
        service.openExportDialog();
        expect(spy).toHaveBeenCalled();
    });

    it('should set shortcutenable to true after close openUserGuide', () => {
        (service as any).drawingService.shortcutEnable = false;
        const spy = jasmine.createSpyObj('MathDialogRef', ['afterClosed']);
        const newSubject = new Subject<any>();
        spy.afterClosed.and.returnValue(newSubject.asObservable());
        spyOn(service.dialog, 'open').and.returnValue(spy);
        service.openUserGuide();
        newSubject.next(null);
        const result = ((service as any).drawingService.shortcutEnable = true);
        expect(result).toBeTruthy();
    });
});
