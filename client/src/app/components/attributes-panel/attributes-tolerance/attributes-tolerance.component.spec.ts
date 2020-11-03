import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToleranceService } from '@app/services/tool-modifier/tolerance/tolerance.service';
import { AttributesToleranceComponent } from './attributes-tolerance.component';

describe('AttributesToleranceComponent', () => {
    let component: AttributesToleranceComponent;
    let fixture: ComponentFixture<AttributesToleranceComponent>;
    let toleranceService: ToleranceService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttributesToleranceComponent],
            providers: [ToleranceService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributesToleranceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        toleranceService = TestBed.inject(ToleranceService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be initiated with the values of the tolerance service', () => {
        const componentTolerance: number = component.tolerance;
        const serviceTolerance: number = toleranceService.getPercentTolerance();
        expect(componentTolerance).toEqual(serviceTolerance);
    });

    it('should insert the tolerance and change to the minimal tolerance upon confirmation', () => {
        // Magic number is only for testing purposes
        // tslint:disable:no-magic-numbers
        component.tolerance = -10;

        component.assign();

        const tolerance: number = toleranceService.getPercentTolerance();

        expect(tolerance).toEqual(component.getMinValue());
    });

    it('if a tolerance is canceled the tolerance should revert back after canceling', () => {
        component.tolerance = 2;
        const tolerance: number = toleranceService.getPercentTolerance();

        component.revert();

        expect(component.tolerance).toEqual(tolerance);
    });
});
