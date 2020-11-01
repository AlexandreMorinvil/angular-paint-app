import { TestBed } from '@angular/core/testing';
import { SidesService } from './sides.service';

describe('SidesService', () => {
    let service: SidesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SidesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should have a default a  after creation', () => {
        const DEFAULT_POLYGON_SIDE: number = service.DEFAULT_POLYGON_SIDE;
        const side: number = service.getSide();
        expect(side).toEqual(DEFAULT_POLYGON_SIDE);
    });

    it('setSide should set the number of side to the incoming argument and getSide should return the set number', () => {
        const side = 5;
        service.setSide(side);
        expect(service.getSide()).toEqual(side);
    });

    it(' setDiameter should set the number of side to 12 if input is above 12', () => {
        const side = 13;
        const maxSide = service.MAX_POLYGON_SIDE;
        service.setSide(side);
        expect(service.getSide()).toEqual(maxSide);
    });

    it(' setDiameter should set the number of side to 0 if input is below 1', () => {
        const side = 0;
        const minSide = service.MIN_POLYGON_SIDE;
        service.setSide(side);
        expect(service.getSide()).toEqual(minSide);
    });
});
