import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AttributesToleranceComponent } from './attributes-tolerance.component';

describe('AttributesToleranceComponent', () => {
    let component: AttributesToleranceComponent;
    let fixture: ComponentFixture<AttributesToleranceComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AttributesToleranceComponent],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributesToleranceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
