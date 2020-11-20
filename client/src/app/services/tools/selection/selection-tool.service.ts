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
// tslint:disable:max-file-line-count
@Injectable({
    providedIn: 'root',
})
export abstract class SelectionToolService extends Tool {
    mouseDownCoord: Vec2;
    protected startDownCoord: Vec2;
    protected pathLastCoord: Vec2;
    protected imageData: ImageData;
    protected oldImageData: ImageData;
    protected pathData: Vec2[];
    protected selectionCreated: boolean;
    protected draggingImage: boolean;
    protected clickOnAnchor: boolean;
    protected anchorHit: number = 0;
    shiftDown: boolean;
    protected arrowPress: boolean[];
    protected arrowDown: boolean;
    protected arrowCoord: Vec2;
    protected hasDoneFirstTranslation: boolean;
    protected localMouseDown: boolean = false;
    protected startSelectionPoint: Vec2;
    protected image: HTMLImageElement;
    protected ratio: number;

    constructor(drawingService: DrawingService, private color: ColorService, description: Description) {
        super(drawingService, description);
        this.mouseDown = false;
        this.clearPath();
        this.selectionCreated = false;
        this.draggingImage = false;
        this.clickOnAnchor = false;
        this.shiftDown = false;
        this.hasDoneFirstTranslation = false;
    }

