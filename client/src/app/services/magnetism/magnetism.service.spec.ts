import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { SpacingService } from '@app/services/tool-modifier/spacing/spacing.service';
import { MagnetismService } from './magnetism.service';

// tslint:disable:no-any
describe('MagnetismService', () => {
    let service: MagnetismService;
    let spacingService: SpacingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MagnetismService);
        spacingService = TestBed.inject(SpacingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should turn on the magnetism', () => {
        service.isActivated = false;
        service.toogleMagnetism();
        expect(service.isActivated).toBe(true);
    });

    it('should give the possition that is closest relative to the upper left corner', () => {
        const SPACING = 50;
        (spacingService as any).spacing = SPACING;
        const POSITION: Vec2 = { x: 10, y: 10 };
        const WIDTH = 10;
        const HEIGHT = 10;

        const CLOSEST_POSITION: Vec2 = service.getAdjustedPositionFromCenter(POSITION, WIDTH, HEIGHT);

        expect(CLOSEST_POSITION.x).toBe(0);
        expect(CLOSEST_POSITION.y).toBe(0);
    });

    it('should determine the left size jump distance to the clossest horizontal grid line', () => {
        const SPACING = 50;
        (spacingService as any).spacing = SPACING;
        const X_POSITION = 20;
        const WIDTH = 10;

        const CLOSEST_POSITION: number = service.getGridHorizontalJumpDistance(X_POSITION, WIDTH, false);
        const EXPECT_POSITION = 25;

        expect(CLOSEST_POSITION).toBe(EXPECT_POSITION);
    });

    it('should determine the right size jump distance to the clossest horizontal grid line', () => {
        const SPACING = 50;
        (spacingService as any).spacing = SPACING;
        const X_POSITION = 20;
        const WIDTH = 10;

        const CLOSEST_POSITION: number = service.getGridHorizontalJumpDistance(X_POSITION, WIDTH, true);
        const EXPECT_POSITION = 25;

        expect(CLOSEST_POSITION).toBe(EXPECT_POSITION);
    });

    it('should determine the up size jump distance to the clossest horizontal grid line', () => {
        const SPACING = 50;
        (spacingService as any).spacing = SPACING;
        const Y_POSITION = 20;
        const HEIGHT = 10;

        const CLOSEST_POSITION: number = service.getVerticalJumpDistance(Y_POSITION, HEIGHT, false);
        const EXPECT_POSITION = 25;

        expect(CLOSEST_POSITION).toBe(EXPECT_POSITION);
    });

    it('should determine the bottom size jump distance to the clossest horizontal grid line', () => {
        const SPACING = 50;
        (spacingService as any).spacing = SPACING;
        const Y_POSITION = 20;
        const HEIGHT = 10;

        const CLOSEST_POSITION: number = service.getVerticalJumpDistance(Y_POSITION, HEIGHT, true);
        const EXPECT_POSITION = 25;

        expect(CLOSEST_POSITION).toBe(EXPECT_POSITION);
    });

    it('should jump a fill grid spacing horizontally if it is already on a grid line', () => {
        const SPACING = 50;
        (spacingService as any).spacing = SPACING;
        const X_POSITION = 45;
        const WIDTH = 10;

        const CLOSEST_POSITION: number = service.getGridHorizontalJumpDistance(X_POSITION, WIDTH, true);
        const EXPECT_POSITION = SPACING;

        expect(CLOSEST_POSITION).toBe(EXPECT_POSITION);
    });

    it('should jump a fill grid spacing horizontally if it is already on a grid line', () => {
        const SPACING = 50;
        (spacingService as any).spacing = SPACING;
        const Y_POSITION = 45;
        const HEIGHT = 10;

        const CLOSEST_POSITION: number = service.getVerticalJumpDistance(Y_POSITION, HEIGHT, false);
        const EXPECT_POSITION = SPACING;

        expect(CLOSEST_POSITION).toBe(EXPECT_POSITION);
    });
});
