import { Injectable } from '@angular/core';
import { InteractionSelectionEllipse } from '@app/classes/action/interaction-selection-ellipse';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Vec2 } from '@app/classes/vec2';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { SelectionToolService } from '@app/services/tools/selection/selection-tool.service';
import { EdgePixelsOneRegion } from './edge-pixel';
@Injectable({
    providedIn: 'root',
})
export class MagicWandService extends SelectionToolService {
    private startR: number;
    private startG: number;
    private startB: number;
    private edgePixelsSplitted: EdgePixelsOneRegion[] = [];
    private edgePixelsAllRegions: Vec2[] = [];
    protected image: HTMLImageElement;
    protected oldImage: HTMLImageElement;
    private pathStartCoordReference: Vec2;
    protected firstMagicCoord: Vec2;
    protected pathLastCoord: Vec2;
    private canvasData: Uint8ClampedArray;

    constructor(
        drawingService: DrawingService,
        private drawingStateTrackingService: DrawingStateTrackerService,
        private rectangleService: RectangleService,
        private tracingService: TracingService,
        private widthService: WidthService,
        private colorService: ColorService,
    ) {
        super(drawingService, colorService, new Description('Baguette magique', 'v', 'magic-wand.png'));
        this.image = new Image();
        this.oldImage = new Image();
        this.arrowPress = [false, false, false, false];
        this.arrowDown = false;
    }

    onMouseDown(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.localMouseDown = event.button === MouseButton.Left;
        this.resetTransform();

        // translate
        if (this.selectionCreated && this.hitSelection(this.mouseDownCoord.x, this.mouseDownCoord.y)) {
            // Puts back what was under the selection
            if (this.hasDoneFirstTranslation) {
                this.startSelectionPoint = this.startDownCoord;
                this.deleteUnderSelection(this.drawingService.baseCtx);

                this.showSelection(
                    this.drawingService.baseCtx,
                    this.oldImage,
                    { x: this.imageData.width, y: this.imageData.height },
                    this.startDownCoord,
                );
            }

            // Puts a space on selection original placement
            else {
                this.deleteUnderSelection(this.drawingService.baseCtx);
            }
            // draw selection on preview
            this.showSelection(
                this.drawingService.previewCtx,
                this.image,
                { x: this.imageData.width, y: this.imageData.height },
                this.firstMagicCoord,
            );
            // set variables
            this.draggingImage = true;
            this.mouseDown = true;
        } else {
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.oldImage.src = this.drawingService.baseCtx.canvas.toDataURL();
            let pixelsSelected: Vec2[];
            this.setStartColor();
            this.edgePixelsAllRegions = [];
            this.edgePixelsSplitted = [];
            this.scanCanvas();

            if (event.button === MouseButton.Left) pixelsSelected = this.floodFillSelect(this.mouseDownCoord);
            else pixelsSelected = this.sameColorSelect();

            this.drawRect(pixelsSelected);
            this.getImageRotation();
            // For the path that will be form the clip
            this.pathStartCoordReference = this.startDownCoord;

            // set variables
            this.firstMagicCoord = this.startDownCoord;
            this.selectionCreated = true;
            this.hasDoneFirstTranslation = false;
            this.localMouseDown = false;
            this.pathLastCoord = this.pathData[this.pathData.length - 1];
            this.startSelectionPoint = this.startDownCoord;
        }
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);

