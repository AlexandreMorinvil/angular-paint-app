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
    oldImageData: ImageData;
    protected pathData: Vec2[];
    selectionCreated: boolean;
    draggingImage: boolean;
    clickOnAnchor: boolean;
    anchorHit: number = 0;
    image: HTMLImageElement;
    oldImage: HTMLImageElement;
    shiftDown: boolean;
    arrowPress: boolean[];
    arrowDown: boolean;
    arrowCoord: Vec2;
    firstTranslation: boolean;

    constructor(drawingService: DrawingService, private color: ColorService, description: Description) {
        super(drawingService, description);
        this.mouseDown = false;
        this.clearPath();
        this.selectionCreated = false;
        this.draggingImage = false;
        this.clickOnAnchor = false;
        this.image = new Image();
        this.oldImage = new Image();
        this.shiftDown = false;
        this.firstTranslation = false;
    }

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

    protected drawImage(canvas: CanvasRenderingContext2D, startCoord: Vec2, imageStart: Vec2, offset: Vec2, image: HTMLImageElement): void {
        canvas.drawImage(
            image,
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

    protected putImageData(startCoord: Vec2, canvas: CanvasRenderingContext2D, image: ImageData): void {
        canvas.putImageData(image, startCoord.x, startCoord.y);
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

    protected checkArrowHit(event: KeyboardEvent): void {
        // tslint:disable:no-magic-numbers
        this.arrowDown = true;
        const move = 3;
        switch (event.key) {
            case 'ArrowLeft':
                this.arrowPress[0] = true;
                break;

            case 'ArrowRight':
                this.arrowPress[1] = true;
                break;

            case 'ArrowUp':
                this.arrowPress[2] = true;
                break;

            case 'ArrowDown':
                this.arrowPress[3] = true;
                break;
            default:
                break;
        }

        if (this.arrowPress[0]) {
            this.startDownCoord = { x: this.startDownCoord.x - move, y: this.startDownCoord.y };
            this.pathLastCoord = { x: this.pathLastCoord.x - move, y: this.pathLastCoord.y };
        }
        if (this.arrowPress[1]) {
            this.startDownCoord = { x: this.startDownCoord.x + move, y: this.startDownCoord.y };
            this.pathLastCoord = { x: this.pathLastCoord.x + move, y: this.pathLastCoord.y };
        }
        if (this.arrowPress[2]) {
            this.startDownCoord = { x: this.startDownCoord.x, y: this.startDownCoord.y - move };
            this.pathLastCoord = { x: this.pathLastCoord.x, y: this.pathLastCoord.y - move };
        }
        if (this.arrowPress[3]) {
            this.startDownCoord = { x: this.startDownCoord.x, y: this.startDownCoord.y + move };
            this.pathLastCoord = { x: this.pathLastCoord.x, y: this.pathLastCoord.y + move };
        }
    }

    protected checkArrowUnhit(event: KeyboardEvent): void {
        switch (event.key) {
            case 'ArrowLeft':
                this.arrowPress[0] = false;
                break;

            case 'ArrowRight':
                this.arrowPress[1] = false;
                break;

            case 'ArrowUp':
                this.arrowPress[2] = false;
                break;

            case 'ArrowDown':
                this.arrowPress[3] = false;
                break;
            default:
                break;
        }
    }

    protected getOldImageData(mousePosition: Vec2): ImageData {
        return this.drawingService.baseCtx.getImageData(
            this.startDownCoord.x,
            this.startDownCoord.y,
            (mousePosition.x - this.startDownCoord.x) * 2,
            (mousePosition.y - this.startDownCoord.y) * 2,
        );
    }

    evenImageStartCoord(mousePosition: Vec2): Vec2 {
        // tslint:disable:prefer-const
        let startCoord = { x: mousePosition.x - this.imageData.width / 2, y: mousePosition.y - this.imageData.height / 2 };
        if (this.imageData.width % 2 !== 0 || this.imageData.height % 2 !== 0) {
            if (this.imageData.width % 2 !== 0) {
                startCoord.x = mousePosition.x - (this.imageData.width + 1) / 2;
            }
            if (this.imageData.height % 2 !== 0) {
                startCoord.y = mousePosition.y - (this.imageData.height + 1) / 2;
            }
        }
        return startCoord;
    }
}
