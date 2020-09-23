import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeTextureComponent } from './attributes-texture.component';

describe('AttributeTextureComponent', () => {
    let component: AttributeTextureComponent;
    let fixture: ComponentFixture<AttributeTextureComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttributeTextureComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeTextureComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
