import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    private pathData: Vec2[];
    private pathDataSaved: Vec2[];

    private width: number = 1;
    private startPosition: Vec2;
    private endPosition: Vec2;
    private countClick: number;
    private click: number;
    private timer: number;
    private undo: ImageData[];
    private undoLimit: number = 24;
    private savedData: ImageData;

    constructor(drawingService: DrawingService) {
        super(drawingService, 'ligne', 'l');
        this.clearPath();
        this.clearPathSaved();
        this.countClick = 0;
        this.click = 0;
        this.timer = 0;
        this.undo = [];
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseClick) {
            const mousePosition = this.getPositionFromMouse(event);

            if (this.isInCanvas(mousePosition)) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.pathData[0] = this.mouseDownCoord;
                this.pathData.push(mousePosition);
                this.drawLine(this.drawingService.previewCtx, this.pathData);
                // On dessine sur le canvas de prévisualisation et on l'efface à chaque déplacement de la souris
            } else {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.clearPath();
            }
        }
    }

    onBackspaceDown(): void {
        if (this.undo.length > 0) {
        }
        this.drawingService.baseCtx.putImageData(this.undo[this.undo.length - 2], 0, 0);
        this.undo.pop();
        this.clearPath();
    }

    onEscapeDown(): void {
        this.mouseClick = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.clearPath();
        console.log('Escape was pressed!!!');
    }

    onMouseClick(event: MouseEvent): void {
        this.mouseClick = event.button === MouseButton.Left;
        if (this.mouseClick) {
            this.countClick++;
            this.click++;
            if (this.click == 1) {
                this.mouseDownCoord = this.getPositionFromMouse(event);
                this.pathData.push(this.mouseDownCoord);
                this.drawLine(this.drawingService.baseCtx, this.pathData);
                this.initialiseStartAndEndPoint();
                this.savedData = this.drawingService.baseCtx.getImageData(0, 0, this.drawingService.canvas.width, this.drawingService.canvas.height);
                if (this.undo.length >= this.undoLimit) {
                    this.undo.shift();
                }
                this.undo.push(this.savedData);

                this.clearPath();
            }
            if (this.click === 1) {
                this.timer = setTimeout(() => {
                    this.click = 0;
                    console.log('click');
                }, 200);
            } else if (this.click === 2) {
                clearTimeout(this.timer);
                this.click = 0;
                this.onMouseDoubleClickEvent(event);
            }
        }
    }

    private onMouseDoubleClickEvent(event: MouseEvent): void {
        this.mouseClick = false;
        console.log('doubleClick');
        this.clearPath();
        if (this.isAround20Pixels()) {
            this.drawingService.baseCtx.beginPath();
            let firstPath = this.pathDataSaved[0];
            let lastPath = this.pathDataSaved[this.pathDataSaved.length - 1];
            this.drawingService.baseCtx.moveTo(firstPath.x, firstPath.y);
            this.drawingService.baseCtx.lineTo(lastPath.x, lastPath.y);

            this.drawingService.baseCtx.lineWidth = this.width; //width ajustment
            this.drawingService.baseCtx.stroke();
        }
        this.clearPathSaved();
        this.countClick = 0;
        this.click = 0;
    }

    private isInCanvas(mousePosition: Vec2): boolean {
        return mousePosition.x <= this.drawingService.previewCtx.canvas.width && mousePosition.y <= this.drawingService.previewCtx.canvas.height;
    }

    private drawLine(ctx: CanvasRenderingContext2D, path: Vec2[]): void {
        ctx.beginPath();
        let firstPath = path[0];
        let lastPath = path[path.length - 1];
        ctx.moveTo(firstPath.x, firstPath.y);
        ctx.lineTo(lastPath.x, lastPath.y);

        ctx.lineWidth = this.width; //width ajustment
        ctx.stroke();
    }
    private isAround20Pixels(): boolean {
        let diffXPosition = this.endPosition.x - this.pathDataSaved[0].x;
        let diffYPosition = this.endPosition.y - this.pathDataSaved[0].y;
        let xSideTriangleSquared = Math.pow(diffXPosition, 2);
        let ySideTriangleSquared = Math.pow(diffYPosition, 2);
        let hypothenus = Math.sqrt(xSideTriangleSquared + ySideTriangleSquared);
        console.log(hypothenus + ' hypothenus');
        if (hypothenus <= 200) {
            // on est en bas de 20 pixels
            return true;
        }
        return false;
    }

    private initialiseStartAndEndPoint(): void {
        if (this.countClick == 1) {
            //first click
            this.startPosition = this.mouseDownCoord;
            console.log(this.startPosition.x);
            console.log(this.startPosition.y);
            this.pathDataSaved.push(this.startPosition);
        } else if (this.countClick == 2) {
            //second click
            this.endPosition = this.mouseDownCoord;
            console.log(this.endPosition.x);
            console.log(this.endPosition.y);
            this.pathDataSaved.push(this.endPosition);
        } else {
            //others click
            this.startPosition = this.endPosition;
            console.log(this.startPosition.x);
            console.log(this.startPosition.y);
            this.endPosition = this.mouseDownCoord;
            console.log(this.endPosition.x);
            console.log(this.endPosition.y);
            this.pathDataSaved.push(this.startPosition);
            this.pathDataSaved.push(this.endPosition);
        }
    }

    private clearPath(): void {
        this.pathData = [];
    }
    private clearPathSaved(): void {
        this.pathDataSaved = [];
    }
}
