import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { ToleranceService } from '@app/services/tool-modifier/tolerance/tolerance.service';

@Injectable({
    providedIn: 'root',
})
export class PaintService extends Tool {
    constructor(drawingService: DrawingService, private colorService: ColorService, public toleranceService: ToleranceService) {
        super(drawingService, new Description('Paint', 'b', 'paint_icon.png'));
        this.modifiers.push(this.colorService);
        this.modifiers.push(this.toleranceService);
    }
}
