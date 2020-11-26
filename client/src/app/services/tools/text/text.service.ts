import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class TextService extends Tool {
    constructor(public drawingService: DrawingService) {
        super(drawingService, new Description('texte', 't', 'text_icon.png'));
    }
    onMouseDown() {
        this.drawingService.shortcutEnable = false;
    }
    onKeyDown(event: KeyboardEvent) {
        console.log(event.key);
    }
}
