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
    readonly PIXEL_ADJUSTMENT = 2;
    isActivated: Boolean = false;
    horizontalAnchorPosition: MagnetismAnchor = MagnetismAnchor.Center;
    verticalAnchorPosition: MagnetismAnchor = MagnetismAnchor.Center;

    constructor(private spacingService: SpacingService) {}

    toogleMagnetism(): void {
        this.isActivated = !this.isActivated;
    }

    getAdjustedPositionFromCenter(coordinate: Vec2, width: number, height: number): Vec2 {
        const nearestGridCoordinate: Vec2 = this.getNearestGridCoordinate(coordinate);
        nearestGridCoordinate.x += this.horizontalAnchorPosition * (width / 2);
        nearestGridCoordinate.y += this.verticalAnchorPosition * (height / 2);
        nearestGridCoordinate.x -= this.PIXEL_ADJUSTMENT;
        nearestGridCoordinate.y -= this.PIXEL_ADJUSTMENT;
        return nearestGridCoordinate;
    }

    getGridHorizontalJumpDistance(coordinateX: number, width: number, isToRight: Boolean): number {
        const spacing: number = this.spacingService.getSpacing();
        const anchorXPosition = this.getHorizontalAnchorAbsolutePosition(coordinateX, width);
        let distance = (anchorXPosition + this.PIXEL_ADJUSTMENT) % spacing;
        if (distance === 0) return spacing;
        else if (isToRight) return spacing - distance;
        else return distance;
    }

    getVerticalJumpDistance(coordinateY: number, height: number, isToBottom: Boolean): number {
        const spacing: number = this.spacingService.getSpacing();
        const anchorYPosition = this.getVerticalffsetFromTop(coordinateY, height);
        let distance = (anchorYPosition + this.PIXEL_ADJUSTMENT) % spacing;
        if (distance === 0) return spacing;
        else if (isToBottom) return spacing - distance;
        else return distance;
    }

    private getNearestGridCoordinate(coordinate: Vec2): Vec2 {
        const spacing: number = this.spacingService.getSpacing();
        const gridClosestX: number = Math.round(coordinate.x / spacing) * spacing;
        const gridClosestY: number = Math.round(coordinate.y / spacing) * spacing;
        return { x: gridClosestX, y: gridClosestY } as Vec2;
    }

    private getHorizontalAnchorAbsolutePosition(leftmostCoord: number, width: number): number {
        return leftmostCoord + Math.trunc(-1 * (this.horizontalAnchorPosition - 1) * (width / 2));
    }

    private getVerticalffsetFromTop(topMostCoord: number, height: number): number {
        return topMostCoord + Math.trunc(-1 * (this.verticalAnchorPosition - 1) * (height / 2));
    }
}
