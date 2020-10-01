import { HostListener, Injectable } from '@angular/core';
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
    TOOLBOX_WIDTH: number = 278;
    workZoneHeight: number;
    workZoneWidth: number;

    drawingZoneHeight: number;
    drawingZoneWidth: number;

    private workzoneDimensionSource: BehaviorSubject<Dimension>;
    currentWorkzoneDimension: Observable<Dimension>;

    constructor() {
        this.setDimensions();
        this.workzoneDimensionSource = new BehaviorSubject<Dimension>({ width: this.WORKZONE_MINIMAL_SIZE, height: this.WORKZONE_MINIMAL_SIZE });
        this.currentWorkzoneDimension = this.workzoneDimensionSource.asObservable();
    }

    changeWorkZoneDimension(drawingZoneDimension: Dimension): void {
        const drawingZoneHeight = drawingZoneDimension.height;
        const drawingZoneWidth = drawingZoneDimension.width;

        let newWorkZoneHeight = this.workZoneHeight;
        let newWorkZoneWidth = this.workZoneWidth;

        if (drawingZoneHeight > this.workZoneHeight) {
            newWorkZoneHeight = drawingZoneHeight + this.SMALL_SPACE;
            this.workZoneHeight = newWorkZoneHeight;
        }

        if (drawingZoneWidth > this.workZoneWidth) {
            newWorkZoneWidth = drawingZoneWidth + this.SMALL_SPACE;
            this.workZoneWidth = newWorkZoneWidth;
        }

        this.drawingZoneHeight = drawingZoneHeight;
        this.drawingZoneWidth = drawingZoneWidth;

        this.workzoneDimensionSource.next({ width: newWorkZoneWidth, height: newWorkZoneHeight });
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.resizeWorkZone();
    }

    setDimensions(): void {
        this.resizeWorkZone();
        this.resizeDrawingZone();
    }

    resizeWorkZone(): void {
        let newWidth: number = window.innerWidth - this.TOOLBOX_WIDTH;
        let newHeight: number = window.innerHeight;

        if (newWidth < this.WORKZONE_MINIMAL_SIZE) {
            newWidth = this.WORKZONE_MINIMAL_SIZE;
        }

        if (newHeight < this.WORKZONE_MINIMAL_SIZE) {
            newHeight = this.WORKZONE_MINIMAL_SIZE;
        }

        this.workZoneHeight = newHeight;
        this.workZoneWidth = newWidth;
    }

    resizeDrawingZone(): void {
        let newWidth = this.workZoneWidth / 2;
        let newHeight = this.workZoneHeight / 2;

        if (this.drawingZoneHeight < this.WORKZONE_MINIMAL_SIZE) {
            newHeight = this.DRAWINGZONE_MINIMAL_SIZE;
        }

        if (this.drawingZoneWidth < this.WORKZONE_MINIMAL_SIZE) {
            newWidth = this.DRAWINGZONE_MINIMAL_SIZE;
        }

        this.drawingZoneHeight = newHeight;
        this.drawingZoneWidth = newWidth;
    }
}
