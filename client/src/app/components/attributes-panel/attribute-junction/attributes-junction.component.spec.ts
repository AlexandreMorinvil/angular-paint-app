import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JunctionService } from '@app/services/tool-modifier/junction/junction.service';
import { AttributeJunctionComponent } from './attributes-junction.component';

describe('AttributeJunctionComponent', () => {
    let component: AttributeJunctionComponent;
    let fixture: ComponentFixture<AttributeJunctionComponent>;
    let junctionService: JunctionService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttributeJunctionComponent],
            providers: [JunctionService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeJunctionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        junctionService = TestBed.inject(JunctionService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('the juntion diameter of the component should be initiated to the values of the junction service', () => {
        const componentDiameter: number = component.diameter;
        const serviceDiameter: number = junctionService.getDiameter();
        expect(componentDiameter).toEqual(serviceDiameter);
    });

    it('the diameter should change to the input diameter upon confirmation of the junction parameters choice', () => {
        const newWidth = 27;

        component.diameter = newWidth;
        component.assign();

        const width: number = junctionService.getDiameter();

        expect(width).toEqual(newWidth);
    });

    it('the hasJunctionPoint should change to the input hasJunctionPoint upon confirmation of the junction parameters choice', () => {
        const newHasJunctionPoint = true;

        component.hasJunctionPoint = newHasJunctionPoint;
        component.assign();

        const hasJunctionPoint: boolean = junctionService.getHasJunctionPoint();

        expect(hasJunctionPoint).toEqual(newHasJunctionPoint);
    });

    it('if a diameter below the minimal accepted value is inserted the diameter should go to the minimal diameter change upon confirmation', () => {
        const newDiameter = junctionService.MIN_JUNCTION_DIAMETER - 1;
        const minimalDiameter = junctionService.MIN_JUNCTION_DIAMETER;

        component.diameter = newDiameter;
        component.assign();

        const diameter: number = junctionService.getDiameter();

        expect(diameter).toEqual(minimalDiameter);
    });

    it('if a diameter above the maximal accepted diameter is inserted the diameter should change to the maximal diameter upon confirmation', () => {
        const newDiameter = junctionService.MAX_JUNCTION_DIAMETER + 1;
        const maximalDiameter = junctionService.MAX_JUNCTION_DIAMETER;

        component.diameter = newDiameter;
        component.assign();

        const diameter: number = junctionService.getDiameter();

        expect(diameter).toEqual(maximalDiameter);
    });

    it('the input diameter value should revert to its original value when cancelling the input change', () => {
        const newDiameter = 17;

        const initialDiameter: number = component.diameter;

        component.diameter = newDiameter;
        component.revert();

        const diameter: number = junctionService.getDiameter();

        expect(diameter).toEqual(initialDiameter);
    });

    it('the input hasJunctionPoint value should revert to its original value when cancelling the input change', () => {
        const newHasJunctionPoint = true;

        const initialHasJunctionPoint: boolean = component.hasJunctionPoint;

        component.hasJunctionPoint = newHasJunctionPoint;
        component.revert();

        const hasJunctionPoint: boolean = junctionService.getHasJunctionPoint();

        expect(hasJunctionPoint).toEqual(initialHasJunctionPoint);
    });

    it('if the width is changed, there should be a need for confirmation', () => {
        component.diameter = component.diameter + 1;
        const needForConfirmation: boolean = component.needConfirmation();
        expect(needForConfirmation).toEqual(true);
    });

    it('if there is a new hasJunctionPoint value there should be a need for a confirmation', () => {
        component.hasJunctionPoint = !component.hasJunctionPoint;
        const needForConfirmation: boolean = component.needConfirmation();
        expect(needForConfirmation).toEqual(true);
    });
});
