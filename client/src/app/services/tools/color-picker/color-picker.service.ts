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
        const HEX = channel.toString(16);
        if (HEX.length === 1) {
            return '0' + HEX;
        } else {
            return HEX;
        }
    }

    private rgbColorToHEXString(r: number, g: number, b: number): string {
        return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    onMouseDown(event: MouseEvent): void {
        const MOUSE_POSITION: Vec2 = this.getPositionFromMouse(event);
        const RGB_COLOR: Uint8ClampedArray = this.drawingService.baseCtx.getImageData(MOUSE_POSITION.x, MOUSE_POSITION.y, 1, 1).data;
        const COLOR_HEX_STRING = this.rgbColorToHEXString(RGB_COLOR[0], RGB_COLOR[1], RGB_COLOR[2]);

        // left click
        if (event.button === 0) {
            this.pickedPrimaryColorSource.next(COLOR_HEX_STRING);
            this.colorService.setPrimaryColor(COLOR_HEX_STRING);
        }

        // right click
        if (event.button === 2) {
            this.pickedSecondaryColorSource.next(COLOR_HEX_STRING);
            this.colorService.setSecondaryColor(COLOR_HEX_STRING);
        }
    }

    visualizeColorPixel(event: MouseEvent): void {
        const MOUSE_POSITION: Vec2 = this.getPositionFromMouse(event);

        const RGB_COLOR: Uint8ClampedArray = this.drawingService.baseCtx.getImageData(MOUSE_POSITION.x, MOUSE_POSITION.y, 1, 1).data;

        const COLOR_HEX_STRING = this.rgbColorToHEXString(RGB_COLOR[0], RGB_COLOR[1], RGB_COLOR[2]);
        this.colorPickerVisual(event, COLOR_HEX_STRING);
    }

    updatePrevisualizationData(event: MouseEvent): void {
        const MOUSE_POSITION: Vec2 = this.getPositionFromMouse(event);

        const previsualisationData: Uint8ClampedArray = this.drawingService.baseCtx.getImageData(
            MOUSE_POSITION.x - this.SQUARE_DIM / 2,
            MOUSE_POSITION.y - this.SQUARE_DIM / 2,
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
        const BORDER_COLOR = colorHEXString;
        const BORDER_WIDTH = 1;
        const SQUARE_WIDTH = 60;

        this.drawingService.previewCtx.strokeStyle = BORDER_COLOR;
        this.drawingService.previewCtx.fillStyle = colorHEXString;
        this.drawingService.previewCtx.lineWidth = BORDER_WIDTH;

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.previewCtx.strokeRect(
            event.offsetX - SQUARE_WIDTH / 2,
            event.offsetY - SQUARE_WIDTH / 2,
            SQUARE_WIDTH + 1,
            SQUARE_WIDTH + 1,
        );
        this.drawingService.previewCtx.fillRect(
            event.offsetX - SQUARE_WIDTH / 2,
            event.offsetY - SQUARE_WIDTH / 2,
            SQUARE_WIDTH + 1,
            SQUARE_WIDTH + 1,
        );
    }
}
