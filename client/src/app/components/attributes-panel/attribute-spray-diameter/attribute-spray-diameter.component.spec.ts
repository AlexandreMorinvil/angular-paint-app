import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AttributeSprayDiameterComponent } from './attribute-spray-diameter.component';

describe('AttributeSprayDiameterComponent', () => {
    let component: AttributeSprayDiameterComponent;
    let fixture: ComponentFixture<AttributeSprayDiameterComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AttributeSprayDiameterComponent],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeSprayDiameterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
