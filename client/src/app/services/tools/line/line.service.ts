import { Injectable } from '@angular/core';
import { InteractionPath } from '@app/classes/action/interaction-path';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { JunctionService } from '@app/services/tool-modifier/junction/junction.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';

export enum AlignmentAngle {
    right = 0,
    topRight = 45,
    top = 90,
    topLeft = 135,
    left = 180,
    bottomLeft = 225,
    bottom = 270,
    bottomRight = 315,
}

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    private pathData: Vec2[];
    private pathDataSaved: Vec2[];
    private savedImage: ImageData;
    private undo: ImageData[];
    private click: number;
    private alignmentCoord: Vec2;
    constructor(
        drawingService: DrawingService,
        private drawingStateTrackingService: DrawingStateTrackerService,
        private colorService: ColorService,
        private junctionService: JunctionService,
        private widthService: WidthService,
    ) {
        super(drawingService, new Description('line', 'l', 'line_icon.png'));
        this.clearPath();
        this.clearPathSaved();
        this.click = 0;
        this.undo = [];

        this.modifiers.push(this.colorService);
        this.modifiers.push(this.widthService);
        this.modifiers.push(this.junctionService);
    }

    onMouseMove(event: MouseEvent): void {
        const MOUSE_POSITION = this.getPositionFromMouse(event);

        if (this.mouseClick && !event.shiftKey) {
            if (this.isInCanvas(MOUSE_POSITION)) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.pathData[0] = this.mouseDownCoord;
                this.pathData.push(MOUSE_POSITION);
                this.drawLine(this.drawingService.previewCtx, this.pathData);
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.clearPath();
            }
        } else if (this.mouseClick && event.shiftKey) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.pathData.push(MOUSE_POSITION);
            this.drawAlignLine(this.drawingService.previewCtx, this.pathData);
        }
    }

    onShiftUp(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawLine(this.drawingService.previewCtx, this.pathData);
    }

    onBackspaceDown(): void {
        if (this.undo.length > 1) {
            if (this.pathDataSaved.length > 1) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.mouseDownCoord = this.pathDataSaved[this.pathDataSaved.length - 2];
                this.pathDataSaved.pop();
                this.drawingService.baseCtx.putImageData(this.undo[this.undo.length - 2], 0, 0);
                this.undo.pop();
            }
        }
    }

    onEscapeDown(): void {
        this.mouseClick = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.click = 0;
        this.clearPath();
        this.clearPathSaved();
    }
    // Mouse Click is a mouse down folled by mouse up
    onMouseClick(event: MouseEvent): void {
        const waitTime = 200;
        let timer;
        this.mouseClick = event.button === MouseButton.Left;
        if (!this.mouseClick) {
            return;
        }
        this.click++;
        if (this.click === 1) {
            timer = setTimeout(() => {
                this.click = 0;
            }, waitTime); // Timer to differentiate a click and a double click
        } else {
            clearTimeout(timer);
            this.click = 0;
            this.onMouseDoubleClickEvent(event);
            this.mouseClick = false;
        }
        if (this.click === 1 && !event.shiftKey) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
            if (this.junctionService.getHasJunctionPoint()) {
                this.drawJunction(this.drawingService.baseCtx, this.pathData);
            }
            this.savedPoints();
            this.clearPath();
        }
        if (this.click === 1 && event.shiftKey) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawAlignLine(this.drawingService.baseCtx, this.pathData);
            this.pathData[0] = this.alignmentCoord;
            this.mouseDownCoord = this.alignmentCoord;
            if (this.junctionService.getHasJunctionPoint()) {
                this.drawJunction(this.drawingService.baseCtx, this.pathData);
            }
            this.savedPoints();
        }
    }

    onMouseDoubleClickEvent(event: MouseEvent): void {
        this.clearPath();
        if (this.isAround20Pixels()) {
            this.closeShape();
        }
        this.drawingStateTrackingService.addAction(this, new InteractionPath(this.pathDataSaved));
        this.clearPathSaved();
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        const FIRST_PATH = path[0];
        const LAST_PATH = path[path.length - 1];
        ctx.moveTo(FIRST_PATH.x, FIRST_PATH.y);
        ctx.lineTo(LAST_PATH.x, LAST_PATH.y);
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.lineWidth = this.widthService.getWidth(); // width ajustment
        ctx.strokeStyle = this.colorService.getPrimaryColor(); // color of the line
        ctx.fillStyle = this.colorService.getPrimaryColor(); // color of the starting point
        ctx.stroke();
    }

    private drawJunction(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        const RADIUS = this.junctionService.getDiameter() / 2;
        const START_CENTER_X = this.mouseDownCoord.x;
        const START_CENTER_Y = this.mouseDownCoord.y;
        ctx.arc(START_CENTER_X, START_CENTER_Y, RADIUS, 0, Math.PI * 2);
        ctx.fill();
    }
    private isAround20Pixels(): boolean {
        // Calculate the distance between first and last point
        const LIMIT_20_PIXELS = 20;
        const FIRST_CURRENT_POINT = this.pathDataSaved[0];
        const LAST_CURRENT_POINT = this.pathDataSaved[this.pathDataSaved.length - 1];
        const DIFFERENCE_X_POSITION = LAST_CURRENT_POINT.x - FIRST_CURRENT_POINT.x;
        const DIFFERENCE_Y_POSITION = LAST_CURRENT_POINT.y - FIRST_CURRENT_POINT.y;
        const X_SIDE_TRIANGLE_SQUARED = Math.pow(DIFFERENCE_X_POSITION, 2);
        const Y_SIDE_TRIANGLE_SQUARED = Math.pow(DIFFERENCE_Y_POSITION, 2);
        const HYPOTHENUS = Math.sqrt(X_SIDE_TRIANGLE_SQUARED + Y_SIDE_TRIANGLE_SQUARED);
        if (HYPOTHENUS <= LIMIT_20_PIXELS) {
            return true;
        }
        return false;
    }

    private closeShape(): void {
        this.drawingService.baseCtx.beginPath();
        const FIRST_PATH = this.pathDataSaved[0];
        const LAST_PATH = this.pathDataSaved[this.pathDataSaved.length - 1];
        this.drawingService.baseCtx.moveTo(FIRST_PATH.x, FIRST_PATH.y);
        this.drawingService.baseCtx.lineTo(LAST_PATH.x, LAST_PATH.y);
        this.drawingService.baseCtx.stroke();
        this.mouseDownCoord = this.pathDataSaved[0];
        this.drawJunction(this.drawingService.baseCtx, this.pathData);
    }

    private savedPoints(): void {
        this.pathDataSaved.push(this.mouseDownCoord);
        this.savedImage = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
        this.undo.push(this.savedImage);
    }
    private drawAlignLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        const ALIGNMENT_ANGLE = this.findAlignmentAngle(path);
        const FIRST_PATH = path[0];
        const LAST_PATH = path[path.length - 1];
        const LENGHT_X = Math.abs(LAST_PATH.x - FIRST_PATH.x);

        ctx.moveTo(FIRST_PATH.x, FIRST_PATH.y);
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
        ctx.lineWidth = this.widthService.getWidth(); // width ajustment
        ctx.strokeStyle = this.colorService.getPrimaryColor(); // color of the line
        ctx.fillStyle = this.colorService.getPrimaryColor(); // color of the starting point
        switch (ALIGNMENT_ANGLE) {
            case AlignmentAngle.right:
                ctx.lineTo(LAST_PATH.x, FIRST_PATH.y);
                ctx.stroke();
                this.alignmentCoord = { x: LAST_PATH.x, y: FIRST_PATH.y };
                break;
            case AlignmentAngle.topRight:
                ctx.lineTo(FIRST_PATH.x + LENGHT_X, FIRST_PATH.y + LENGHT_X);
                ctx.stroke();
                this.alignmentCoord = { x: FIRST_PATH.x + LENGHT_X, y: FIRST_PATH.y + LENGHT_X };
                break;
            case AlignmentAngle.top:
                ctx.lineTo(FIRST_PATH.x, LAST_PATH.y);
                ctx.stroke();
                this.alignmentCoord = { x: FIRST_PATH.x, y: LAST_PATH.y };
                break;
            case AlignmentAngle.topLeft:
                ctx.lineTo(FIRST_PATH.x - LENGHT_X, FIRST_PATH.y + LENGHT_X);
                ctx.stroke();
                this.alignmentCoord = { x: FIRST_PATH.x - LENGHT_X, y: FIRST_PATH.y + LENGHT_X };
                break;
            case AlignmentAngle.left:
                ctx.lineTo(LAST_PATH.x, FIRST_PATH.y);
                ctx.stroke();
                this.alignmentCoord = { x: LAST_PATH.x, y: FIRST_PATH.y };
                break;
            case AlignmentAngle.bottomLeft:
                ctx.lineTo(FIRST_PATH.x - LENGHT_X, FIRST_PATH.y - LENGHT_X);
                ctx.stroke();
                this.alignmentCoord = { x: FIRST_PATH.x - LENGHT_X, y: FIRST_PATH.y - LENGHT_X };
                break;
            case AlignmentAngle.bottom:
                ctx.lineTo(FIRST_PATH.x, LAST_PATH.y);
                ctx.stroke();
                this.alignmentCoord = { x: FIRST_PATH.x, y: LAST_PATH.y };
                break;
            case AlignmentAngle.bottomRight:
                ctx.lineTo(FIRST_PATH.x + LENGHT_X, FIRST_PATH.y - LENGHT_X);
                ctx.stroke();
                this.alignmentCoord = { x: FIRST_PATH.x + LENGHT_X, y: FIRST_PATH.y - LENGHT_X };
                break;
        }
    }
    // the number value of angle ranges is clear, and there's no need to add a self-referencing constant name if there's no other meaning
    // tslint:disable:no-magic-numbers
    private roundToNearestAngle(angle: number): number {
        if (angle >= 337.5 || angle < 22.5) {
            return AlignmentAngle.right;
        } else if (angle >= 22.5 && angle < 67.5) {
            return AlignmentAngle.topRight;
        } else if (angle >= 67.5 && angle < 112.5) {
            return AlignmentAngle.top;
        } else if (angle >= 112.5 && angle < 157.5) {
            return AlignmentAngle.topLeft;
        } else if (angle >= 157.5 && angle < 202.5) {
            return AlignmentAngle.left;
        } else if (angle >= 202.5 && angle < 247.5) {
            return AlignmentAngle.bottomLeft;
        } else if (angle >= 247.5 && angle < 292.5) {
            return AlignmentAngle.bottom;
        } else {
            return AlignmentAngle.bottomRight;
        }
    }

    private findAlignmentAngle(path: Vec2[]): number {
        const MOUSE_MOVE_COORD = path[path.length - 1];
        const MOUSE_DOWN_COORD = path[0];
        const POINT_X = MOUSE_MOVE_COORD.x - MOUSE_DOWN_COORD.x;
        const POINT_Y = MOUSE_MOVE_COORD.y - MOUSE_DOWN_COORD.y;
        const CIRCLE_ANGLE = 360;
        const HALF_CIRCLE_ANGLE = 180;
        let alignmentAngle: number;

        if (MOUSE_MOVE_COORD.y <= MOUSE_DOWN_COORD.y) {
            alignmentAngle = Math.abs(CIRCLE_ANGLE - Math.abs(Math.atan2(POINT_Y, POINT_X) * HALF_CIRCLE_ANGLE) / Math.PI);
        } else {
            alignmentAngle = Math.abs(Math.atan2(POINT_Y, POINT_X) * HALF_CIRCLE_ANGLE) / Math.PI;
        }
        const ROUNDED_ANGLE = this.roundToNearestAngle(alignmentAngle);
        return ROUNDED_ANGLE;
    }

    private clearPath(): void {
        this.pathData = [];
    }
    private clearPathSaved(): void {
        this.pathDataSaved = [];
    }

    execute(interaction: InteractionPath): void {
        for (let i = 0; i < interaction.path.length - 1; i++) {
            const PATH_DATA: Vec2[] = [interaction.path[i], interaction.path[i + 1]];
            this.drawLine(this.drawingService.baseCtx, PATH_DATA);
        }
        // Index of for loops is used in this context
        // tslint:disable:prefer-for-of
        for (let i = 0; i < interaction.path.length; i++) {
            this.mouseDownCoord = interaction.path[i];
            this.drawJunction(this.drawingService.baseCtx, interaction.path);
        }
        this.clearPathSaved();
        this.pathDataSaved.push(interaction.path[0]);
        this.pathDataSaved.push(interaction.path[interaction.path.length - 1]);
        if (this.isAround20Pixels()) {
            this.closeShape();
        }
        this.clearPathSaved();
    }
}
