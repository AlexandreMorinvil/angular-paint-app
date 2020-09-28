import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeTracingComponent } from './attributes-tracing.component';

describe('AttributeTracingComponent', () => {
    let component: AttributeTracingComponent;
    let fixture: ComponentFixture<AttributeTracingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttributeTracingComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeTracingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
