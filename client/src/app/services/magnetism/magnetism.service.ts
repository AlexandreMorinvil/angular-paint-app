import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { SpacingService } from '@app/services/tool-modifier/spacing/spacing.service';

export enum MagnetismAnchor {
    End = -1,
    Center = 0,
    Start = 1,
}

@Injectable({
    providedIn: 'root',
})
export class MagnetismService {
    isActivated: Boolean = false;
    horizontalAnchorPosition: MagnetismAnchor = MagnetismAnchor.Center;
    verticalAnchorPosition: MagnetismAnchor = MagnetismAnchor.Center;

    constructor(private spacingService: SpacingService) {}

    toogleMagnetism(): void {
        this.isActivated = !this.isActivated;
    }
    
    getAdjustedPosition(coordinate: Vec2, width: number, height: number): Vec2 {
        const nearestGridCoordinate: Vec2 = this.getNearestGridCoordinate(coordinate);
        nearestGridCoordinate.x += this.horizontalAnchorPosition * (width / 2);
        nearestGridCoordinate.y += this.verticalAnchorPosition * (height / 2);
        return nearestGridCoordinate;
    }

    private getNearestGridCoordinate(coordinate: Vec2): Vec2 {
        const spacing: number = this.spacingService.getSpacing();
        const gridClosestX: number = Math.round(coordinate.x / spacing) * spacing;
        const gridClosestY: number = Math.round(coordinate.y / spacing) * spacing;
        console.log({ x: gridClosestX, y: gridClosestY });
        return { x: gridClosestX, y: gridClosestY } as Vec2;
    }

}
