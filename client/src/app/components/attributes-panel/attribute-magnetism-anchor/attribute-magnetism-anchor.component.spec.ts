// import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
// import { ColorService } from '@app/services/tool-modifier/color/color.service';
// import { AttributeColorComponent } from './attributes-color.component';
// // The disablement of the "any" tslint rule is justified in this situation as the prototype
// // of the jasmine.Spy type takes a generic argument whose type is by convention of type "any"
// // tslint:disable:no-any
// describe('AttributeColorComponent', () => {
//     let component: AttributeColorComponent;
//     let fixture: ComponentFixture<AttributeColorComponent>;
//     let colorService: ColorService;

//     let validateColorSpy: jasmine.Spy<any>;
//     let validateOpacitySpy: jasmine.Spy<any>;

//     beforeEach(
//         waitForAsync(() => {
//             TestBed.configureTestingModule({
//                 declarations: [AttributeColorComponent],
//                 providers: [ColorService],
//             }).compileComponents();
//         }),
//     );

//     beforeEach(() => {
//         fixture = TestBed.createComponent(AttributeColorComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();

//         colorService = TestBed.inject(ColorService);
//         validateColorSpy = spyOn<any>(colorService, 'validateColor').and.callThrough();
//         validateOpacitySpy = spyOn<any>(colorService, 'validateOpacity').and.callThrough();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('the color input and opacity of the component should be initiated with the values of the color service', () => {
//         const componentPrimaryColor: string = component.primaryColor;
//         const componentSecondaryColor: string = component.secondaryColor;
//         const componentPrimaryOpacity: number = component.primaryOpacity;
//         const componentSecondaryOpacity: number = component.secondaryOpacity;

//         const servicePrimaryColor: string = colorService.getPrimaryColor();
//         const serviceSecondaryColor: string = colorService.getSecondaryColor();
//         const servicePrimaryOpacity: number = colorService.getPrimaryColorOpacity();
//         const serviceSecondaryOpacity: number = colorService.getSecondaryColorOpacity();

//         expect(componentPrimaryColor).toEqual(servicePrimaryColor);
//         expect(componentSecondaryColor).toEqual(serviceSecondaryColor);
//         expect(componentPrimaryOpacity).toEqual(servicePrimaryOpacity);
//         expect(componentSecondaryOpacity).toEqual(serviceSecondaryOpacity);
//     });

//     it('color input for primary and secondary color should accept numbers between 0 and 0xffffff
//          as the rgb color number upon confirmation of the color choice', () => {
//         const newColor = '#aabbcc';
//         component.primaryColor = newColor;
//         component.secondaryColor = newColor;
//         component.assign();

//         const primaryColor: string = colorService.getPrimaryColor();
//         const secondaryColor: string = colorService.getSecondaryColor();

//         expect(primaryColor).toEqual(newColor);
//         expect(secondaryColor).toEqual(newColor);
//     });

//     it('the color input for primary and secondary color should accept the number 0 as the rgb color number upon confirmation', () => {
//         const newColor = '#0';
//         component.primaryColor = newColor;
//         component.secondaryColor = newColor;
//         component.assign();

//         const primaryColor: string = colorService.getPrimaryColor();
//         const secondaryColor: string = colorService.getSecondaryColor();

//         expect(primaryColor).toEqual(newColor);
//         expect(secondaryColor).toEqual(newColor);
//         expect(validateColorSpy.calls.count()).toEqual(2);
//     });

//     it('the color input for primary and secondary color should accept the number 0xffffff as the rgb color number upon confirmation', () => {
//         const newColor = '#ffffff';
//         component.primaryColor = newColor;
//         component.secondaryColor = newColor;
//         component.assign();

//         const primaryColor: string = colorService.getPrimaryColor();
//         const secondaryColor: string = colorService.getSecondaryColor();

//         expect(primaryColor).toEqual(newColor);
//         expect(secondaryColor).toEqual(newColor);
//         expect(validateColorSpy.calls.count()).toEqual(2);
//     });

//     it('the primary and secondary color should not change if a color not respecting the format "#rrggbb" as the input upon confirmation', () => {
//         const newColor = 'ffffff';
//         const initialPrimaryColor = component.primaryColor;
//         const initialSecondaryColor = component.secondaryColor;

//         component.primaryColor = newColor;
//         component.secondaryColor = newColor;
//         component.assign();

//         const primaryColor: string = colorService.getPrimaryColor();
//         const secondaryColor: string = colorService.getSecondaryColor();

//         expect(primaryColor).toEqual(initialPrimaryColor);
//         expect(secondaryColor).toEqual(initialSecondaryColor);
//         expect(validateColorSpy.calls.count()).toEqual(2);
//     });

//     // Opacity tests

//     it('the opacity input for primary and secondary color should accept numbers between 0 and 1 as the opacity input upon confirmation', () => {
//         const newOpacity = 0.25;
//         component.primaryOpacity = newOpacity;
//         component.secondaryOpacity = newOpacity;
//         component.assign();

