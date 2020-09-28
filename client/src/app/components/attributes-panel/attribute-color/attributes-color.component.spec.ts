import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeColorComponent } from './attributes-color.component';

describe('AttributeColorComponent', () => {
    let component: AttributeColorComponent;
    let fixture: ComponentFixture<AttributeColorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttributeColorComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeColorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
