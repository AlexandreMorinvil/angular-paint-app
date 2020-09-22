import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributesWidthomponent } from './attributes-width.component';

describe('AttributesWidthomponent', () => {
    let component: AttributesWidthomponent;
    let fixture: ComponentFixture<AttributesWidthomponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttributesWidthomponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributesWidthomponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
