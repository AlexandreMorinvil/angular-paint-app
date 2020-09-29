import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextureEnum, TextureService } from '@app/services/tool-modifier/texture/texture.service';

import { AttributeTextureComponent } from './attributes-texture.component';

describe('AttributeTextureComponent', () => {
    let component: AttributeTextureComponent;
    let fixture: ComponentFixture<AttributeTextureComponent>;
    let textureService: TextureService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttributeTextureComponent],
            providers: [TextureService],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeTextureComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        textureService = TestBed.inject(TextureService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('the texture input of the component should be initiated with the values of the texture service', () => {
        const componentTexture: string = component.texture;
        const serviceTexture: string = textureService.getTexture();
        expect(componentTexture).toEqual(serviceTexture);
    });

    it('The texture should change to the input value upon confirmation of the texture choice', () => {
        const newTextureValue = TextureEnum.gradientTexture;

        component.texture = newTextureValue;
        component.assign();

        const texture: string = textureService.getTexture();

        expect(texture).toEqual(newTextureValue);
    });

    it('if a non existing texutre is inserted the texture should not change', () => {
        const newTextureValue = 'Non existing texture';

        const initialTexutreValue = component.texture;
        component.texture = newTextureValue;
        component.assign();

        const texture: string = textureService.getTexture();

        expect(texture).toEqual(initialTexutreValue);
    });

    it('the input texture value should revert to its original value when cancelling the input change', () => {
        const newTextureValue = TextureEnum.gradientTexture;

        const initialTexture = component.texture;

        component.texture = newTextureValue;
        component.revert();

        const texture: string = textureService.getTexture();

        expect(texture).toEqual(initialTexture);
    });

    it('if the texture is changed, there should be a need for confirmation', () => {
        component.texture = TextureEnum.gradientTexture;
        const needForConfirmation: boolean = component.needConfirmation();
        expect(needForConfirmation).toEqual(true);
    });
});
