import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Vec2 } from '@app/classes/vec2';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { SelectionToolService } from '@app/services/tools/selection/selection-tool.service';

@Injectable({
    providedIn: 'root',
})
export class MagicWandService extends SelectionToolService {
    protected image: HTMLImageElement;
    protected oldImage: HTMLImageElement;
    pathLastCoord: Vec2;
    firstEllipseCoord: Vec2;

    constructor(
        drawingService: DrawingService,
        private drawingStateTrackingService: DrawingStateTrackerService,
        private rectangleService: RectangleService,
        private tracingService: TracingService,
        private colorService: ColorService,
        private widthService: WidthService,
    ) {
        super(drawingService, colorService, new Description('Baguette magique', 'v', 'magic-wand.png'));
        this.image = new Image();
        this.oldImage = new Image();
    }
}
