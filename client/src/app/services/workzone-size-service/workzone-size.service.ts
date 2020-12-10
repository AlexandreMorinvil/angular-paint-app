import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Dimension {
    width: number;
    height: number;
}

@Injectable({
    providedIn: 'root',
})
export class WorkzoneSizeService {
    WORKZONE_MINIMAL_SIZE: number = 500;
    DRAWINGZONE_MINIMAL_SIZE: number = 250;

    SMALL_SPACE: number = 120;
    TOOLBOX_WIDTH: number = 408;
    workZoneHeight: number;
    workZoneWidth: number;

    drawingZoneHeight: number;
    drawingZoneWidth: number;

    private workzoneDimensionSource: BehaviorSubject<Dimension>;
    currentWorkzoneDimension: Observable<Dimension>;

    constructor() {
        this.setDimensions();
        this.workzoneDimensionSource = new BehaviorSubject<Dimension>({ width: this.workZoneWidth, height: this.workZoneHeight });
        this.currentWorkzoneDimension = this.workzoneDimensionSource.asObservable();
    }

    updateDrawingZoneDimension(drawingZoneDimension: Dimension): void {
        const DRAWING_ZONE_HEIGHT = drawingZoneDimension.height;
        const DRAWING_ZONE_WIDTH = drawingZoneDimension.width;

        if (DRAWING_ZONE_HEIGHT > this.workZoneHeight - this.SMALL_SPACE) {
            this.workZoneHeight = DRAWING_ZONE_HEIGHT + this.SMALL_SPACE;
        }

        if (DRAWING_ZONE_WIDTH > this.workZoneWidth - this.SMALL_SPACE) {
            this.workZoneWidth = DRAWING_ZONE_WIDTH + this.SMALL_SPACE;
        }

        this.workzoneDimensionSource.next({ width: this.workZoneWidth, height: this.workZoneHeight });
    }

    onResize(): void {
        const NEW_WIDTH: number = window.innerWidth - this.TOOLBOX_WIDTH;
        const NEW_HEIGHT: number = window.innerHeight;

        if (this.drawingZoneHeight > NEW_HEIGHT || this.drawingZoneWidth > NEW_HEIGHT) {
            return;
        }

        if (this.workZoneWidth < NEW_WIDTH && this.workZoneHeight < NEW_HEIGHT) {
            this.workZoneWidth = NEW_WIDTH;
            this.workZoneHeight = NEW_HEIGHT;
        }

        this.workzoneDimensionSource.next({ width: NEW_WIDTH, height: NEW_HEIGHT });
    }

    setDimensions(): void {
        this.resizeWorkZone();
        this.resizeDrawingZone();
    }

    resizeWorkZone(): void {
        let NEW_WIDTH: number = window.innerWidth - this.TOOLBOX_WIDTH;
        let NEW_HEIGHT: number = window.innerHeight;

        if (NEW_WIDTH < this.WORKZONE_MINIMAL_SIZE) {
            NEW_WIDTH = this.WORKZONE_MINIMAL_SIZE;
        }

        if (NEW_HEIGHT < this.WORKZONE_MINIMAL_SIZE) {
            NEW_HEIGHT = this.WORKZONE_MINIMAL_SIZE;
        }

        this.workZoneHeight = NEW_HEIGHT;
        this.workZoneWidth = NEW_WIDTH;
    }

    resizeDrawingZone(): void {
        let NEW_WIDTH = this.workZoneWidth / 2;
        let NEW_HEIGHT = this.workZoneHeight / 2;

        if (this.drawingZoneHeight < this.WORKZONE_MINIMAL_SIZE) {
            NEW_HEIGHT = this.DRAWINGZONE_MINIMAL_SIZE;
        }

        if (this.drawingZoneWidth < this.WORKZONE_MINIMAL_SIZE) {
            NEW_WIDTH = this.DRAWINGZONE_MINIMAL_SIZE;
        }

        this.drawingZoneHeight = NEW_HEIGHT;
        this.drawingZoneWidth = NEW_WIDTH;
    }
}
