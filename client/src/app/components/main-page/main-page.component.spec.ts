import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { IndexService } from '@app/services/index/index.service';
import { UserGuideModalService } from '@app/services/user-guide-modal/user-guide-modal.service';
import { UserGuideModalComponent } from '../user-guide-modal/user-guide-modal.component';
import { MainPageComponent } from './main-page.component';

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    const dialogSpy: jasmine.SpyObj<MatDialog> = jasmine.createSpyObj('MatDialog', ['open']);
    // tslint:disable-next-line: no-any
    const dialogRefSpy: jasmine.SpyObj<MatDialogRef<MainPageComponent, any>> = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogSpy.open.and.returnValue(dialogRefSpy);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent, UserGuideModalComponent],
            providers: [
                { provide: IndexService },
                { provide: UserGuideModalService },
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
                { provide: MatDialog, useValue: dialogSpy },
                { provide: UserGuideModalService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open Guide', () => {
        component.openUserGuide();
        expect(dialogSpy.open).toHaveBeenCalled();
    });
});
