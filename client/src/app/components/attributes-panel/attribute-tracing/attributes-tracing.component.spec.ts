import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { AttributeTracingComponent } from './attributes-tracing.component';

describe('AttributeTracingComponent', () => {
    let component: AttributeTracingComponent;
    let fixture: ComponentFixture<AttributeTracingComponent>;
    let tracingService: TracingService;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AttributeTracingComponent],
                providers: [TracingService],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeTracingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        tracingService = TestBed.inject(TracingService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('the hasFill and hasContour of the component should be initiated with the values of the texture service', () => {
        const componentHasFill: boolean = component.hasFill;
        const componentHasContour: boolean = component.hasContour;

        const serviceHasFill: boolean = tracingService.getHasFill();
        const serviceHasContour: boolean = tracingService.getHasContour();

        expect(componentHasFill).toEqual(serviceHasFill);
        expect(componentHasContour).toEqual(serviceHasContour);
    });

    it('The fill and contour directive should change to the input value upon confirmation of the true/false choice', () => {
        const newBooleanValue = true;

        component.hasFill = newBooleanValue;
        component.hasContour = newBooleanValue;
        component.assign();

        const hasFill: boolean = tracingService.getHasFill();
        const hasContour: boolean = tracingService.getHasContour();

        expect(hasFill).toEqual(newBooleanValue);
        expect(hasContour).toEqual(newBooleanValue);
    });

    it('The hasFill and hasContour value should revert to their original value when changing cancelling the input', () => {
        const newBooleanValue = true;

        const initialHasFill = component.hasFill;
        const iniitialHasContour = component.hasContour;

        component.hasFill = newBooleanValue;
        component.hasContour = newBooleanValue;
        component.revert();

        const hasFill: boolean = tracingService.getHasFill();
        const hasContour: boolean = tracingService.getHasContour();

        expect(hasFill).toEqual(initialHasFill);
        expect(hasContour).toEqual(iniitialHasContour);
    });

    it('if there is a new hasContour value there should be a need for a confirmation', () => {
        component.hasContour = !component.hasContour;
        const needForConfirmation: boolean = component.needConfirmation();
        expect(needForConfirmation).toEqual(true);
    });

    it('if there is a new hasContour value there should be a need for a confirmation', () => {
        component.hasFill = !component.hasFill;
        const needForConfirmation: boolean = component.needConfirmation();
        expect(needForConfirmation).toEqual(true);
    });
});
