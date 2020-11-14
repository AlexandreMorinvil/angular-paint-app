import { Injectable } from '@angular/core';
import { InteractionStartEnd } from '@app/classes/action/interaction-start-end';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class StampService extends Tool {
    private pathData: Vec2[];

    constructor(public drawingService: DrawingService) {
        super(drawingService, new Description('stamp', 'd', 'stamp_icon.png'));
        this.clearPath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.resetBorder();
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            //this.drawingStateTrackingService.addAction(this, new InteractionStartEnd(this.mouseDownCoord, this.pathData, this.shiftDown));
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (!this.isInCanvas(mousePosition) && this.mouseDown) {
                if (mousePosition.x >= this.drawingService.baseCtx.canvas.width) {
                    this.drawingService.previewCtx.canvas.width = mousePosition.x;
                }
                if (mousePosition.y >= this.drawingService.baseCtx.canvas.height) {
                    this.drawingService.previewCtx.canvas.height = mousePosition.y;
                }
            } else {
                this.resetBorder();
            }
            //this.drawRectangle(this.drawingService.previewCtx, this.pathData);
            //this.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
        }
    }
    private clearPath(): void {
        this.pathData = [];
    }

    private resetBorder(): void {
        this.drawingService.previewCtx.canvas.width = this.drawingService.baseCtx.canvas.width;
        this.drawingService.previewCtx.canvas.height = this.drawingService.baseCtx.canvas.height;
    }

    execute(interaction: InteractionStartEnd): void {
        this.mouseDownCoord = interaction.startPoint;
        this.shiftDown = interaction.shiftDown;
        //this.drawRectangle(this.drawingService.baseCtx, interaction.path);
    }
}
