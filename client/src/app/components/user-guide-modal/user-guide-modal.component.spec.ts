/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { UserGuideModalComponent } from './user-guide-modal.component';

describe('UserGuideModalComponent', () => {
    let component: UserGuideModalComponent;
    let fixture: ComponentFixture<UserGuideModalComponent>;

    // tslint:disable-next-line: no-any
    const dialogRefSpy: jasmine.SpyObj<MatDialogRef<UserGuideModalComponent, any>> = jasmine.createSpyObj('MatDialogRef', ['close']);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserGuideModalComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: MatDialog, useValue: {} },
                { provide: Router, useValue: {} },
                { provide: MatTabsModule, useValue: {} },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserGuideModalComponent);
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
