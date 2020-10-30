import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';

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
export abstract class SelectionToolService extends Tool {
    mouseDownCoord: Vec2;
    startDownCoord: Vec2;
    pathLastCoord: Vec2;
    imageData: ImageData;
    protected pathData: Vec2[];
    selectionCreated: boolean;
    draggingImage: boolean;
    clickOnAnchor: boolean;
    anchorHit: number = 0;
    image: HTMLImageElement;
    shiftDown: boolean;
    arrowPress: boolean[];
    arrowDown: boolean;
    arrowCoord: Vec2;

    constructor(drawingService: DrawingService, private color: ColorService, description: Description) {
        super(drawingService, description);
        this.mouseDown = false;
        this.clearPath();
        this.selectionCreated = false;
        this.draggingImage = false;
        this.clickOnAnchor = false;
        this.image = new Image();
        this.shiftDown = false;
    }
    // tslint:disable:no-empty
    onMouseDown(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onArrowDown(event: KeyboardEvent): void {}

    onShiftDown(event: KeyboardEvent): void {}

    onShiftUp(event: KeyboardEvent): void {}

    onEscapeDown(event: KeyboardEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selectionCreated = false;
        this.arrowDown = true;
    }

    protected drawnAnchor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        this.color.setPrimaryColor('#000000');
        ctx.beginPath();
        // start coner
        ctx.arc(this.startDownCoord.x, this.startDownCoord.y, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        // end corner
        ctx.arc(this.startDownCoord.x + this.imageData.width, this.startDownCoord.y + this.imageData.height, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        // two other corner
        ctx.arc(this.startDownCoord.x, this.startDownCoord.y + this.imageData.height, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.arc(this.startDownCoord.x + this.imageData.width, this.startDownCoord.y, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        // four mid anchor
        ctx.arc(
            (this.imageData.width + this.startDownCoord.x * 2) / 2,
            this.startDownCoord.y + this.imageData.height,
            DOTSIZE,
            0,
            Math.PI * 2,
            false,
        );
        ctx.closePath();
        ctx.arc((this.imageData.width + this.startDownCoord.x * 2) / 2, this.startDownCoord.y, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.arc(this.startDownCoord.x, (this.imageData.height + this.startDownCoord.y * 2) / 2, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.arc(
            this.startDownCoord.x + this.imageData.width,
            (this.imageData.height + this.startDownCoord.y * 2) / 2,
            DOTSIZE,
            0,
            Math.PI * 2,
            false,
        );
        ctx.closePath();
        ctx.fill();
    }
    // resizing
    protected checkHit(mouse: Vec2): boolean {
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

    protected clearPath(): void {
        this.pathData = [];
    }

    protected hitSelection(x: number, y: number): boolean {
        const xIn = x > this.startDownCoord.x && x < this.imageData.width + this.startDownCoord.x;
        const yIn = y > this.startDownCoord.y && y < this.imageData.height + this.startDownCoord.y;
        return xIn && yIn;
    }

    protected offsetAnchors(coords: Vec2): void {
        if (coords.x > this.pathData[this.pathData.length - 1].x || coords.y > this.pathData[this.pathData.length - 1].y) {
            if (coords.y > this.pathData[this.pathData.length - 1].y) {
                coords.y = this.pathData[this.pathData.length - 1].y;
            }
            if (coords.x > this.pathData[this.pathData.length - 1].x) {
                coords.x = this.pathData[this.pathData.length - 1].x;
            }
        }
    }

    protected drawImage(canvas: CanvasRenderingContext2D, startCoord: Vec2, imageStart: Vec2, offset: Vec2): void {
        canvas.drawImage(
            this.image,
            imageStart.x,
            imageStart.y,
            this.imageData.width,
            this.imageData.height,
            startCoord.x,
            startCoord.y,
            offset.x,
            offset.y,
        );
    }
    // resizing
    protected getAnchorHit(canvas: CanvasRenderingContext2D, mousePosition: Vec2): void {
        let adjustStartCoords: Vec2 = this.startDownCoord;
        let adjustOffsetCoords: Vec2;
        switch (this.anchorHit) {
            case Anchors.TopLeft:
                adjustStartCoords = { x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y + this.imageData.height };
                adjustOffsetCoords = { x: mousePosition.x - adjustStartCoords.x, y: mousePosition.y - adjustStartCoords.y }; //
                this.drawImage(canvas, adjustStartCoords, this.startDownCoord, adjustOffsetCoords);
                break;
            case Anchors.TopMiddle:
                adjustStartCoords = { x: this.startDownCoord.x, y: this.startDownCoord.y + this.imageData.height };
                adjustOffsetCoords = { x: this.imageData.width, y: mousePosition.y - adjustStartCoords.y };
                this.drawImage(canvas, adjustStartCoords, this.startDownCoord, adjustOffsetCoords);
                break;
            case Anchors.TopRight:
                adjustStartCoords = { x: this.startDownCoord.x, y: this.startDownCoord.y + this.imageData.height };
                adjustOffsetCoords = { x: mousePosition.x - adjustStartCoords.x, y: mousePosition.y - adjustStartCoords.y }; //
                this.drawImage(canvas, adjustStartCoords, this.startDownCoord, adjustOffsetCoords);
                break;
            case Anchors.MiddleLeft:
                adjustStartCoords = { x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y };
                adjustOffsetCoords = { x: mousePosition.x - adjustStartCoords.x, y: this.imageData.height };
                this.drawImage(canvas, adjustStartCoords, this.startDownCoord, adjustOffsetCoords);
                break;
            case Anchors.MiddleRight:
                adjustOffsetCoords = { x: mousePosition.x - adjustStartCoords.x, y: this.imageData.height };
                this.drawImage(canvas, adjustStartCoords, this.startDownCoord, adjustOffsetCoords);
                break;
            case Anchors.BottomLeft:
                adjustStartCoords = { x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y };
                adjustOffsetCoords = { x: mousePosition.x - adjustStartCoords.x, y: mousePosition.y - adjustStartCoords.y };
                this.drawImage(canvas, adjustStartCoords, this.startDownCoord, adjustOffsetCoords);
                break;
            case Anchors.BottomMiddle:
                adjustOffsetCoords = { x: this.imageData.width, y: mousePosition.y - adjustStartCoords.y };
                this.drawImage(canvas, adjustStartCoords, this.startDownCoord, adjustOffsetCoords);
                break;
            case Anchors.BottomRight:
                adjustOffsetCoords = { x: mousePosition.x - this.startDownCoord.x, y: mousePosition.y - this.startDownCoord.y };
                this.drawImage(canvas, adjustStartCoords, this.startDownCoord, adjustOffsetCoords);
                break;
            default:
                break;
        }
    }

    protected putImageData(startCoord: Vec2, canvas: CanvasRenderingContext2D): void {
        canvas.putImageData(this.imageData, startCoord.x, startCoord.y);
    }

    protected getSquaredSize(mousePosition: Vec2): Vec2 {
        let width = mousePosition.x - this.startDownCoord.x;
        let height = mousePosition.y - this.startDownCoord.y;
        // If Shift is pressed should be a square
        const squareSide = Math.abs(Math.min(height, width));
        if (height < 0 && width >= 0) {
            height = -squareSide;
            width = squareSide;
        } else if (height >= 0 && width < 0) {
            width = -squareSide;
            height = squareSide;
        } else if (height < 0 && width < 0) {
            width = -squareSide;
            height = -squareSide;
        } else {
            width = squareSide;
            height = squareSide;
        }
        return { x: width, y: height };
    }
}
