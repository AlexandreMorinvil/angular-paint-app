import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { SpacingService } from '@app/services/tool-modifier/spacing/spacing.service';

@Injectable({
    providedIn: 'root',
})
export class MagnetismService {
    isActivated: Boolean = false;

    constructor(private spacingService: SpacingService) {}

    getNearestGridCoordinate(coordinate: Vec2): Vec2 {
        const spacing: number = this.spacingService.getSpacing();
        const gridClosestX: number = Math.round(coordinate.x / spacing) * spacing;
        const gridClosestY: number = Math.round(coordinate.y / spacing) * spacing;
        console.log({ x: gridClosestX, y: gridClosestY });
        return { x: gridClosestX, y: gridClosestY } as Vec2;
    }

    toogleMagnetism(): void {
        this.isActivated = !this.isActivated;
    }
}
