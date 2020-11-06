import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AttributeColorPickerViewerComponent } from './attribute-color-picker-viewer.component';

describe('AttributeColorPickerViewerComponent', () => {
    let component: AttributeColorPickerViewerComponent;
    let fixture: ComponentFixture<AttributeColorPickerViewerComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AttributeColorPickerViewerComponent],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeColorPickerViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
