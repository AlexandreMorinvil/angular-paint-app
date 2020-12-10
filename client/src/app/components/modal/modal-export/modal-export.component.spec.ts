import { HttpClient, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { ApiDrawingService } from '@app/services/api/api-drawing/api-drawing.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportDrawingService } from '@app/services/export/export-drawing.service';
import { SaveService } from '@app/services/save/save.service';
import { ExportComponent } from './modal-export.component';
// tslint:disable:no-any
describe('ModalExportComponent', () => {
    let component: ExportComponent;
    let fixture: ComponentFixture<ExportComponent>;
    let basicPostSpy: jasmine.Spy<any>;
    let sendEmailToServerSpy: jasmine.Spy<any>;
    let canvasStub: HTMLCanvasElement;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

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
                    DrawingService,
                    ApiDrawingService,
                    SaveService,
                    HttpClientTestingModule,
                    HttpClient,
                    HttpTestingController,
                    HttpHandler,
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ExportComponent);
        component = fixture.componentInstance;
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;
        exportDrawingServiceStub.applyFilter.and.stub();
        exportDrawingServiceStub.exportDraw.and.callThrough();

        fixture.detectChanges();
        (component as any).saveService.drawingService.baseCtx = baseCtxStub;
        (component as any).saveService.drawingService.previewCtx = previewCtxStub;
        (component as any).saveService.drawingService.canvas = canvasStub;
        // tslint:disable:no-magic-numbers
        (component as any).saveService.drawingService.canvas.width = 1000;
        (component as any).saveService.drawingService.canvas.height = 800;
        basicPostSpy = spyOn<any>((component as any).apiDrawingService, 'sendEmail').and.callThrough();
        sendEmailToServerSpy = spyOn<any>(component, 'sendEmailToServer');
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

    it('should return true if email is not empty', () => {
        const val = (component as any).validateEmail('a@hotmail.com');
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

    it('send Email to server should call basic post if name and email is valid', () => {
        (component as any).drawName.value = 'name';
        (component as any).email.value = 'la@hotmail.com';
        sendEmailToServerSpy.and.callThrough();
        component.sendEmailToServer('png');
        expect(basicPostSpy).toHaveBeenCalled();
    });

    it('send Email to server should not call basic post if name is invalid', () => {
        sendEmailToServerSpy.and.callThrough();
        (component as any).drawName.value = '';
        (component as any).email.value = 'la@hotmail.com';
        component.sendEmailToServer('png');
        expect(basicPostSpy).not.toHaveBeenCalled();
    });

    it('send Email to server should not call basic post if email is invalid', () => {
        sendEmailToServerSpy.and.callThrough();
        (component as any).drawName.value = 'name';
        (component as any).email.value = '';
        component.sendEmailToServer('png');
        expect(basicPostSpy).not.toHaveBeenCalled();
    });

    // it('send Email to png should not call send email to server if the image source is not png', () => {
    //     (component as any).drawName.value = 'name';
    //     (component as any).email.value = 'la@hotmail.com';
    //     (component as any).saveService.imageSource = 'data:image/png;base64, invalidpng';
    //     component.sendEmailToPNG('jpeg');
    //     expect(sendEmailToServerSpy).not.toHaveBeenCalled();
    // });

    // it('send Email to png should call send email to server if the image source is valid png', () => {
    //     (component as any).drawName.value = 'name';
    //     (component as any).email.value = 'la@hotmail.com';
    //     (component as any).saveService.imageSource = 'data:image/png;base64,iVBORw0KGgo';
    //     component.sendEmailToPNG('png');
    //     expect(sendEmailToServerSpy).toHaveBeenCalled();
    // });

    // it('send Email to jpeg should call send email to server if the image source is valid jpeg', () => {
    //     (component as any).drawName.value = 'name';
    //     (component as any).email.value = 'la@hotmail.com';
    //     (component as any).saveService.imageSource = 'data:image/jpeg;base64,/9j/4AAQSkZJRgAB';
    //     component.sendEmailToJPG('jpeg');
    //     expect(sendEmailToServerSpy).toHaveBeenCalled();
    // });

    // it('send Email to jpeg should not call send email to server if the image source is not jpeg', () => {
    //     (component as any).drawName.value = 'name';
    //     (component as any).email.value = 'la@hotmail.com';
    //     (component as any).saveService.imageSource = 'data:image/jpeg;base64,invalidjpeg';
    //     component.sendEmailToJPG('png');
    //     expect(sendEmailToServerSpy).not.toHaveBeenCalled();
    // });
});
