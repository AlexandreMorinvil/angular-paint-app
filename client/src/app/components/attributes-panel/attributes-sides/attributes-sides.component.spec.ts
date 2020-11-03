import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AttributesSidesComponent } from '@app/components/attributes-panel/attributes-sides/attributes-sides.component';
import { SidesService } from '@app/services/tool-modifier/sides/sides.service';

describe('AttributesSidesComponent', () => {
    let component: AttributesSidesComponent;
    let fixture: ComponentFixture<AttributesSidesComponent>;
    let sidesService: SidesService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AttributesSidesComponent],
                providers: [SidesService],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributesSidesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        sidesService = TestBed.inject(SidesService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('the number of side of the component should be initiated to the values of the sides service', () => {
        const componentSides: number = component.numberSides;
        const serviceSides: number = sidesService.getSide();
        expect(componentSides).toEqual(serviceSides);
    });

    it('the number of side should change to the input number side upon confirmation of the side parameters choice', () => {
        const newSide = 4;

        component.numberSides = newSide;
        component.assign();
        const side: number = sidesService.getSide();
        expect(side).toEqual(newSide);
    });

    it('if the number of side below the minimal accepted value is inserted the side should go to the minimal side change upon confirmation', () => {
        const newSide = sidesService.MIN_POLYGON_SIDE - 1;
        const minimalSide = sidesService.MIN_POLYGON_SIDE;

        component.numberSides = newSide;
        component.assign();
        const side: number = sidesService.getSide();
        expect(side).toEqual(minimalSide);
    });

    it('if a number of side above the maximal accepted side is inserted the side should change to the maximal side upon confirmation', () => {
        const newSide = sidesService.MAX_POLYGON_SIDE + 1;
        const maximalSide = sidesService.MAX_POLYGON_SIDE;

        component.numberSides = newSide;
        component.assign();
        const side: number = sidesService.getSide();
        expect(side).toEqual(maximalSide);
    });

    it('the input side value should revert to its original value when cancelling the input change', () => {
        const newSide = 3;

        const initialSide: number = component.numberSides;

        component.numberSides = newSide;
        component.revert();
        const side: number = sidesService.getSide();
        expect(side).toEqual(initialSide);
    });

    it('if the number of side is changed, there should be a need for confirmation', () => {
        component.numberSides = component.numberSides + 1;
        const needForConfirmation: boolean = component.needConfirmation();
        expect(needForConfirmation).toEqual(true);
    });
});