//         const primaryOpacity: number = colorService.getPrimaryColorOpacity();
//         const secondaryOpacity: number = colorService.getSecondaryColorOpacity();

//         expect(primaryOpacity).toEqual(newOpacity);
//         expect(secondaryOpacity).toEqual(newOpacity);
//         expect(validateOpacitySpy.calls.count()).toEqual(2);
//     });

//     it('the opacity setter for primary and secondary color should accept the number 0 as the opacity input upon confirmation', () => {
//         const newOpacity = 0;
//         component.primaryOpacity = newOpacity;
//         component.secondaryOpacity = newOpacity;
//         component.assign();

//         const primaryOpacity: number = colorService.getPrimaryColorOpacity();
//         const secondaryOpacity: number = colorService.getSecondaryColorOpacity();

//         expect(primaryOpacity).toEqual(newOpacity);
//         expect(secondaryOpacity).toEqual(newOpacity);
//         expect(validateOpacitySpy.calls.count()).toEqual(2);
//     });

//     it('the opacity input for primary and secondary color should accept the number 1 as the opacity input upon confirmation', () => {
//         const newOpacity = 1;
//         component.primaryOpacity = newOpacity;
//         component.secondaryOpacity = newOpacity;
//         component.assign();

//         const primaryOpacity: number = colorService.getPrimaryColorOpacity();
//         const secondaryOpacity: number = colorService.getSecondaryColorOpacity();

//         expect(primaryOpacity).toEqual(newOpacity);
//         expect(secondaryOpacity).toEqual(newOpacity);
//         expect(validateOpacitySpy.calls.count()).toEqual(2);
//     });

//     it('the opacity input for primary and secondary color should accept the number 1 as the opacity input upon confirmation', () => {
//         const newOpacity = 1;
//         component.primaryOpacity = newOpacity;
//         component.secondaryOpacity = newOpacity;
//         component.assign();

//         const primaryOpacity: number = colorService.getPrimaryColorOpacity();
//         const secondaryOpacity: number = colorService.getSecondaryColorOpacity();

//         expect(primaryOpacity).toEqual(newOpacity);
//         expect(secondaryOpacity).toEqual(newOpacity);
//         expect(validateOpacitySpy.calls.count()).toEqual(2);
//     });

//     it('confirming an opacity above 1 in hte opacity input should not modify the opacity', () => {
//         const newOpacity = 1.5;
//         const initialPrimaryOpacity: number = component.primaryOpacity;
//         const initialSecondaryOpacity: number = component.secondaryOpacity;

//         component.primaryOpacity = newOpacity;
//         component.secondaryOpacity = newOpacity;
//         component.assign();

//         const primaryOpacity: number = colorService.getPrimaryColorOpacity();
//         const secondaryOpacity: number = colorService.getSecondaryColorOpacity();

//         expect(primaryOpacity).toEqual(initialPrimaryOpacity);
//         expect(secondaryOpacity).toEqual(initialSecondaryOpacity);
//         expect(validateOpacitySpy.calls.count()).toEqual(2);
//     });

//     it('confirming an opacity below 0 in hte opacity input should not modify the opacity', () => {
//         const newOpacity = -1.5;
//         const initialPrimaryOpacity: number = component.primaryOpacity;
//         const initialSecondaryOpacity: number = component.secondaryOpacity;

//         component.primaryOpacity = newOpacity;
//         component.secondaryOpacity = newOpacity;
//         component.assign();

//         const primaryOpacity: number = colorService.getPrimaryColorOpacity();
//         const secondaryOpacity: number = colorService.getSecondaryColorOpacity();

//         expect(primaryOpacity).toEqual(initialPrimaryOpacity);
//         expect(secondaryOpacity).toEqual(initialSecondaryOpacity);
//         expect(validateOpacitySpy.calls.count()).toEqual(2);
//     });

//     // Color intertwining

//     it('the primary and secondary color should be intertwined after the function intertwineColors is called', () => {
//         const componentInitialPrimaryColor: string = component.primaryColor;
//         const componentInitialSecondaryColor: string = component.secondaryColor;

//         component.intertwineColors();
//         const componentPrimaryColor: string = component.primaryColor;
//         const componentSecondaryColor: string = component.secondaryColor;

//         expect(componentPrimaryColor).toEqual(componentInitialSecondaryColor);
//         expect(componentSecondaryColor).toEqual(componentInitialPrimaryColor);
//     });

//     it('the primary and secondary opacity should be intertwined after the function intertwineColors is called', () => {
//         const componentInitialPrimaryOpacity: number = component.primaryOpacity;
//         const componentInitialSecondaryOpacity: number = component.secondaryOpacity;

//         component.intertwineColors();
//         const componentPrimaryOpacity: number = component.primaryOpacity;
//         const componentSecondaryOpacity: number = component.secondaryOpacity;

