import { HostListener, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WorkzoneSizeService {
    WORKZONE_MINIMAL_SIZE: number = 500;
    DRAWINGZONE_MINIMAL_SIZE: number = 250;
    TOOLBOX_WIDTH: number = 278;
    workZoneHeight: number;
    workZoneWidth: number;

    drawingZoneHeight: number;
    drawingZoneWidth: number;

    constructor() {
        this.setDimensions();
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