        // translate
        if (this.draggingImage && this.localMouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            this.showSelection(
                this.drawingService.previewCtx,
                this.image,
                { x: this.imageData.width, y: this.imageData.height },
                this.firstMagicCoord,
            );
            this.startDownCoord = this.evenImageStartCoord(mousePosition);
            this.pathLastCoord = { x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y + this.imageData.height };
        }
    }

    onMouseUp(): void {
        // translate
        if (this.draggingImage) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            // saves what was under the selection

            this.oldImage.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.getImageRotation();
            this.showSelection(this.drawingService.baseCtx, this.image, { x: this.imageData.width, y: this.imageData.height }, this.firstMagicCoord);
            this.addActionTracking();
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.rect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
            this.drawingService.previewCtx.stroke();
            this.drawnAnchor(this.drawingService.previewCtx);
            this.drawSelectionCoutour();
            this.draggingImage = false;
            this.hasDoneFirstTranslation = true;
        }

        this.localMouseDown = false;
        this.clearPath();
    }

    // tslint:disable:no-magic-numbers
    onMouseWheel(event: WheelEvent): void {
        // setting up variable/const
        if (this.selectionCreated) {
            const SIZE = { x: this.imageData.width, y: this.imageData.height };
            const TRANSLATION = { x: this.startDownCoord.x + SIZE.x / 2, y: this.startDownCoord.y + SIZE.y / 2 };
            const MEMORY_COORDS = this.startDownCoord;
            const ORIENTATION = event.deltaY / 100;

            // clearing old spot
            const MAX_SIDE = Math.hypot(SIZE.x, SIZE.y);
            this.putImageData({ x: TRANSLATION.x - MAX_SIDE / 2, y: TRANSLATION.y - MAX_SIDE / 2 }, this.drawingService.baseCtx, this.oldImageData);
            /*if (!this.hasDoneFirstTranslation || this.hasDoneResizing) {
                this.ellipseService.mouseDownCoord = this.firstEllipseCoord;
                this.pathLastCoord = { x: MEMORY_COORDS.x + SIZE.x, y: MEMORY_COORDS.y + SIZE.y };
                this.pathData.push(this.pathLastCoord);
                this.clearCanvasEllipse();
                this.clearPath();
            }*/
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            // calculate desire angle for canvas rotation
            let angleVoulue = 0;
            if (event.altKey) {
                angleVoulue = 1;
            } else {
                angleVoulue = 15;
            }
            this.angle += ORIENTATION * angleVoulue;
            this.rotateCanvas(this.angle);
            this.startDownCoord = { x: -SIZE.x / 2, y: -SIZE.y / 2 };
            this.showSelection(this.drawingService.baseCtx, this.image, SIZE, this.firstMagicCoord);

            // reset canvas transform after rotation
            this.resetCanvasRotation();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            // draw selection preview
            this.startDownCoord = { x: TRANSLATION.x - MAX_SIDE / 2, y: TRANSLATION.y - MAX_SIDE / 2 };
            this.pathLastCoord = { x: this.startDownCoord.x + MAX_SIDE, y: this.startDownCoord.y + MAX_SIDE };
            this.pathData.push(this.pathLastCoord);
            // this.ellipseService.mouseDownCoord = this.startDownCoord;
            // this.ellipseService.drawEllipse(this.drawingService.previewCtx, this.pathData);
            // this.ellipseService.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
            this.drawnAnchor(this.drawingService.previewCtx, { x: MAX_SIDE, y: MAX_SIDE });
            this.clearPath();
            this.startDownCoord = MEMORY_COORDS;
            this.hasDoneFirstRotation = true;
        }
    }

    private drawRect(pixelsSelected: Vec2[]): void {
        let xMin = pixelsSelected[0].x;
        let xMax = pixelsSelected[0].x;
        let yMin = pixelsSelected[0].y;
        let yMax = pixelsSelected[0].y;
        for (const pixel of pixelsSelected) {
            if (pixel.x < xMin) xMin = pixel.x;
            if (pixel.x > xMax) xMax = pixel.x;
            if (pixel.y < yMin) yMin = pixel.y;
            if (pixel.y > yMax) yMax = pixel.y;
        }

        // Save the rectangle delimited by the same color pixels
        this.startDownCoord = { x: xMin, y: yMin };
        this.imageData = this.drawingService.baseCtx.getImageData(
            this.startDownCoord.x,
            this.startDownCoord.y,
            xMax - this.startDownCoord.x,
            yMax - this.startDownCoord.y,
        );

        // Drawing of the preview rectangle and the selection contour

        this.pathData.push({ x: xMax, y: yMax });
        this.rectangleService.mouseDownCoord = { x: xMin, y: yMin };
        this.rectangleService.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
        this.drawnAnchor(this.drawingService.previewCtx);

        this.splitAndSortEdgeArray();
        this.drawSelectionCoutour();
    }

    private resetTransform(): void {
        this.widthService.setWidth(1);
        this.colorService.setPrimaryColor('#000000');
        this.colorService.setSecondaryColor('#000000');
        this.tracingService.setHasFill(false);
        this.tracingService.setHasContour(true);
    }

    // tslint:disable:cyclomatic-complexity
    private floodFillSelect(pixelClicked: Vec2): Vec2[] {
        this.edgePixelsAllRegions = [];
        const pixelsSelectedCoord: Vec2[] = [];
        const pixelStack: Vec2[] = [];
        const pixelsSelectedValidation: boolean[] = [];
        pixelsSelectedValidation.fill(false, 0, this.drawingService.baseCtx.canvas.width * (this.drawingService.baseCtx.canvas.height - 2));
        pixelStack.push(pixelClicked);
        while (pixelStack.length) {
            const pixelPos = pixelStack.pop() as Vec2;
            const xPosition = pixelPos.x;
            let yPosition = pixelPos.y;
            // Get current pixel position
            // Go up as long as the color matches and are inside the canvas
            // tslint:disable-next-line:no-magic-numbers
            while (yPosition-- > -1 && this.matchStartColor(pixelPos) && !this.isSelected(pixelsSelectedValidation, pixelPos)) {
                pixelPos.y -= 1;
            }
            pixelPos.y += 1;
            ++yPosition;

            let reachLeft = false;
            let reachRight = false;

            while (
                yPosition++ <= this.drawingService.baseCtx.canvas.height - 2 &&
                this.matchStartColor(pixelPos) &&
                !this.isSelected(pixelsSelectedValidation, pixelPos)
            ) {
                pixelsSelectedCoord.push({ x: pixelPos.x, y: pixelPos.y } as Vec2);
                pixelsSelectedValidation[pixelPos.y * this.drawingService.baseCtx.canvas.width + pixelPos.x] = true;
                if (this.isEdgePixel({ x: pixelPos.x, y: pixelPos.y })) this.edgePixelsAllRegions.push({ x: pixelPos.x, y: pixelPos.y });

                if (xPosition > 0) {
                    if (
                        this.matchStartColor({ x: pixelPos.x - 1, y: pixelPos.y }) &&
                        !this.isSelected(pixelsSelectedValidation, { x: pixelPos.x - 1, y: pixelPos.y })
                    ) {
                        if (!reachLeft) {
                            pixelStack.push({ x: xPosition - 1, y: yPosition });
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }
                if (xPosition < this.drawingService.baseCtx.canvas.width) {
                    if (
                        this.matchStartColor({ x: pixelPos.x + 1, y: pixelPos.y }) &&
                        !this.isSelected(pixelsSelectedValidation, { x: pixelPos.x + 1, y: pixelPos.y })
                    ) {
                        if (!reachRight) {
                            pixelStack.push({ x: xPosition + 1, y: yPosition });
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                    pixelPos.y += 1;
                }
            }
        }
        return pixelsSelectedCoord;
    }

    private sameColorSelect(): Vec2[] {
        const pixelSelected: Vec2[] = [];
        const pixelPos: Vec2 = { x: 0, y: 0 };
        while (pixelPos.y < this.drawingService.baseCtx.canvas.height) {
            while (pixelPos.x < this.drawingService.baseCtx.canvas.width) {
                if (this.matchStartColor(pixelPos)) {
                    pixelSelected.push({ x: pixelPos.x, y: pixelPos.y });
                    if (this.isEdgePixel(pixelPos)) this.edgePixelsAllRegions.push({ x: pixelPos.x, y: pixelPos.y });
                }
                pixelPos.x++;
            }
            pixelPos.y++;
            pixelPos.x = 0;
        }
        return pixelSelected;
    }

    splitAndSortEdgeArray(): void {
        const distanceBetweenEdgePixels = 1;
        let regionIndex = -1;
        while (this.edgePixelsAllRegions.length) {
            regionIndex++;
            const newRegion: Vec2[] = [this.edgePixelsAllRegions[0]];
            this.edgePixelsAllRegions.splice(0, 1);
            for (const value of newRegion) {
                for (let j = 0; j < this.edgePixelsAllRegions.length; j++) {
                    if (
                        ((value.x - this.edgePixelsAllRegions[j].x === distanceBetweenEdgePixels ||
                            value.x - this.edgePixelsAllRegions[j].x === -distanceBetweenEdgePixels) &&
                            value.y - this.edgePixelsAllRegions[j].y === 0) ||
                        ((value.y - this.edgePixelsAllRegions[j].y === distanceBetweenEdgePixels ||
                            value.y - this.edgePixelsAllRegions[j].y === -distanceBetweenEdgePixels) &&
                            value.x - this.edgePixelsAllRegions[j].x === 0)
                    ) {
                        newRegion.push(this.edgePixelsAllRegions[j]);
                        this.edgePixelsAllRegions.splice(j, 1);
                        break;
                    }
                }
            }
            // Prevents unlinked edge pixel to form regions
            if (!(newRegion.length === 1)) {
                this.edgePixelsSplitted.push({ edgePixels: [] });
                this.edgePixelsSplitted[regionIndex].edgePixels = newRegion;
            } else {
                regionIndex--;
            }
        }
    }

    private drawSelectionCoutour(): void {
        this.drawingService.previewCtx.strokeStyle = '#777777';
        this.drawingService.previewCtx.lineWidth = 2;
        // tslint:disable-next-line:no-magic-numbers
        this.drawingService.previewCtx.setLineDash([8, 4]);
        for (const region of this.edgePixelsSplitted) {
            this.drawingService.previewCtx.beginPath();
            for (const edge of region.edgePixels) {
                this.drawingService.previewCtx.lineTo(edge.x, edge.y);
            }
            this.drawingService.previewCtx.stroke();
        }
        this.drawingService.previewCtx.lineWidth = 1;
        this.drawingService.previewCtx.setLineDash([]);
    }

    private scanCanvas(): void {
        this.canvasData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.drawingService.baseCtx.canvas.width,
            this.drawingService.baseCtx.canvas.height - 2,
        ).data;
    }

    private matchStartColor(pixelPos: Vec2): boolean {
        const stepSize = 4;
        return (
            this.canvasData[stepSize * (pixelPos.y * this.drawingService.baseCtx.canvas.width + pixelPos.x)] === this.startR &&
            this.canvasData[stepSize * (pixelPos.y * this.drawingService.baseCtx.canvas.width + pixelPos.x) + 1] === this.startG &&
            this.canvasData[stepSize * (pixelPos.y * this.drawingService.baseCtx.canvas.width + pixelPos.x) + 2] === this.startB
        );
    }

    private isSelected(pixelsSelected: boolean[], pixelPos: Vec2): boolean {
        return pixelsSelected[pixelPos.y * this.drawingService.baseCtx.canvas.width + pixelPos.x];
    }

    private setStartColor(): void {
        // get the pixel on the first Path of mouse
        const imageData: ImageData = this.drawingService.baseCtx.getImageData(this.mouseDownCoord.x, this.mouseDownCoord.y, 1, 1);
        this.startR = imageData.data[0];
        this.startG = imageData.data[1];
        this.startB = imageData.data[2];
    }

    private isEdgePixel(pixel: Vec2): boolean {
        const distanceToCheck = 3;
        const stepBetweenPixel = 4;
        const data = this.drawingService.baseCtx.getImageData(pixel.x - 1, pixel.y - 1, distanceToCheck, distanceToCheck).data;

        for (let i = 0; i < data.length; i += stepBetweenPixel) {
            if (!(data[i] === this.startR) || !(data[i + 1] === this.startG) || !(data[i + 2] === this.startB)) return true;
        }
        return false;
    }

    private showSelection(canvas: CanvasRenderingContext2D, image: HTMLImageElement, size: Vec2, imageStart: Vec2): void {
        canvas.save();
        const path = this.getPathToClip();
        canvas.clip(path);

        this.drawImage(
            canvas,
            this.startDownCoord,
            imageStart,
            {
                x: this.imageData.width,
                y: this.imageData.height,
            },
            image,
            size,
        );
        canvas.restore();
    }

    private deleteUnderSelection(canvas: CanvasRenderingContext2D): void {
        canvas.save();
        const path = this.getPathToClip();
        canvas.clip(path);
        canvas.fillStyle = '#FFFFFF';
        canvas.fillRect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
        canvas.restore();
    }

    private getPathToClip(): Path2D {
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

    private getImageRotation(): void {
        const MAX_SIDE = Math.hypot(this.imageData.width, this.imageData.height);
        this.oldImageData = this.drawingService.baseCtx.getImageData(
            this.startDownCoord.x + this.imageData.width / 2 - MAX_SIDE / 2,
            this.startDownCoord.y + this.imageData.height / 2 - MAX_SIDE / 2,
            MAX_SIDE,
            MAX_SIDE,
        );
    }

    onArrowDown(event: KeyboardEvent): void {
        if (!this.arrowDown) {
            this.arrowCoord = { x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y + this.imageData.height };
            if (this.hasDoneFirstTranslation) {
                this.deleteUnderSelection(this.drawingService.baseCtx);
                this.showSelection(
                    this.drawingService.baseCtx,
                    this.oldImage,
                    { x: this.imageData.width, y: this.imageData.height },
                    this.startDownCoord,
                );
            }
            // Puts a white rectangle on selection original placement
            else {
                this.deleteUnderSelection(this.drawingService.baseCtx);
            }
            this.startSelectionPoint = { x: this.startDownCoord.x, y: this.startDownCoord.y };
        }
        if (this.selectionCreated) {
            this.checkArrowHit(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.showSelection(
                this.drawingService.previewCtx,
                this.image,
                { x: this.imageData.width, y: this.imageData.height },
                this.firstMagicCoord,
            );
            this.draggingImage = false;
        }
    }

    onArrowUp(event: KeyboardEvent): void {
        if (this.selectionCreated) {
            this.checkArrowUnhit(event);
            if (this.arrowPress.every((v) => v === false)) {
                this.arrowDown = false;
                this.draggingImage = true;
                this.clearPath();
                this.pathData.push(this.pathLastCoord);
                this.clearPath();
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.onMouseUp();
                this.draggingImage = false;
                this.hasDoneFirstTranslation = true;
            }
        }
    }

    private addActionTracking(): void {
        const imageDataStart: Vec2 = { x: 0, y: 0 };
        const imageDataEnd: Vec2 = { x: 0, y: 0 };
        imageDataStart.x = this.startSelectionPoint.x < this.startDownCoord.x ? this.startSelectionPoint.x : this.startDownCoord.x;
        imageDataStart.y = this.startSelectionPoint.y < this.startDownCoord.y ? this.startSelectionPoint.y : this.startDownCoord.y;
        imageDataEnd.x =
            this.startSelectionPoint.x > this.startDownCoord.x
                ? this.startSelectionPoint.x + this.imageData.width
                : this.startDownCoord.x + this.imageData.width;
        imageDataEnd.y =
            this.startSelectionPoint.y > this.startDownCoord.y
                ? this.startSelectionPoint.y + this.imageData.height
                : this.startDownCoord.y + this.imageData.height;

        const imageDataSelection: ImageData = this.drawingService.baseCtx.getImageData(
            imageDataStart.x,
            imageDataStart.y,
            imageDataEnd.x - imageDataStart.x,
            imageDataEnd.y - imageDataStart.y,
        );

        this.drawingStateTrackingService.addAction(
            this,
            new InteractionSelectionEllipse({ x: imageDataStart.x, y: imageDataStart.y }, imageDataSelection),
        );
    }

    execute(interaction: InteractionSelectionEllipse): void {
        this.putImageData(interaction.startSelectionPoint, this.drawingService.baseCtx, interaction.selection);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}

// tslint:disable:max-file-line-count