    onEscapeDown(): void {
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

    protected offsetAnchors(coords: Vec2): Vec2 {
        coords.x = coords.x > this.pathData[this.pathData.length - 1].x ? this.pathData[this.pathData.length - 1].x : coords.x;
        coords.y = coords.y > this.pathData[this.pathData.length - 1].y ? this.pathData[this.pathData.length - 1].y : coords.y;
        return coords;
    }

    protected drawImage(
        canvas: CanvasRenderingContext2D,
        startCoord: Vec2,
        imageStart: Vec2,
        offset: Vec2,
        image: HTMLImageElement,
        size: Vec2,
    ): void {
        canvas.drawImage(image, imageStart.x, imageStart.y, size.x, size.y, startCoord.x, startCoord.y, offset.x, offset.y);
    }

    // tslint:disable:cyclomatic-complexity
    // resizing
    protected getAnchorHit(canvas: CanvasRenderingContext2D, mousePosition: Vec2, caller: number): void {
        let adjustStartCoords: Vec2 = this.startDownCoord;
        let adjustOffsetCoords: Vec2 = { x: mousePosition.x - adjustStartCoords.x, y: mousePosition.y - adjustStartCoords.y };
        const size = { x: this.imageData.width, y: this.imageData.height };
        let scaleX = 1;
        let scaleY = 1;
        // tslint:disable:no-magic-numbers
        switch (this.anchorHit) {
            case Anchors.TopLeft:
                adjustStartCoords = { x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y + this.imageData.height };
                adjustOffsetCoords = { x: mousePosition.x - adjustStartCoords.x, y: mousePosition.y - adjustStartCoords.y };
                scaleX = adjustOffsetCoords.x > 0 ? -1 : 1;
                scaleY = adjustOffsetCoords.y > 0 ? -1 : 1;
                break;
            case Anchors.TopMiddle:
                adjustStartCoords = { x: this.startDownCoord.x, y: this.startDownCoord.y + this.imageData.height };
                adjustOffsetCoords = { x: this.imageData.width, y: mousePosition.y - adjustStartCoords.y };
                mousePosition = { x: this.startDownCoord.x + this.imageData.width, y: mousePosition.y };
                scaleY = adjustOffsetCoords.y > 0 ? -1 : 1;
                break;
            case Anchors.TopRight:
                adjustStartCoords = { x: this.startDownCoord.x, y: this.startDownCoord.y + this.imageData.height };
                adjustOffsetCoords = { x: mousePosition.x - adjustStartCoords.x, y: mousePosition.y - adjustStartCoords.y };
                scaleX = adjustOffsetCoords.x < 0 ? -1 : 1;
                scaleY = adjustOffsetCoords.y > 0 ? -1 : 1;
                break;
            case Anchors.MiddleLeft:
                adjustStartCoords = { x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y };
                adjustOffsetCoords = { x: mousePosition.x - adjustStartCoords.x, y: this.imageData.height };
                mousePosition = { x: mousePosition.x, y: this.startDownCoord.y + this.imageData.height };
                scaleX = adjustOffsetCoords.x > 0 ? -1 : 1;
                break;
            case Anchors.MiddleRight:
                adjustOffsetCoords = { x: mousePosition.x - adjustStartCoords.x, y: this.imageData.height };
                mousePosition = { x: mousePosition.x, y: this.startDownCoord.y + this.imageData.height };
                scaleX = adjustOffsetCoords.x < 0 ? -1 : 1;
                break;
            case Anchors.BottomLeft:
                adjustStartCoords = { x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y };
                adjustOffsetCoords = { x: mousePosition.x - adjustStartCoords.x, y: mousePosition.y - adjustStartCoords.y };
                scaleX = adjustOffsetCoords.x > 0 ? -1 : 1;
                scaleY = adjustOffsetCoords.y < 0 ? -1 : 1;
                break;
            case Anchors.BottomMiddle:
                adjustOffsetCoords = { x: this.imageData.width, y: mousePosition.y - adjustStartCoords.y };
                mousePosition = { x: this.startDownCoord.x + this.imageData.width, y: mousePosition.y };
                scaleY = adjustOffsetCoords.y < 0 ? -1 : 1;
                break;
            case Anchors.BottomRight:
                adjustOffsetCoords = { x: mousePosition.x - this.startDownCoord.x, y: mousePosition.y - this.startDownCoord.y };
                scaleX = adjustOffsetCoords.x < 0 ? -1 : 1;
                scaleY = adjustOffsetCoords.y < 0 ? -1 : 1;
                break;
            default:
                break;
        }
        // mirror effect
        canvas.scale(scaleX, scaleY);
        adjustStartCoords = { x: scaleX * adjustStartCoords.x, y: scaleY * adjustStartCoords.y };
        adjustOffsetCoords = { x: scaleX * adjustOffsetCoords.x, y: scaleY * adjustOffsetCoords.y };
        mousePosition = { x: scaleX * mousePosition.x, y: scaleY * mousePosition.y };
        // Resizing while keeping the aspect ratio
        if (this.shiftDown) {
            const ratioW = this.imageData.width / this.ratio;
            const ratioH = this.imageData.height / this.ratio;
            let value = adjustOffsetCoords.x % ratioW;
            let value1 = adjustOffsetCoords.y % ratioH;
            if (Math.abs(adjustOffsetCoords.x - value) / ratioW > Math.abs(adjustOffsetCoords.y - value1) / ratioH) {
                adjustOffsetCoords.y -= value1;
                const val = Math.floor(Math.abs(adjustOffsetCoords.x - value) / ratioW - Math.abs(adjustOffsetCoords.y - value1) / ratioH);
                for (let i = 0; i < val; i++) {
                    adjustOffsetCoords.x -= value + 1;
                    value = adjustOffsetCoords.x % ratioW;
                    adjustOffsetCoords.x -= value;
                }
            } else if (Math.abs(adjustOffsetCoords.x - value) / ratioW < Math.abs(adjustOffsetCoords.y - value1) / ratioH) {
                adjustOffsetCoords.x -= value;
                const val = Math.floor(Math.abs(adjustOffsetCoords.y - value1) / ratioH - Math.abs(adjustOffsetCoords.x - value) / ratioW);
                for (let i = 0; i < val; i++) {
                    adjustOffsetCoords.y -= value1 + 1;
                    value1 = adjustOffsetCoords.y % ratioH;
                    adjustOffsetCoords.y -= value1;
                }
            } else {
                adjustOffsetCoords.y -= value1;
                adjustOffsetCoords.x -= value;
            }
            mousePosition = { x: adjustOffsetCoords.x + adjustStartCoords.x, y: adjustOffsetCoords.y + adjustStartCoords.y };
        }
        if (caller === 1) {
            // ellipse is calling
            this.showSelectionResize(canvas, size, adjustStartCoords, adjustOffsetCoords, mousePosition);
        } else if (caller === 2) {
            // rectangle is calling
            this.drawImage(canvas, adjustStartCoords, this.startDownCoord, adjustOffsetCoords, this.image, size);
        }
        // reset canvas transform after mirror effect
        canvas.setTransform(1, 0, 0, 1, 0, 0);
    }
    protected getRatio(w: number, h: number): number {
        return h === 0 ? w : this.getRatio(h, w % h);
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
                this.arrowDown = false;
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
        let imageDat: ImageData = new ImageData(1, 1);
        if (this.startDownCoord.x !== mousePosition.x && this.startDownCoord.y !== mousePosition.y) {
            imageDat = this.drawingService.baseCtx.getImageData(
                this.startDownCoord.x,
                this.startDownCoord.y,
                (mousePosition.x - this.startDownCoord.x) * 2,
                (mousePosition.y - this.startDownCoord.y) * 2,
            );
        }
        return imageDat;
    }

    protected evenImageStartCoord(mousePosition: Vec2): Vec2 {
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

    private showSelectionResize(
        canvas: CanvasRenderingContext2D,
        size: Vec2,
        adjustStartCoords: Vec2,
        adjustOffsetCoords: Vec2,
        mousePosition: Vec2,
    ): void {
        this.pathLastCoord = mousePosition;
        canvas.save();
        const ellipsePath = this.getPath(0, adjustStartCoords);
        canvas.clip(ellipsePath);
        this.drawImage(canvas, adjustStartCoords, this.startDownCoord, adjustOffsetCoords, this.image, size);
        canvas.restore();
    }

    protected getPath(offset: number, startCoord: Vec2): Path2D {
        const ellipsePath = new Path2D();
        const mouseMoveCoord = this.pathLastCoord;
        const centerX = (mouseMoveCoord.x + startCoord.x) / 2;
        const centerY = (mouseMoveCoord.y + startCoord.y) / 2;

        const radiusX = Math.abs(mouseMoveCoord.x - startCoord.x) / 2;
        const radiusY = Math.abs(mouseMoveCoord.y - startCoord.y) / 2;

        const contourRadiusX = Math.abs(radiusX - 1 / 2);
        const contourRadiusY = Math.abs(radiusY - 1 / 2);
        ellipsePath.ellipse(centerX, centerY, contourRadiusX + offset, contourRadiusY + offset, 0, 0, Math.PI * 2, false);
        return ellipsePath;
    }

    protected getActionTrackingInfo(mousePosition: Vec2): Vec2[] {
        const imageDataStart = { x: 0, y: 0 };
        const imageDataEnd = { x: 0, y: 0 };
        imageDataStart.x = this.startSelectionPoint.x < mousePosition.x ? this.startSelectionPoint.x : mousePosition.x;
        imageDataStart.y = this.startSelectionPoint.y < mousePosition.y ? this.startSelectionPoint.y : mousePosition.y;
        imageDataEnd.x =
            this.startSelectionPoint.x > mousePosition.x ? this.startSelectionPoint.x + this.imageData.width : mousePosition.x + this.imageData.width;
        imageDataEnd.y =
            this.startSelectionPoint.y > mousePosition.y
                ? this.startSelectionPoint.y + this.imageData.height
                : mousePosition.y + this.imageData.height;
        return [imageDataStart, imageDataEnd];
    }
}
