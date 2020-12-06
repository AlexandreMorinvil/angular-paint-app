import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ExportDrawingService } from '@app/services/export/export-drawing.service';
import { ExportComponent } from './modal-export.component';
// tslint:disable:no-any
describe('ModalExportComponent', () => {
    let component: ExportComponent;
    let fixture: ComponentFixture<ExportComponent>;

    const exportDrawingServiceStub: jasmine.SpyObj<ExportDrawingService> = jasmine.createSpyObj('ExportDrawingService', [
        'applyFilter',
        ['exportDraw'],
    ]);

    const dialogRefSpy: jasmine.SpyObj<MatDialogRef<ExportComponent, any>> = jasmine.createSpyObj('MatDialogRef', ['close']);

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ExportComponent],
                providers: [
                    { provide: MAT_DIALOG_DATA, useValue: {} },
                    { provide: MatDialogRef, useValue: dialogRefSpy },
                    { provide: MatDialog, useValue: {} },
                    { provide: Router, useValue: {} },
                    { provide: MatTabsModule, useValue: {} },
                    { provide: ExportDrawingService, useValue: exportDrawingServiceStub },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportComponent);
        component = fixture.componentInstance;
        exportDrawingServiceStub.applyFilter.and.stub();
        exportDrawingServiceStub.exportDraw.and.callThrough();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('export to PNG should call exportDraw', () => {
        (component as any).validateValue = () => true;
        component.exportToPNG();
        expect(exportDrawingServiceStub.exportDraw).toHaveBeenCalled();
    });

    it('export to JPG should call exportDraw', () => {
        (component as any).validateValue = () => true;
        component.exportToJPG();
        expect(exportDrawingServiceStub.exportDraw).toHaveBeenCalled();
    });

    it('applyFilter should call service', () => {
        (component as any).validateValue = () => true;
        component.applyFilter('Aucun');
        expect(exportDrawingServiceStub.applyFilter).toHaveBeenCalled();
    });

    it('export to JPG should not call exportDraw', () => {
        exportDrawingServiceStub.exportDraw.calls.reset();
        (component as any).validateValue = () => false;
        component.exportToJPG();
        expect(exportDrawingServiceStub.exportDraw).not.toHaveBeenCalled();
    });

    it('export to PNG should not call exportDraw', () => {
        exportDrawingServiceStub.exportDraw.calls.reset();
        (component as any).validateValue = () => false;
        component.exportToPNG();
        expect(exportDrawingServiceStub.exportDraw).not.toHaveBeenCalled();
    });

    it('should have a valid value', () => {
        component.drawingName.setValue('dessin');
        const val = (component as any).validateValue();
        expect(val).toBeTrue();
    });

    it('should prevent defaut key on Ctrl+E pressed', () => {
        const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 'e' });
        const spy = spyOn(event, 'preventDefault');
        component.onKeyDown(event);
        expect(spy).toHaveBeenCalled();
    });

    it('should not prevent defaut key on other key  pressed', () => {
        const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 's' });
        const spy = spyOn(event, 'preventDefault');
        component.onKeyDown(event);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should not have a valid value', () => {
        component.drawingName.setValue('');
        const val = (component as any).validateValue();
        expect(val).toBeFalse();
    });
});
