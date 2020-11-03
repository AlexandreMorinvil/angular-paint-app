import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';
import { ColorPickerViewerModifierState } from './color-picker-viewer-state';

@Injectable({
    providedIn: 'root',
})
export class ColorPickerViewerService extends ToolModifier {
    constructor() {
        super();
    }

    getState(): ColorPickerViewerModifierState {
        return new ColorPickerViewerModifierState();
    }
    // tslint:disable:no-empty
    setState(state: ColorPickerViewerModifierState): void {}
}
