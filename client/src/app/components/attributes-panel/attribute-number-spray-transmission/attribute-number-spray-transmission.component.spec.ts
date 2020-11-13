import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NumberSprayTransmissionService } from '@app/services/tool-modifier/numberspraytransmission/numberspraytransmission.service';
import { AttributeNumberSprayTransmissionComponent } from './attribute-number-spray-transmission.component';

describe('AttributeNumberSprayTransmissionComponent', () => {
    let component: AttributeNumberSprayTransmissionComponent;
    let fixture: ComponentFixture<AttributeNumberSprayTransmissionComponent>;
    let sprayTransmissionService: NumberSprayTransmissionService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AttributeNumberSprayTransmissionComponent],
                providers: [NumberSprayTransmissionService],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeNumberSprayTransmissionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        sprayTransmissionService = TestBed.inject(NumberSprayTransmissionService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(' should initiate the number of spray transmission with the values of the numberspraytransmission service', () => {
        const componentNumberSprayTransmission: number = component.numberSprayTransmission;
        const numberSprayTransmissionService: number = sprayTransmissionService.getNumberSprayTransmission();
        expect(componentNumberSprayTransmission).toEqual(numberSprayTransmissionService);
    });

    it('the number of spray transmission should change to the input number spray transmission upon confirmation of the parameters choice', () => {
        const newNumberSprayTransmission = 50;

        component.numberSprayTransmission = newNumberSprayTransmission;
        component.assign();
        const numberSpayTransmission: number = sprayTransmissionService.getNumberSprayTransmission();
        expect(numberSpayTransmission).toEqual(newNumberSprayTransmission);
    });

    it('if the number of spray transmssion below the minimal accepted value is inserted the number spray transmision should go to the minimal value change upon confirmation', () => {
        const newNumberSprayTransmission = sprayTransmissionService.MIN_NUMBER_SPRAY_TRANSMISSION - 1;
        const minimalSprayTransmission = sprayTransmissionService.MIN_NUMBER_SPRAY_TRANSMISSION;

        component.numberSprayTransmission = newNumberSprayTransmission;
        component.assign();
        const numberSprayTransmission: number = sprayTransmissionService.getNumberSprayTransmission();
        expect(numberSprayTransmission).toEqual(minimalSprayTransmission);
    });

    it('if a number of spray transmission above the maximal accepted value is inserted the number spray transmission should change to the maximal value upon confirmation', () => {
        const newNumberSprayTransmission = sprayTransmissionService.MAX_NUMBER_SPRAY_TRANSMISSION + 1;
        const maximalSprayTransmission = sprayTransmissionService.MAX_NUMBER_SPRAY_TRANSMISSION;

        component.numberSprayTransmission = newNumberSprayTransmission;
        component.assign();
        const numberSprayTransmission: number = sprayTransmissionService.getNumberSprayTransmission();
        expect(numberSprayTransmission).toEqual(maximalSprayTransmission);
    });

    it('the input number spray value should revert to its original value when cancelling the input change', () => {
        const newNumberSprayTransmission = 50;

        const initialNumberSprayTransmission: number = component.numberSprayTransmission;

        component.numberSprayTransmission = newNumberSprayTransmission;
        component.revert();
        const numberSprayTransmission: number = sprayTransmissionService.getNumberSprayTransmission();
        expect(numberSprayTransmission).toEqual(initialNumberSprayTransmission);
    });

    it('if the number spray transmission is changed, there should be a need for confirmation', () => {
        component.numberSprayTransmission = component.numberSprayTransmission + 1;
        const needForConfirmation: boolean = component.needConfirmation();
        expect(needForConfirmation).toEqual(true);
    });
});
