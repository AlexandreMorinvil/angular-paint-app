import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IndexService } from '@app/services/index/index.service';
import { UserGuideModalComponent } from '../user-guide-modal/user-guide-modal.component';
import { MainPageComponent } from './main-page.component';

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let userGuideModalService: UserGuideModalComponent;
    let fixture: ComponentFixture<MainPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent, UserGuideModalComponent, userGuideModalService],
            providers: [{ provide: IndexService }],
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

    it('should create new userGuideModalService ', () => {
        component.openUserGuide();
        expect(userGuideModalService).toHaveBeenCalled();
    });
});
