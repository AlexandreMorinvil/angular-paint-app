import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributesSidesComponent } from './attributes-sides.component';

describe('AttributesSidesComponent', () => {
    let component: AttributesSidesComponent;
    let fixture: ComponentFixture<AttributesSidesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttributesSidesComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributesSidesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
