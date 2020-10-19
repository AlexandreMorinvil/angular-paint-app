import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

export enum Anchors {
    Default = 0,
    TopLeft = 1,
    TopMiddle = 2,
    TopRight = 3,
    MiddleLeft = 4,
    MiddleRight = 5,
    BottomLeft = 6,
    BottomMiddle = 7,
    BottomRight = 8,
}

const DOTSIZE = 10;

@Injectable({
    providedIn: 'root',
})
export class SelectionToolService extends Tool {
    mouseDownCoord: Vec2;
    startDownCoord: Vec2;
    imageData: ImageData;
    private pathData: Vec2[];
    selectionCreated: boolean;
    draggingImage: boolean;
    rectWidth: number;
    rectHeight: number;
    clickOnAnchor: boolean;
    anchorHit: number = 0;
    image: HTMLImageElement;

    constructor(
        drawingService: DrawingService,
        private rectangleService: RectangleService,
        private tracing: TracingService,
        private colorService: ColorService,
    ) {
        super(drawingService, new Description('selection rectangle', 'r', 'question_mark.png'));
        this.mouseDown = false;
        this.clearPath();
        this.selectionCreated = false;
        this.draggingImage = false;
        this.clickOnAnchor = false;
        this.image = new Image();
    }

    onMouseDown(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.mouseDown = event.button === MouseButton.Left;

        if (this.selectionCreated && this.checkHit(this.mouseDownCoord)) {
            console.log('Click anchor');
            console.log(this.anchorHit);
        } else if (this.selectionCreated && this.hitSelection(this.mouseDownCoord.x, this.mouseDownCoord.y)) {
            console.log('Hit Selection');
            this.draggingImage = true;
        } else {
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
            console.log('create Selection');
            this.tracing.setHasFill(false);
            this.tracing.setHasContour(true);
            this.colorService.setSecondaryColor('#000000');
            this.startDownCoord = this.getPositionFromMouse(event);
            this.rectangleService.onMouseDown(event);
            this.pathData.push(this.startDownCoord);
        }
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.draggingImage && this.mouseDown) {
            console.log('move on drag');
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.previewCtx.putImageData(this.imageData, mousePosition.x - this.rectWidth / 2, mousePosition.y - this.rectHeight / 2);
            this.startDownCoord = { x: mousePosition.x - this.rectWidth / 2, y: mousePosition.y - this.rectHeight / 2 };
        } else if (this.clickOnAnchor && this.mouseDown) {
            console.log('move on anchor');
            this.drawingService.baseCtx.clearRect(this.startDownCoord.x, this.startDownCoord.y, this.rectWidth, this.rectHeight);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.previewCtx.drawImage(
                this.image,
                this.startDownCoord.x,
                this.startDownCoord.y,
                this.imageData.width,
                this.imageData.height,
                this.startDownCoord.x,
                this.startDownCoord.y,
                mousePosition.x - this.startDownCoord.x,
                mousePosition.y - this.startDownCoord.y,
            );
        } else if (this.isInCanvas(mousePosition) && this.mouseDown) {
            console.log('move on create');
            this.rectangleService.onMouseMove(event);
            if (this.startDownCoord.x !== mousePosition.x && this.startDownCoord.y !== mousePosition.y) {
                this.imageData = this.drawingService.baseCtx.getImageData(
                    this.startDownCoord.x,
                    this.startDownCoord.y,
                    mousePosition.x - this.startDownCoord.x,
                    mousePosition.y - this.startDownCoord.y,
                );
            }
            this.pathData.push(mousePosition);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.draggingImage) {
            console.log('end on drag');
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.baseCtx.putImageData(this.imageData, mousePosition.x - this.rectWidth / 2, mousePosition.y - this.rectHeight / 2);
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.rect(
                mousePosition.x - this.rectWidth / 2,
                mousePosition.y - this.rectHeight / 2,
                this.rectWidth,
                this.rectHeight,
            );
            this.drawingService.previewCtx.stroke();
            this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
            this.draggingImage = false;
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
        } else if (this.clickOnAnchor) {
            console.log('end on click anchor');
            this.drawingService.baseCtx.drawImage(
                this.image,
                this.startDownCoord.x,
                this.startDownCoord.y,
                this.imageData.width,
                this.imageData.height,
                this.startDownCoord.x,
                this.startDownCoord.y,
                mousePosition.x - this.startDownCoord.x,
                mousePosition.y - this.startDownCoord.y,
            );
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clickOnAnchor = false;
            this.selectionCreated = false;
        } else if (this.mouseDown) {
            console.log('end on create selec');
            this.pathData.push(mousePosition);
            this.drawingService.previewCtx.putImageData(this.imageData, this.startDownCoord.x, this.startDownCoord.y);
            this.rectangleService.drawRectangle(this.drawingService.previewCtx, this.pathData);
            this.rectWidth = Math.abs(this.startDownCoord.x - this.pathData[this.pathData.length - 1].x);
            this.rectHeight = Math.abs(this.startDownCoord.y - this.pathData[this.pathData.length - 1].y);
            this.drawingService.baseCtx.clearRect(
                this.startDownCoord.x,
                this.startDownCoord.y,
                this.pathData[this.pathData.length - 1].x - this.startDownCoord.x,
                this.pathData[this.pathData.length - 1].y - this.startDownCoord.y,
            );
            this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
            this.selectionCreated = true;
        }
        this.mouseDown = false;
        this.clearPath();
    }

    drawnAnchor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        this.colorService.setPrimaryColor('#000000');
        ctx.beginPath();
        // start coner
        ctx.arc(this.startDownCoord.x, this.startDownCoord.y, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();

        // end corner
        ctx.arc(this.startDownCoord.x + this.rectWidth, this.startDownCoord.y + this.rectHeight, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();

        // two other corner
        ctx.arc(this.startDownCoord.x, this.startDownCoord.y + this.rectHeight, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.arc(this.startDownCoord.x + this.rectWidth, this.startDownCoord.y, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();

        // four mid anchor
        ctx.arc((this.rectWidth + this.startDownCoord.x * 2) / 2, this.startDownCoord.y + this.rectHeight, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.arc((this.rectWidth + this.startDownCoord.x * 2) / 2, this.startDownCoord.y, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.arc(this.startDownCoord.x, (this.rectHeight + this.startDownCoord.y * 2) / 2, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.arc(this.startDownCoord.x + this.rectWidth, (this.rectHeight + this.startDownCoord.y * 2) / 2, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    }

    checkHit(mouse: Vec2): boolean {
        let x: number;
        let y: number;
        const dotSizeSquare: number = Math.pow(DOTSIZE, 2);

        // top left corner
        x = Math.pow(mouse.x - this.startDownCoord.x, 2);
        y = Math.pow(mouse.y - this.startDownCoord.y, 2);
        if (x + y <= dotSizeSquare) {
            this.clickOnAnchor = true;
            this.anchorHit = Anchors.TopLeft;
        }

        // top middle
        x = Math.pow(mouse.x - (this.startDownCoord.x + this.imageData.width / 2), 2);
        y = Math.pow(mouse.y - this.startDownCoord.y, 2);
        if (x + y <= dotSizeSquare) {
            this.clickOnAnchor = true;
            this.anchorHit = Anchors.TopMiddle;
        }

        // top right corner
        x = Math.pow(mouse.x - (this.imageData.width + this.startDownCoord.x), 2);
        y = Math.pow(mouse.y - this.startDownCoord.y, 2);
        if (x + y <= dotSizeSquare) {
            this.clickOnAnchor = true;
            this.anchorHit = Anchors.TopRight;
        }

        // middle left
        x = Math.pow(mouse.x - this.startDownCoord.x, 2);
        y = Math.pow(mouse.y - (this.startDownCoord.y + this.imageData.height / 2), 2);
        if (x + y <= dotSizeSquare) {
            this.clickOnAnchor = true;
            this.anchorHit = Anchors.MiddleLeft;
        }

        // middle right
        x = Math.pow(mouse.x - (this.imageData.width + this.startDownCoord.x), 2);
        y = Math.pow(mouse.y - (this.startDownCoord.y + this.imageData.height / 2), 2);
        if (x + y <= dotSizeSquare) {
            this.clickOnAnchor = true;
            this.anchorHit = Anchors.MiddleRight;
        }

        // bottom left corner
        x = Math.pow(mouse.x - this.startDownCoord.x, 2);
        y = Math.pow(mouse.y - (this.imageData.height + this.startDownCoord.y), 2);
        if (x + y <= dotSizeSquare) {
            this.clickOnAnchor = true;
            this.anchorHit = Anchors.BottomLeft;
        }

        // bottom middle
        x = Math.pow(mouse.x - (this.startDownCoord.x + this.imageData.width / 2), 2);
        y = Math.pow(mouse.y - (this.imageData.height + this.startDownCoord.y), 2);
        if (x + y <= dotSizeSquare) {
            this.clickOnAnchor = true;
            this.anchorHit = Anchors.BottomMiddle;
        }

        // bottom right corner
        x = Math.pow(mouse.x - (this.imageData.width + this.startDownCoord.x), 2);
        y = Math.pow(mouse.y - (this.imageData.height + this.startDownCoord.y), 2);
        if (x + y <= dotSizeSquare) {
            this.clickOnAnchor = true;
            this.anchorHit = Anchors.BottomRight;
        }

        if (!this.clickOnAnchor) {
            this.clickOnAnchor = false;
            this.anchorHit = Anchors.Default;
        }
        return this.clickOnAnchor;
    }

    private isInCanvas(mousePosition: Vec2): boolean {
        return mousePosition.x <= this.drawingService.baseCtx.canvas.width && mousePosition.y <= this.drawingService.baseCtx.canvas.height;
    }

    private clearPath(): void {
        this.pathData = [];
    }

    private hitSelection(x: number, y: number): boolean {
        const xIn = x > this.startDownCoord.x && x < this.imageData.width + this.startDownCoord.x;
        const yIn = y > this.startDownCoord.y && y < this.imageData.height + this.startDownCoord.y;
        return xIn && yIn;
    }
}
