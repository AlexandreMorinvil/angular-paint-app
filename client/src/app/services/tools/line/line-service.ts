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
    private width: number = 1;
    private startXPosition: number;
    private startYPosition: number;
    private endXPosition: number;
    private endYPosition: number;
    private countClick: number;
    private click: number;
    private timer: number;

    constructor(drawingService: DrawingService) {
        super(drawingService, 'ligne', 'l');
        this.clearPath();
        this.countClick = 0;
        this.click = 0;
        this.timer = 0;
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
        this.mouseClick = false;
        this.clearAllCanvas();
        console.log('BackSpace');
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
            console.log(this.click);
            if (this.click === 1) {
                this.timer = setTimeout(() => {
                    this.click = 0;
                    this.onMouseClickEvent(event);
                }, 300);
            } else if (this.click === 2) {
                clearTimeout(this.timer);
                this.click = 0;
                this.onMouseDoubleClickEvent(event);
            }
        }
    }

    private onMouseDoubleClickEvent(event: MouseEvent): void {
        this.onMouseClickEvent(event);
        console.log('doubleClick');
        if (this.isAround20Pixels()) {
            this.mouseClick = false;
            this.clearPath();
        }
    }

    private onMouseClickEvent(event: MouseEvent): void {
        console.log('click');
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.pathData.push(this.mouseDownCoord);
        this.initialiseStartAndEndPoint();
        this.drawLine(this.drawingService.baseCtx, this.pathData);
        this.clearPath();
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
        let diffXPosition = this.endXPosition - this.startXPosition;
        let diffYPosition = this.endYPosition - this.startYPosition;
        let xSideTriangleSquared = Math.pow(diffXPosition, 2);
        let ySideTriangleSquared = Math.pow(diffYPosition, 2);
        let hypothenus = Math.sqrt(xSideTriangleSquared + ySideTriangleSquared);
        console.log(hypothenus + ' hypothenus');
        if (hypothenus <= 20) {
            // on est en bas de 20 pixels
            return true;
        }
        return false;
    }

    private initialiseStartAndEndPoint(): void {
        if (this.countClick == 1) {
            //first click
            this.startXPosition = this.mouseDownCoord.x;
            this.startYPosition = this.mouseDownCoord.y;
            //console.log(this.startXPosition);
            //console.log(this.startYPosition);
            //console.log('startPosition');
        } else if (this.countClick == 2) {
            //second click
            this.endXPosition = this.mouseDownCoord.x;
            this.endYPosition = this.mouseDownCoord.y;
            //console.log(this.endXPosition);
            //console.log(this.endYPosition);
            //console.log('endPosition');
        } else {
            //others click
            this.startXPosition = this.endXPosition;
            this.startYPosition = this.endYPosition;
            //console.log(this.startXPosition);
            //console.log(this.startYPosition);
            //console.log('startPosition');
            this.endXPosition = this.mouseDownCoord.x;
            this.endYPosition = this.mouseDownCoord.y;
            //console.log(this.endXPosition);
            //console.log(this.endYPosition);
            //console.log('endPosition');
        }
    }

    private clearPath(): void {
        this.pathData = [];
    }

    private clearAllCanvas(): void {
        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.clearPath();
    }
}
