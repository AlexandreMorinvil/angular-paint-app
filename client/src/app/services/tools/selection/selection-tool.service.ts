import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { EdgePixelsOneRegion } from './edge-pixel';

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
    protected hasDoneFirstRotation: boolean;
    protected hasDoneResizing: boolean;
    protected localMouseDown: boolean = false;
    protected startSelectionPoint: Vec2;
    protected image: HTMLImageElement;
    protected ratio: number;
    protected angle: number;
    protected resizeWidth: number;
    protected resizeHeight: number;
    protected pathStartCoordReference: Vec2;
    protected edgePixelsSplitted: EdgePixelsOneRegion[] = [];

    constructor(drawingService: DrawingService, private color: ColorService, description: Description) {
        super(drawingService, description);
        this.mouseDown = false;
        this.clearPath();
        this.selectionCreated = false;
        this.draggingImage = false;
        this.clickOnAnchor = false;
        this.shiftDown = false;
        this.hasDoneFirstTranslation = false;
        this.hasDoneFirstRotation = false;
        this.hasDoneResizing = false;
        this.angle = 0;
    }

    onEscapeDown(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selectionCreated = false;
        this.arrowDown = true;
    }

    protected drawnAnchor(ctx: CanvasRenderingContext2D, size: Vec2 = { x: this.imageData.width, y: this.imageData.height }): void {
        this.color.setPrimaryColor('#000000');
        ctx.beginPath();
        // start coner
        ctx.arc(this.startDownCoord.x, this.startDownCoord.y, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        // end corner
        ctx.arc(this.startDownCoord.x + size.x, this.startDownCoord.y + size.y, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        // two other corner
        ctx.arc(this.startDownCoord.x, this.startDownCoord.y + size.y, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.arc(this.startDownCoord.x + size.x, this.startDownCoord.y, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        // four mid anchor
        ctx.arc((size.x + this.startDownCoord.x * 2) / 2, this.startDownCoord.y + size.y, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.arc((size.x + this.startDownCoord.x * 2) / 2, this.startDownCoord.y, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.arc(this.startDownCoord.x, (size.y + this.startDownCoord.y * 2) / 2, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.arc(this.startDownCoord.x + size.x, (size.y + this.startDownCoord.y * 2) / 2, DOTSIZE, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    }

    // resizing
    protected checkHit(mouse: Vec2): boolean {
        let x: number;
        let y: number;
        const DOT_SIZE_SQUARE: number = Math.pow(DOTSIZE, 2);
        // top left corner
        x = Math.pow(mouse.x - this.startDownCoord.x, 2);
        y = Math.pow(mouse.y - this.startDownCoord.y, 2);
        if (x + y <= DOT_SIZE_SQUARE) {
            this.clickOnAnchor = true;
            this.anchorHit = Anchors.TopLeft;
        }
        // top middle
        x = Math.pow(mouse.x - (this.startDownCoord.x + this.imageData.width / 2), 2);
        y = Math.pow(mouse.y - this.startDownCoord.y, 2);
        if (x + y <= DOT_SIZE_SQUARE) {
            this.clickOnAnchor = true;
            this.anchorHit = Anchors.TopMiddle;
        }
        // top right corner
        x = Math.pow(mouse.x - (this.imageData.width + this.startDownCoord.x), 2);
        y = Math.pow(mouse.y - this.startDownCoord.y, 2);
        if (x + y <= DOT_SIZE_SQUARE) {
            this.clickOnAnchor = true;
            this.anchorHit = Anchors.TopRight;
        }
        // middle left
        x = Math.pow(mouse.x - this.startDownCoord.x, 2);
        y = Math.pow(mouse.y - (this.startDownCoord.y + this.imageData.height / 2), 2);
        if (x + y <= DOT_SIZE_SQUARE) {
            this.clickOnAnchor = true;
            this.anchorHit = Anchors.MiddleLeft;
        }
        // middle right
        x = Math.pow(mouse.x - (this.imageData.width + this.startDownCoord.x), 2);
        y = Math.pow(mouse.y - (this.startDownCoord.y + this.imageData.height / 2), 2);
        if (x + y <= DOT_SIZE_SQUARE) {
            this.clickOnAnchor = true;
            this.anchorHit = Anchors.MiddleRight;
        }
        // bottom left corner
        x = Math.pow(mouse.x - this.startDownCoord.x, 2);
        y = Math.pow(mouse.y - (this.imageData.height + this.startDownCoord.y), 2);
        if (x + y <= DOT_SIZE_SQUARE) {
            this.clickOnAnchor = true;
            this.anchorHit = Anchors.BottomLeft;
        }
        // bottom middle
        x = Math.pow(mouse.x - (this.startDownCoord.x + this.imageData.width / 2), 2);
        y = Math.pow(mouse.y - (this.imageData.height + this.startDownCoord.y), 2);
        if (x + y <= DOT_SIZE_SQUARE) {
            this.clickOnAnchor = true;
            this.anchorHit = Anchors.BottomMiddle;
        }
        // bottom right corner
        x = Math.pow(mouse.x - (this.imageData.width + this.startDownCoord.x), 2);
        y = Math.pow(mouse.y - (this.imageData.height + this.startDownCoord.y), 2);
        if (x + y <= DOT_SIZE_SQUARE) {
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
        const X_IN = x > this.startDownCoord.x && x < this.imageData.width + this.startDownCoord.x;
        const Y_IN = y > this.startDownCoord.y && y < this.imageData.height + this.startDownCoord.y;
        return X_IN && Y_IN;
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
        const SIZE = { x: this.imageData.width, y: this.imageData.height };
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
            const RATIO_WIDTH = this.imageData.width / this.ratio;
            const RATIO_HEIGHT = this.imageData.height / this.ratio;
            let value = adjustOffsetCoords.x % RATIO_WIDTH; ///////// CHANGER LES NOMS
            let value1 = adjustOffsetCoords.y % RATIO_HEIGHT;
            if (Math.abs(adjustOffsetCoords.x - value) / RATIO_WIDTH > Math.abs(adjustOffsetCoords.y - value1) / RATIO_HEIGHT) {
                adjustOffsetCoords.y -= value1;
                const ASPECT_DIFFERENCE = Math.floor(
                    Math.abs(adjustOffsetCoords.x - value) / RATIO_WIDTH - Math.abs(adjustOffsetCoords.y - value1) / RATIO_HEIGHT,
                );
                for (let i = 0; i < ASPECT_DIFFERENCE; i++) {
                    adjustOffsetCoords.x -= value + 1;
                    value = adjustOffsetCoords.x % RATIO_WIDTH;
                    adjustOffsetCoords.x -= value;
                }
            } else if (Math.abs(adjustOffsetCoords.x - value) / RATIO_WIDTH < Math.abs(adjustOffsetCoords.y - value1) / RATIO_HEIGHT) {
                adjustOffsetCoords.x -= value;
                const ASPECT_DIFFERENCE = Math.floor(
                    Math.abs(adjustOffsetCoords.y - value1) / RATIO_HEIGHT - Math.abs(adjustOffsetCoords.x - value) / RATIO_WIDTH,
                );
                for (let i = 0; i < ASPECT_DIFFERENCE; i++) {
                    adjustOffsetCoords.y -= value1 + 1;
                    value1 = adjustOffsetCoords.y % RATIO_HEIGHT;
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
            this.showSelectionResize(canvas, SIZE, adjustStartCoords, adjustOffsetCoords, mousePosition, caller);
        } else if (caller === 2) {
            // rectangle is calling
            this.drawImage(canvas, adjustStartCoords, this.startDownCoord, adjustOffsetCoords, this.image, SIZE);
        } else if (caller === 3) {
            // magic wand is calling
            this.showSelectionResize(canvas, SIZE, adjustStartCoords, adjustOffsetCoords, mousePosition, caller);
        }
        // reset canvas transform after mirror effect
        canvas.setTransform(1, 0, 0, 1, 0, 0);
        this.resizeWidth = Math.abs(adjustOffsetCoords.x);
        this.resizeHeight = Math.abs(adjustOffsetCoords.y);
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
        const SQUARE_SIZE = Math.abs(Math.min(height, width));
        if (height < 0 && width >= 0) {
            height = -SQUARE_SIZE;
            width = SQUARE_SIZE;
        } else if (height >= 0 && width < 0) {
            width = -SQUARE_SIZE;
            height = SQUARE_SIZE;
        } else if (height < 0 && width < 0) {
            width = -SQUARE_SIZE;
            height = -SQUARE_SIZE;
        } else {
            width = SQUARE_SIZE;
            height = SQUARE_SIZE;
        }
        return { x: width, y: height };
    }

    protected checkArrowHit(event: KeyboardEvent): void {
        // tslint:disable:no-magic-numbers
        this.arrowDown = true;
        const MOVE = 3;
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
            this.startDownCoord = { x: this.startDownCoord.x - MOVE, y: this.startDownCoord.y };
            this.pathLastCoord = { x: this.pathLastCoord.x - MOVE, y: this.pathLastCoord.y };
        }
        if (this.arrowPress[1]) {
            this.startDownCoord = { x: this.startDownCoord.x + MOVE, y: this.startDownCoord.y };
            this.pathLastCoord = { x: this.pathLastCoord.x + MOVE, y: this.pathLastCoord.y };
        }
        if (this.arrowPress[2]) {
            this.startDownCoord = { x: this.startDownCoord.x, y: this.startDownCoord.y - MOVE };
            this.pathLastCoord = { x: this.pathLastCoord.x, y: this.pathLastCoord.y - MOVE };
        }
        if (this.arrowPress[3]) {
            this.startDownCoord = { x: this.startDownCoord.x, y: this.startDownCoord.y + MOVE };
            this.pathLastCoord = { x: this.pathLastCoord.x, y: this.pathLastCoord.y + MOVE };
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
        const START_COORDS = { x: mousePosition.x - this.imageData.width / 2, y: mousePosition.y - this.imageData.height / 2 };
        if (this.imageData.width % 2 !== 0 || this.imageData.height % 2 !== 0) {
            if (this.imageData.width % 2 !== 0) {
                START_COORDS.x = mousePosition.x - (this.imageData.width + 1) / 2;
            }
            if (this.imageData.height % 2 !== 0) {
                START_COORDS.y = mousePosition.y - (this.imageData.height + 1) / 2;
            }
        }
        return START_COORDS;
    }

    private showSelectionResize(
        canvas: CanvasRenderingContext2D,
        size: Vec2,
        adjustStartCoords: Vec2,
        adjustOffsetCoords: Vec2,
        mousePosition: Vec2,
        caller: number,
    ): void {
        this.pathLastCoord = mousePosition;
        canvas.save();
        if (caller === 1) {
            // ellipse is calling
            const PATH = this.getPath(0, adjustStartCoords);
            canvas.clip(PATH);
        }
        if (caller === 3) {
            // magic wand is calling
            //const MEMORY_START = this.startDownCoord;
            //this.startDownCoord = adjustStartCoords;
            //const DIFF = mousePosition.x *100 / 1;
            const PATH = this.getPathToClip();
            //this.startDownCoord = MEMORY_START;
            canvas.clip(PATH);
        }
        this.drawImage(canvas, adjustStartCoords, this.startDownCoord, adjustOffsetCoords, this.image, size);
        canvas.restore();
    }

    protected getPath(offset: number, startCoord: Vec2): Path2D {
        const ELLIPSE_PATH = new Path2D();
        const CENTER_X = (this.pathLastCoord.x + startCoord.x) / 2;
        const CENTER_Y = (this.pathLastCoord.y + startCoord.y) / 2;

        const RADIUS_X = Math.abs(this.pathLastCoord.x - startCoord.x) / 2;
        const RADIUS_Y = Math.abs(this.pathLastCoord.y - startCoord.y) / 2;

        const CONTOUR_RADIUS_X = Math.abs(RADIUS_X - 1 / 2);
        const CONTOUR_RADIUS_Y = Math.abs(RADIUS_Y - 1 / 2);
        ELLIPSE_PATH.ellipse(CENTER_X, CENTER_Y, CONTOUR_RADIUS_X + offset, CONTOUR_RADIUS_Y + offset, 0, 0, Math.PI * 2, false);
        return ELLIPSE_PATH;
    }

    protected getPathToClip(): Path2D {
        const magicWandPath = new Path2D();
        if (!(this.pathStartCoordReference === this.startDownCoord)) {
            const coordDiff = {
                x: this.startDownCoord.x - this.pathStartCoordReference.x,
                y: this.startDownCoord.y - this.pathStartCoordReference.y,
            };
            for (const region of this.edgePixelsSplitted) {
                for (const edge of region.edgePixels) {
                    edge.x = edge.x + coordDiff.x;
                    edge.y = edge.y + coordDiff.y;
                }
            }
            this.pathStartCoordReference = this.startDownCoord;
        }
        for (const region of this.edgePixelsSplitted) {
            magicWandPath.moveTo(region.edgePixels[0].x, region.edgePixels[0].y);
            for (const edge of region.edgePixels) {
                magicWandPath.lineTo(edge.x, edge.y);
            }
        }
        return magicWandPath;
    }

    protected getPathToClipResize(): Path2D {
        const magicWandPath = new Path2D();
        if (!(this.pathStartCoordReference === this.startDownCoord)) {
            const coordDiff = {
                x: this.startDownCoord.x - this.pathStartCoordReference.x,
                y: this.startDownCoord.y - this.pathStartCoordReference.y,
            };
            for (const region of this.edgePixelsSplitted) {
                for (const edge of region.edgePixels) {
                    edge.x = edge.x + coordDiff.x;
                    edge.y = edge.y + coordDiff.y;
                }
            }
            this.pathStartCoordReference = this.startDownCoord;
        }
        let edgePixel = this.edgePixelsSplitted;
        for (const region of edgePixel) {
            magicWandPath.moveTo(region.edgePixels[0].x, region.edgePixels[0].y);
            for (const edge of region.edgePixels) {
                magicWandPath.lineTo(edge.x, edge.y);
            }
        }
        return magicWandPath;
    }

    protected getActionTrackingInfo(mousePosition: Vec2): Vec2[] {
        const IMAGE_DATA_START = { x: 0, y: 0 };
        const IMAGE_DATA_END = { x: 0, y: 0 };
        IMAGE_DATA_START.x = this.startSelectionPoint.x < mousePosition.x ? this.startSelectionPoint.x : mousePosition.x;
        IMAGE_DATA_START.y = this.startSelectionPoint.y < mousePosition.y ? this.startSelectionPoint.y : mousePosition.y;
        IMAGE_DATA_END.x =
            this.startSelectionPoint.x > mousePosition.x ? this.startSelectionPoint.x + this.imageData.width : mousePosition.x + this.imageData.width;
        IMAGE_DATA_END.y =
            this.startSelectionPoint.y > mousePosition.y
                ? this.startSelectionPoint.y + this.imageData.height
                : mousePosition.y + this.imageData.height;
        return [IMAGE_DATA_START, IMAGE_DATA_END];
    }

    protected rotateCanvas(angle: number): void {
        const ROTATION = (this.angle * Math.PI) / 180;
        const SIZE = { x: this.imageData.width, y: this.imageData.height };
        const TRANSLATION = { x: this.startDownCoord.x + SIZE.x / 2, y: this.startDownCoord.y + SIZE.y / 2 };
        // rotation
        this.drawingService.baseCtx.translate(TRANSLATION.x, TRANSLATION.y);
        this.drawingService.baseCtx.rotate(ROTATION);
        this.drawingService.previewCtx.translate(TRANSLATION.x, TRANSLATION.y);
        this.drawingService.previewCtx.rotate(ROTATION);
        this.startDownCoord = { x: -SIZE.x / 2, y: -SIZE.y / 2 };
        this.pathLastCoord = { x: SIZE.x / 2, y: SIZE.y / 2 };
    }

    protected resetCanvasRotation(): void {
        this.drawingService.baseCtx.setTransform(1, 0, 0, 1, 0, 0);
        this.drawingService.previewCtx.setTransform(1, 0, 0, 1, 0, 0);
    }
}
