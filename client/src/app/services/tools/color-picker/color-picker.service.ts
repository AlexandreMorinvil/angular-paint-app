import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ColorPickerService extends Tool {
    private pickedPrimaryColorSource: BehaviorSubject<string>;
    currentPickedPrimaryColor: Observable<string>;

    constructor(drawingService: DrawingService, private colorService: ColorService) {
        super(drawingService, new Description('pipette', 'i', 'pipette_icon.png'));
        this.pickedPrimaryColorSource = new BehaviorSubject<string>(colorService.getPrimaryColor());
        this.currentPickedPrimaryColor = this.pickedPrimaryColorSource.asObservable();

        // this.modifiers.push(this.colorService);
    }

    componentToHex(channel: number): string {
        const hex = channel.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    rgbColorToHEXString(r: number, g: number, b: number): string {
        return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    onMouseDown(event: MouseEvent): void {
        // get mouse position
        const mousePosition: Vec2 = this.getPositionFromMouse(event);

        // get pixel data at currentMouse position
        const rgbColor: Uint8ClampedArray = this.drawingService.baseCtx.getImageData(mousePosition.x, mousePosition.y, 1, 1).data;

        // get color HEX string from the pixel data
        const colorHEXString = this.rgbColorToHEXString(rgbColor[0], rgbColor[1], rgbColor[2]);

        // set current color to the new color
        this.pickedPrimaryColorSource.next(colorHEXString);
        this.colorService.setPrimaryColor(colorHEXString);
    }

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onEscapeDown(event: KeyboardEvent): void {}

    onBackspaceDown(event: KeyboardEvent): void {}

    onMouseClick(event: MouseEvent): void {}

    onMouseDblClick(event: MouseEvent): void {}

    onShiftDown(event: KeyboardEvent): void {}

    onShiftUp(event: KeyboardEvent): void {}
}
