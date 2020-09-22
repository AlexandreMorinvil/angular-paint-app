import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeWidthComponent } from './attributes-texture.component';

describe('AttributeTextureComponent', () => {
    let component: AttributeWidthComponent;
    let fixture: ComponentFixture<AttributeWidthComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttributeWidthComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeWidthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
