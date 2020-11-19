import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { SpacingService } from '@app/services/tool-modifier/spacing/spacing.service';
import { GridService } from '@app/services/tools/grid/grid.service';
import { AttributeSpacingComponent } from './attributes-spacing.component';

describe('AttributeSpacingComponent', () => {
    let component: AttributeSpacingComponent;
    let fixture: ComponentFixture<AttributeSpacingComponent>;
    let spacingService: SpacingService;
    let gridService: GridService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AttributeSpacingComponent],
                providers: [SpacingService],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeSpacingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        spacingService = TestBed.inject(SpacingService);
        gridService = TestBed.inject(GridService);
        gridService.gridCanvas = canvasTestHelper.canvas;
        gridService.gridCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('the spacing of the component should be initiated with the values of the spacing service', () => {
        const componentSpacing: number = component.spacingDisplayed;
        const serviceSpacing: number = spacingService.getSpacing();
        expect(componentSpacing).toEqual(serviceSpacing);
    });

    it('the spacing should change to the input value upon confirmation of the spacing choice', () => {
        const newSpacing = 27;

        component.spacingDisplayed = newSpacing;
        component.assign();

        const spacing: number = spacingService.getSpacing();

        expect(spacing).toEqual(newSpacing);
    });

    it('if a spacing below the minimal accepted spacing is inserted the spacing should change to the minimal spacing upon confirmation', () => {
        const newSpacing = spacingService.MIN_ATTRIBUTE_SPACING - 1;
        const minSpacing = spacingService.MIN_ATTRIBUTE_SPACING;

        component.spacingDisplayed = newSpacing;
        component.assign();

        const spacing: number = spacingService.getSpacing();

        expect(spacing).toEqual(minSpacing);
    });

    it('if a spacing above the maximal accepted spacing is inserted the spacing should change to the maximal spacing upon confirmation', () => {
        const upperOffset = 10;
        const newSpacing = spacingService.MAX_ATTRIBUTE_SPACING + upperOffset;
        const maxSpacing = spacingService.MAX_ATTRIBUTE_SPACING;

        component.spacingDisplayed = newSpacing;
        component.assign();

        const spacing: number = spacingService.getSpacing();

        expect(spacing).toEqual(maxSpacing);
    });

    it('the input spacing value should revert to its original value when cancelling the input change', () => {
        const newSpacing = 17;

        const initialSpacing: number = component.spacingDisplayed;

        component.spacingDisplayed = newSpacing;
        component.revert();

        const spacing: number = spacingService.getSpacing();

        expect(spacing).toEqual(initialSpacing);
    });

    it('if the spacing is changed, there should be a need for confirmation', () => {
        component.spacingDisplayed = component.spacingDisplayed + 1;
        const needForConfirmation: boolean = component.needConfirmation();
        expect(needForConfirmation).toEqual(true);
    });
});
