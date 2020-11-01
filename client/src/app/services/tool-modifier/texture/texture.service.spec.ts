import { TestBed } from '@angular/core/testing';
import { TextureModifierState } from './texture-state';
import { TextureEnum, TextureService } from './texture.service';

describe('TextureService', () => {
    let service: TextureService;
    let setStateSpy: jasmine.Spy<any>;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TextureService);
        setStateSpy = spyOn<any>(service, 'setState').and.callThrough();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return the right texture', () => {
        const listTexture: string[] = Object.values(TextureEnum);
        expect(service.getListTextures()).toEqual(listTexture);
    });

    it('should change to the right texture', () => {
        service.setTexture('dégradée');
        expect(service.getTexture()).toEqual('dégradée');
    });

    it('should do nothing if the texture does not exist', () => {
        service.setTexture('erreur');
        expect(service.getTexture()).toEqual('ombrée');
    });

    it(' should call setState with the correct incoming argument and set hasContour and hasFill to true', () => {
        let state = {
            texture: 'dégradée',
        } as TextureModifierState;
        service.setState(state);
        expect(setStateSpy).toHaveBeenCalled();
        expect(service.getTexture()).toBe(state.texture);
    });
});
