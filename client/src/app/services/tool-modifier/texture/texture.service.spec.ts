import { TestBed } from '@angular/core/testing';
import { TextureEnum, TextureService } from './texture.service';

describe('TextureService', () => {
    let service: TextureService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TextureService);
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
});
