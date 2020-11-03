import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { AttributeWidthComponent } from './attributes-width.component';

describe('AttributeWidthComponent', () => {
    let component: AttributeWidthComponent;
    let fixture: ComponentFixture<AttributeWidthComponent>;
    let widthService: WidthService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AttributeWidthComponent],
                providers: [WidthService],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeWidthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        widthService = TestBed.inject(WidthService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('the width of the component should be initiated with the values of the width service', () => {
        const componentWidth: number = component.widthDisplayed;
        const serviceWidth: number = widthService.getWidth();
        expect(componentWidth).toEqual(serviceWidth);
    });

    it('the width should change to the input value upon confirmation of the width choice', () => {
        const newWidth = 27;

        component.widthDisplayed = newWidth;
        component.assign();

        const width: number = widthService.getWidth();

        expect(width).toEqual(newWidth);
    });

    it('if a width below the minimal accepted width is inserted the width should change to the minimal width upon confirmation', () => {
        const newWidth = widthService.MIN_ATTRIBUTE_WIDTH - 1;
        const minWidth = widthService.MIN_ATTRIBUTE_WIDTH;

        component.widthDisplayed = newWidth;
        component.assign();

        const width: number = widthService.getWidth();

        expect(width).toEqual(minWidth);
    });

    it('if a width above the maximal accepted width is inserted the width should change to the maximal width upon confirmation', () => {
        const upperOffset = 10;
        const newWidth = widthService.MAX_ATTRIBUTE_WIDTH + upperOffset;
        const maxWidth = widthService.MAX_ATTRIBUTE_WIDTH;

        component.widthDisplayed = newWidth;
        component.assign();

        const width: number = widthService.getWidth();

        expect(width).toEqual(maxWidth);
    });

    it('the input width value should revert to its original value when cancelling the input change', () => {
        const newWidth = 17;

        const initialWidth: number = component.widthDisplayed;

        component.widthDisplayed = newWidth;
        component.revert();

        const width: number = widthService.getWidth();

        expect(width).toEqual(initialWidth);
    });

    it('if the width is changed, there should be a need for confirmation', () => {
        component.widthDisplayed = component.widthDisplayed + 1;
        const needForConfirmation: boolean = component.needConfirmation();
        expect(needForConfirmation).toEqual(true);
    });
});
