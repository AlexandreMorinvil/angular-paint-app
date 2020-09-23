import { Injectable } from '@angular/core';
import { ToolModifier } from '@app/classes/tool-modifier';

@Injectable({
    providedIn: 'root',
})
export class ColorService extends ToolModifier {
    constructor() {
        super();
    }
}
