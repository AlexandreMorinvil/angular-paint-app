import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

enum Color {
    rouge = '#ff0000',
    noir = '#000000',
    bleu = '#0000ff',
    vert = '#008000',
}

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    private pathData: Vec2[];
    private shiftDown: boolean = false;
    public primaryColor: string;
    public secondaryColor: string;
    public typeLayout: string;
    public lineDash: number;

    constructor(drawingService: DrawingService,
        private tracingService: TracingService,
        private widthService: WidthService) {
        super(drawingService, new Description("rectangle", "1", "rectangle_icon.png"));
        this._modifiers.push(this.widthService);
        this._modifiers.push(this.tracingService);
        this.clearPath();
        this.primaryColor = Color.vert;
        this.secondaryColor = Color.noir;
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
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);
            this.drawRectangle(this.drawingService.baseCtx, this.pathData);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.previewCtx.setLineDash([0]);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData.push(mousePosition);

            //On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawRectangle(this.drawingService.previewCtx, this.pathData);
        }
    }

    onShiftDown(event: KeyboardEvent): void {
        this.shiftDown = true;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawRectangle(this.drawingService.previewCtx, this.pathData);
    }

    onShiftUp(event: KeyboardEvent): void {
        this.shiftDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawRectangle(this.drawingService.previewCtx, this.pathData);
    }

    private drawRectangle(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        let lastMouseMoveCoord = path[path.length - 1];
        let width = lastMouseMoveCoord.x - this.mouseDownCoord.x;
        let height = lastMouseMoveCoord.y - this.mouseDownCoord.y;
        if (this.shiftDown) {
            height = width = Math.min(height, width); //draw square on shift pressed
        }
        ctx.rect(this.mouseDownCoord.x, this.mouseDownCoord.y, width, height);
        this.setAttribute(ctx);
        ctx.setLineDash([0]); //pour les pointillés autours
    }

    public setAttribute(ctx: CanvasRenderingContext2D) {
        ctx.lineWidth = this.widthService.value;
        ctx.fillStyle = this.primaryColor;
        ctx.strokeStyle = this.secondaryColor;
        if (this.tracingService.valueFill === true) ctx.fill();
        if (this.tracingService.valueContour === true) ctx.stroke();
        
    }

    private clearPath(): void {
        this.pathData = [];
    }
}
