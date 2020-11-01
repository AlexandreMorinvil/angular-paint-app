import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AttributesToleranceComponent } from './attributes-tolerance.component';

describe('AttributesToleranceComponent', () => {
    let component: AttributesToleranceComponent;
    let fixture: ComponentFixture<AttributesToleranceComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttributesToleranceComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributesToleranceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
