import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AttributeSprayDropletDiameterComponent } from './attribute-spray-droplet-diameter.component';

describe('AttributeSprayDropletDiameterComponent', () => {
    let component: AttributeSprayDropletDiameterComponent;
    let fixture: ComponentFixture<AttributeSprayDropletDiameterComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AttributeSprayDropletDiameterComponent],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeSprayDropletDiameterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
