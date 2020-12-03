import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ContinueDrawingModalComponent } from './modal-continue-drawing.component';

// tslint:disable: no-any
describe('UserGuideModalComponent', () => {
    let component: ContinueDrawingModalComponent;
    let fixture: ComponentFixture<ContinueDrawingModalComponent>;
    const dialogRefSpy: jasmine.SpyObj<MatDialogRef<ContinueDrawingModalComponent, any>> = jasmine.createSpyObj('MatDialogRef', ['close']);

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [ContinueDrawingModalComponent],
                providers: [
                    { provide: MAT_DIALOG_DATA, useValue: {} },
                    { provide: MatDialogRef, useValue: dialogRefSpy },
                    { provide: MatDialog, useValue: {} },
                    { provide: Router, useValue: {} },
                    { provide: MatTabsModule, useValue: {} },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(ContinueDrawingModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close the modal', () => {
        component.onNoClick();
        expect(dialogRefSpy.close).toHaveBeenCalled();
    });
});