//         expect(componentPrimaryOpacity).toEqual(componentInitialPrimaryOpacity);
//         expect(componentSecondaryOpacity).toEqual(componentInitialSecondaryOpacity);
//     });

//     // Revert function

//     it('the method revert should return the colors to the values kept in the color service', () => {
//         const newColor = '#111111';
//         const initialPrimaryColor: string = component.primaryColor;
//         const initialSecondaryColor: string = component.secondaryColor;

//         component.primaryColor = newColor;
//         component.secondaryColor = newColor;
//         component.revert();

//         const finalPrimaryColor: string = component.primaryColor;
//         const finalSecondaryColor: string = component.secondaryColor;

//         expect(finalPrimaryColor).toEqual(initialPrimaryColor);
//         expect(finalSecondaryColor).toEqual(initialSecondaryColor);
//     });

//     // Need of confirmation

//     it('if a new color is selected for the primary color there should be a need for a confirmation', () => {
//         const newColor = '#111111';
//         component.primaryColor = newColor;
//         const needForConfirmation: boolean = component.needConfirmation();
//         expect(needForConfirmation).toEqual(true);
//     });

//     it('if a new color is selected for the secondary color there should be a need for a confirmation', () => {
//         const newColor = '#111111';
//         component.secondaryColor = newColor;
//         const needForConfirmation: boolean = component.needConfirmation();
//         expect(needForConfirmation).toEqual(true);
//     });

//     it('if a new opacity is selected for the primary color there should be a need for a confirmation', () => {
//         const newOpacity = 0.6;
//         component.primaryOpacity = newOpacity;
//         const needForConfirmation: boolean = component.needConfirmation();
//         expect(needForConfirmation).toEqual(true);
//     });

//     it('if a new opacity is selected for the second color there should be a need for a confirmation', () => {
//         const newOpacity = 0.6;
//         component.secondaryOpacity = newOpacity;
//         const needForConfirmation: boolean = component.needConfirmation();
//         expect(needForConfirmation).toEqual(true);
//     });

//     // Quick color selection

//     it('the quick color selection method should accept an rgb color betwwen 0 and 0xffffff without needing a confirmation', () => {
//         const assignSpy: jasmine.Spy<any> = spyOn<any>(component, 'assign');
//         const newColor = '#aabbcc';

//         component.selectPrimaryColorsQuick(newColor);
//         component.selectSecondaryColorQuick(newColor);

//         const primaryColor: string = colorService.getPrimaryColor();
//         const secondaryColor: string = colorService.getSecondaryColor();

//         expect(primaryColor).toEqual(newColor);
//         expect(secondaryColor).toEqual(newColor);
//         expect(assignSpy.calls.count()).toEqual(0);
//     });

//     it('the color input for primary and secondary color should accept the number 0 as the rgb color number upon confirmation', () => {
//         const assignSpy: jasmine.Spy<any> = spyOn<any>(component, 'assign');
//         const newColor = '#0';

//         component.selectPrimaryColorsQuick(newColor);
//         component.selectSecondaryColorQuick(newColor);

//         const primaryColor: string = colorService.getPrimaryColor();
//         const secondaryColor: string = colorService.getSecondaryColor();

//         expect(primaryColor).toEqual(newColor);
//         expect(secondaryColor).toEqual(newColor);
//         expect(assignSpy.calls.count()).toEqual(0);
//     });

//     it('the color input for primary and secondary color should accept the number 0xffffff as the rgb color number upon confirmation', () => {
//         const assignSpy: jasmine.Spy<any> = spyOn<any>(component, 'assign');
//         const newColor = '#ffffff';

//         component.selectPrimaryColorsQuick(newColor);
//         component.selectSecondaryColorQuick(newColor);

//         const primaryColor: string = colorService.getPrimaryColor();
//         const secondaryColor: string = colorService.getSecondaryColor();

//         expect(primaryColor).toEqual(newColor);
//         expect(secondaryColor).toEqual(newColor);
//         expect(assignSpy.calls.count()).toEqual(0);
//     });

//     it('the primary and secondary color should not change if a color not respecting the format "#rrggbb" as the input upon confirmation', () => {
//         const assignSpy: jasmine.Spy<any> = spyOn<any>(component, 'assign');
//         const newColor = 'ffffff';

//         const initialPrimaryColor = component.primaryColor;
//         const initialSecondaryColor = component.secondaryColor;

//         component.selectPrimaryColorsQuick(newColor);
//         component.selectSecondaryColorQuick(newColor);

//         const primaryColor: string = colorService.getPrimaryColor();
//         const secondaryColor: string = colorService.getSecondaryColor();

//         expect(primaryColor).toEqual(initialPrimaryColor);
//         expect(secondaryColor).toEqual(initialSecondaryColor);
//         expect(assignSpy.calls.count()).toEqual(0);
//     });
// });
