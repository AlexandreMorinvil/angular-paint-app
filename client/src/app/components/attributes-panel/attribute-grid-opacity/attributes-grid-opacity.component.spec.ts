import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { GridOpacityService } from '@app/services/tool-modifier/grid-opacity/grid-opacity.service';
import { GridService } from '@app/services/tools/grid/grid.service';
import { AttributeGridOpacityComponent } from './attributes-grid-opacity.component';

describe('AttributeGridOpacityComponent', () => {
    let component: AttributeGridOpacityComponent;
    let fixture: ComponentFixture<AttributeGridOpacityComponent>;
    let gridOpacityService: GridOpacityService;
    let gridService: GridService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AttributeGridOpacityComponent],
                providers: [GridOpacityService, GridService],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeGridOpacityComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        gridOpacityService = TestBed.inject(GridOpacityService);
        gridService = TestBed.inject(GridService);
        gridService.gridCanvas = canvasTestHelper.canvas;
        gridService.gridCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('the gridOpacity of the component should be initiated with the values of the gridOpacity service', () => {
        const componentGridOpacity: number = component.gridOpacityDisplayed;
        const serviceGridOpacity: number = gridOpacityService.getGridOpacity();
        expect(componentGridOpacity).toEqual(serviceGridOpacity);
    });

    it('the gridOpacity should change to the input value upon confirmation of the gridOpacity choice', () => {
        const newGridOpacity = 0.27;

        component.gridOpacityDisplayed = newGridOpacity;
        component.assign();

        const gridOpacity: number = gridOpacityService.getGridOpacity();

        expect(gridOpacity).toEqual(newGridOpacity);
    });

    it('if a gridOpacity below the minimal accepted gridOpacity is inserted the gridOpacity should change to the minimal gridOpacity upon confirmation', () => {
        const newGridOpacity = gridOpacityService.MIN_ATTRIBUTE_GRID_OPACITY - 1;
        const minGridOpacity = gridOpacityService.MIN_ATTRIBUTE_GRID_OPACITY;

        component.gridOpacityDisplayed = newGridOpacity;
        component.assign();

        const gridOpacity: number = gridOpacityService.getGridOpacity();

        expect(gridOpacity).toEqual(minGridOpacity);
    });

    it('if a gridOpacity above the maximal accepted gridOpacity is inserted the gridOpacity should change to the maximal gridOpacity upon confirmation', () => {
        const upperOffset = 10;
        const newGridOpacity = gridOpacityService.MAX_ATTRIBUTE_GRID_OPACITY + upperOffset;
        const maxGridOpacity = gridOpacityService.MAX_ATTRIBUTE_GRID_OPACITY;

        component.gridOpacityDisplayed = newGridOpacity;
        component.assign();

        const gridOpacity: number = gridOpacityService.getGridOpacity();

        expect(gridOpacity).toEqual(maxGridOpacity);
    });

    it('the input gridOpacity value should revert to its original value when cancelling the input change', () => {
        const newGridOpacity = 17;

        const initialGridOpacity: number = component.gridOpacityDisplayed;

        component.gridOpacityDisplayed = newGridOpacity;
        component.revert();

        const gridOpacity: number = gridOpacityService.getGridOpacity();

        expect(gridOpacity).toEqual(initialGridOpacity);
    });

    it('if the gridOpacity is changed, there should be a need for confirmation', () => {
        component.gridOpacityDisplayed = component.gridOpacityDisplayed + 1;
        const needForConfirmation: boolean = component.needConfirmation();
        expect(needForConfirmation).toEqual(true);
    });
});
