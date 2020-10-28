import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';

@Injectable({
    providedIn: 'root',
})
export class ColorPickerViewerService extends ToolModifier {
    constructor() {
        super();
    }
}
