import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorPickerViewerService } from '@app/services/tool-modifier/color-picker-viewer/color-picker-viewer.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { BehaviorSubject, Observable } from 'rxjs';

const SQUARE_SIDE_SIZE = 4;

@Injectable({
    providedIn: 'root',
})
export class ColorPickerService extends Tool {
    private pickedPrimaryColorSource: BehaviorSubject<string>;
    currentPickedPrimaryColor: Observable<string>;
    private pickedSecondaryColorSource: BehaviorSubject<string>;
    currentPickedSecondaryColor: Observable<string>;

    private previsualizationZoneSource: BehaviorSubject<Uint8ClampedArray>;
    currentPrevisualizationZoneSource: Observable<Uint8ClampedArray>;

    private SQUARE_DIM: number = 70;

    constructor(drawingService: DrawingService, private colorService: ColorService, private colorPickerViewerService: ColorPickerViewerService) {
        super(drawingService, new Description('pipette', 'i', 'pipette_icon.png'));
        this.pickedPrimaryColorSource = new BehaviorSubject<string>(colorService.getPrimaryColor());
        this.currentPickedPrimaryColor = this.pickedPrimaryColorSource.asObservable();

        this.pickedSecondaryColorSource = new BehaviorSubject<string>(colorService.getSecondaryColor());
        this.currentPickedSecondaryColor = this.pickedSecondaryColorSource.asObservable();

        this.previsualizationZoneSource = new BehaviorSubject<Uint8ClampedArray>(
            new Uint8ClampedArray(SQUARE_SIDE_SIZE * this.SQUARE_DIM * this.SQUARE_DIM),
        );
        this.currentPrevisualizationZoneSource = this.previsualizationZoneSource.asObservable();

        this.modifiers.push(this.colorPickerViewerService);
        this.modifiers.push(this.colorService);
    }

    private componentToHex(channel: number): string {
        const hex = channel.toString(16);
        if (hex.length === 1) {
            return '0' + hex;
        } else {
            return hex;
        }
    }

    private rgbColorToHEXString(r: number, g: number, b: number): string {
        return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    onMouseDown(event: MouseEvent): void {
        const mousePosition: Vec2 = this.getPositionFromMouse(event);

        const rgbColor: Uint8ClampedArray = this.drawingService.baseCtx.getImageData(mousePosition.x, mousePosition.y, 1, 1).data;

        const colorHEXString = this.rgbColorToHEXString(rgbColor[0], rgbColor[1], rgbColor[2]);

        if (event.button === 0) {
            this.pickedPrimaryColorSource.next(colorHEXString);
            this.colorService.setPrimaryColor(colorHEXString);
        }

        if (event.button === 2) {
            this.pickedSecondaryColorSource.next(colorHEXString);
            this.colorService.setSecondaryColor(colorHEXString);
        }
    }

    visualizeColorPixel(event: MouseEvent): void {
        const mousePosition: Vec2 = this.getPositionFromMouse(event);

        const rgbColor: Uint8ClampedArray = this.drawingService.baseCtx.getImageData(mousePosition.x, mousePosition.y, 1, 1).data;

        const colorHEXString = this.rgbColorToHEXString(rgbColor[0], rgbColor[1], rgbColor[2]);
        this.colorPickerVisual(event, colorHEXString);
    }

    updatePrevisualizationData(event: MouseEvent): void {
        const mousePosition: Vec2 = this.getPositionFromMouse(event);

        const previsualisationData: Uint8ClampedArray = this.drawingService.baseCtx.getImageData(
            mousePosition.x - this.SQUARE_DIM / 2,
            mousePosition.y - this.SQUARE_DIM / 2,
            this.SQUARE_DIM,
            this.SQUARE_DIM,
        ).data;

        this.previsualizationZoneSource.next(previsualisationData);
    }

    onMouseMove(event: MouseEvent): void {
        this.visualizeColorPixel(event);

        this.updatePrevisualizationData(event);
    }

    colorPickerVisual(event: MouseEvent, colorHEXString: string): void {
        const borderColor = colorHEXString;
        const borderWidth = 1;
        const squareWidth = 60;

        this.drawingService.previewCtx.strokeStyle = borderColor;
        this.drawingService.previewCtx.fillStyle = colorHEXString;
        this.drawingService.previewCtx.lineWidth = borderWidth;

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.strokeRect(event.offsetX - squareWidth / 2, event.offsetY - squareWidth / 2, squareWidth + 1, squareWidth + 1);
        this.drawingService.previewCtx.fillRect(event.offsetX - squareWidth / 2, event.offsetY - squareWidth / 2, squareWidth + 1, squareWidth + 1);
    }
}
