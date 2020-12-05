import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SprayDiameterService } from '@app/services/tool-modifier/spray-diameter/spray-diameter.service';
import { AttributeSprayDiameterComponent } from './attribute-spray-diameter.component';

// tslint:disable: max-line-length
describe('AttributeSprayDiameterComponent', () => {
    let component: AttributeSprayDiameterComponent;
    let fixture: ComponentFixture<AttributeSprayDiameterComponent>;
    let sprayDiameterService: SprayDiameterService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AttributeSprayDiameterComponent],
                providers: [SprayDiameterService],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeSprayDiameterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        sprayDiameterService = TestBed.inject(SprayDiameterService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' should initiate the spray diameter with the values of the sprayDiameter service', () => {
        const componentsprayDiameter: number = component.sprayDiameter;
        const sprayDiameter: number = sprayDiameterService.getSprayDiameter();
        expect(componentsprayDiameter).toEqual(sprayDiameter);
    });

    it('the  spray diameter should change to the input spray diameter upon confirmation of the parameters choice', () => {
        const newSprayDiameter = 10;

        component.sprayDiameter = newSprayDiameter;
        component.assign();
        const sprayDiameter: number = sprayDiameterService.getSprayDiameter();
        expect(sprayDiameter).toEqual(newSprayDiameter);
    });

    it('if the  spray diameter below the minimal accepted value is inserted the spray diameter should go to the minimal value change upon confirmation', () => {
        const newNumberSprayDiameter = sprayDiameterService.MIN_SPRAY_DIAMETER - 1;
        const minimalSprayDiameter = sprayDiameterService.MIN_SPRAY_DIAMETER;

        component.sprayDiameter = newNumberSprayDiameter;
        component.assign();
        const numberSprayDiameter: number = sprayDiameterService.getSprayDiameter();
        expect(numberSprayDiameter).toEqual(minimalSprayDiameter);
    });

    it('if a spray diameter above the maximal accepted value is inserted the spray diameter should change to the maximal value upon confirmation', () => {
        const newNumberSprayDiameter = sprayDiameterService.MAX_SPRAY_DIAMETER + 1;
        const maximalSprayDiameter = sprayDiameterService.MAX_SPRAY_DIAMETER;

        component.sprayDiameter = newNumberSprayDiameter;
        component.assign();
        const numberSprayDiameter: number = sprayDiameterService.getSprayDiameter();
        expect(numberSprayDiameter).toEqual(maximalSprayDiameter);
    });

    it('the input spray diameter value should revert to its original value when cancelling the input change', () => {
        const newNumberSprayDiameter = 10;

        const initialNumberSprayDiameter: number = component.sprayDiameter;

        component.sprayDiameter = newNumberSprayDiameter;
        component.revert();
        const numberSprayDiameter: number = sprayDiameterService.getSprayDiameter();
        expect(numberSprayDiameter).toEqual(initialNumberSprayDiameter);
    });

    it('if the spray diameter is changed, there should be a need for confirmation', () => {
        component.sprayDiameter = component.sprayDiameter + 1;
        const needForConfirmation: boolean = component.needConfirmation();
        expect(needForConfirmation).toEqual(true);
    });
});
