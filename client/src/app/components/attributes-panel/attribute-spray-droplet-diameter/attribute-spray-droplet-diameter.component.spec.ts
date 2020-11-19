import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SprayDropletDiameterService } from '@app/services/tool-modifier/spraydropletdiameter/spraydropletdiameter.service';
import { AttributeSprayDropletDiameterComponent } from './attribute-spray-droplet-diameter.component';
// tslint:disable: max-line-length
describe('AttributeSprayDropletDiameterComponent', () => {
    let component: AttributeSprayDropletDiameterComponent;
    let fixture: ComponentFixture<AttributeSprayDropletDiameterComponent>;
    let sprayDropletDiameterService: SprayDropletDiameterService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AttributeSprayDropletDiameterComponent],
                providers: [SprayDropletDiameterService],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeSprayDropletDiameterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        sprayDropletDiameterService = TestBed.inject(SprayDropletDiameterService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' should initiate the spray droplet diameter with the values of the sprayDroletDiameter service', () => {
        const componentsprayDiameterDroplet: number = component.sprayDropletDiameter;
        const sprayDropletDiameter: number = sprayDropletDiameterService.getSprayDropletDiameter();
        expect(componentsprayDiameterDroplet).toEqual(sprayDropletDiameter);
    });

    it('the  spray droplet diameter should change to the input spray droplet diameter upon confirmation of the parameters choice', () => {
        const newSprayDropletDiameter = 10;

        component.sprayDropletDiameter = newSprayDropletDiameter;
        component.assign();
        const sprayDiameter: number = sprayDropletDiameterService.getSprayDropletDiameter();
        expect(sprayDiameter).toEqual(newSprayDropletDiameter);
    });

    it('if the spray droplet diameter below the minimal accepted value is inserted the spray droplet diameter should go to the minimal value change upon confirmation', () => {
        const newNumberSprayDropletDiameter = sprayDropletDiameterService.MIN_SPRAY_DROPLET_DIAMETER - 1;
        const minimalSprayDropletDiameter = sprayDropletDiameterService.MIN_SPRAY_DROPLET_DIAMETER;

        component.sprayDropletDiameter = newNumberSprayDropletDiameter;
        component.assign();
        const numberSprayDropletDiameter: number = sprayDropletDiameterService.getSprayDropletDiameter();
        expect(numberSprayDropletDiameter).toEqual(minimalSprayDropletDiameter);
    });

    it('if a spray droplet diameter above the maximal accepted value is inserted the spray droplet diameter should change to the maximal value upon confirmation', () => {
        const newNumberSprayDropletDiameter = sprayDropletDiameterService.MAX_SPRAY_DROPLET_DIAMETER + 1;
        const maximalSprayDropletDiameter = sprayDropletDiameterService.MAX_SPRAY_DROPLET_DIAMETER;

        component.sprayDropletDiameter = newNumberSprayDropletDiameter;
        component.assign();
        const numberSprayDropletDiameter: number = sprayDropletDiameterService.getSprayDropletDiameter();
        expect(numberSprayDropletDiameter).toEqual(maximalSprayDropletDiameter);
    });

    it('the input spray droplet diameter value should revert to its original value when cancelling the input change', () => {
        const newNumberSprayDropletDiameter = 10;

        const initialNumberSprayDiameter: number = component.sprayDropletDiameter;

        component.sprayDropletDiameter = newNumberSprayDropletDiameter;
        component.revert();
        const numberSprayDropletDiameter: number = sprayDropletDiameterService.getSprayDropletDiameter();
        expect(numberSprayDropletDiameter).toEqual(initialNumberSprayDiameter);
    });

    it('if the spray diameter is changed, there should be a need for confirmation', () => {
        component.sprayDropletDiameter = component.sprayDropletDiameter + 1;
        const needForConfirmation: boolean = component.needConfirmation();
        expect(needForConfirmation).toEqual(true);
    });
});
