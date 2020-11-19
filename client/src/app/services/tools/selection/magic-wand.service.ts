import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Vec2 } from '@app/classes/vec2';
// import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { SelectionToolService } from '@app/services/tools/selection/selection-tool.service';

class edgePixelsOneRegion {
    public edgePixels: Vec2[] = [];
}
@Injectable({
    providedIn: 'root',
})
export class MagicWandService extends SelectionToolService {
    private startR: number;
    private startG: number;
    private startB: number;
    private edgePixelsAllRegionSplitted: edgePixelsOneRegion[] = [];
    private edgePixelsAllRegion: Vec2[] = [];
    protected image: HTMLImageElement;
    protected oldImage: HTMLImageElement;
    private pathStartCoordReference: Vec2;
    protected firstMagicCoord: Vec2;

    constructor(
        drawingService: DrawingService,
        // private drawingStateTrackingService: DrawingStateTrackerService,
        private rectangleService: RectangleService,
        private tracingService: TracingService,
        private widthService: WidthService,
        private colorService: ColorService,
    ) {
        super(drawingService, colorService, new Description('Baguette magique', 'v', 'magic-wand.png'));
        this.image = new Image();
        this.oldImage = new Image();
    }

    onMouseDown(event: MouseEvent): void {
        /*
this.arrowPress = [false, false, false, false];
this.arrowDown = false;
*/
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.localMouseDown = event.button === MouseButton.Left;
        this.resetTransform();

        // translate
        if (this.selectionCreated && this.hitSelection(this.mouseDownCoord.x, this.mouseDownCoord.y)) {
            // this.pathData.push(this.pathLastCoord);
            // Puts back what was under the selection
            if (this.hasDoneFirstTranslation) {
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
            // this.startDownCoord = this.evenImageStartCoord(this.mouseDownCoord);
            // creation with neighbour pixels only
        } else {
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.oldImage.src = this.drawingService.baseCtx.canvas.toDataURL();
            let pixelsSelected: Vec2[];
            this.setStartColor();

            if (event.button === MouseButton.Left) pixelsSelected = this.floodFillSelect(this.mouseDownCoord);
            else pixelsSelected = this.sameColorSelect();

            this.drawRect(pixelsSelected);

            // For the path that will be form the clip
            this.pathStartCoordReference = this.startDownCoord;

            // set variables
            this.firstMagicCoord = this.startDownCoord;
            this.selectionCreated = true;
            this.hasDoneFirstTranslation = false;
            this.localMouseDown = false;
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
        }
    }

    onMouseUp(event: MouseEvent): void {
        // translate
        if (this.draggingImage) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            // saves what was under the selection

            this.oldImage.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.showSelection(this.drawingService.baseCtx, this.image, { x: this.imageData.width, y: this.imageData.height }, this.firstMagicCoord);

            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.rect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
            this.drawingService.previewCtx.stroke();
            this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
            this.drawSelectionCoutour();
            this.draggingImage = false;
            this.hasDoneFirstTranslation = true;
        }

        this.localMouseDown = false;
        this.clearPath();
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
        console.log(xMin);
        console.log(xMax);
        console.log(yMin);
        console.log(yMax);

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
        this.rectangleService.drawRectangle(this.drawingService.previewCtx, this.pathData);
        this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);

        this.splitAndSortEdgeArray();
        console.log(this.edgePixelsAllRegionSplitted[0]);
        this.drawSelectionCoutour();

        // this.drawingService.previewCtx.putImageData(this.imageData, this.startDownCoord.x, this.startDownCoord.y);
        // this.showSelection(this.drawingService.previewCtx, this.image, { x: this.imageData.width, y: this.imageData.height }, this.startDownCoord);
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
        // We only use one region for this selection
        this.edgePixelsAllRegion = [];
        const pixelSelected: Vec2[] = [];
        const pixelStack: Vec2[] = [];
        // let pixelPos: Vec2 = {x: 0,y:0};
        pixelStack.push(pixelClicked);
        while (pixelStack.length) {
            const pixelPos = pixelStack.pop() as Vec2;
            const xPosition = pixelPos.x;
            let yPosition = pixelPos.y;
            // Get current pixel position
            // Go up as long as the color matches and are inside the canvas
            // tslint:disable-next-line:no-magic-numbers
            while (yPosition-- > -1 && this.matchStartColor(pixelPos) && this.isNotSelected(pixelSelected, pixelPos)) {
                pixelPos.y -= 1;
            }
            pixelPos.y += 1;
            ++yPosition;

            let reachLeft = false;
            let reachRight = false;

            while (
                yPosition++ <= this.drawingService.baseCtx.canvas.height - 2 &&
                this.matchStartColor(pixelPos) &&
                this.isNotSelected(pixelSelected, pixelPos)
            ) {
                pixelSelected.push({ x: pixelPos.x, y: pixelPos.y } as Vec2);
                if (this.isEdgePixel({ x: pixelPos.x, y: pixelPos.y })) this.edgePixelsAllRegion.push({ x: pixelPos.x, y: pixelPos.y });

                if (xPosition > 0) {
                    if (
                        this.matchStartColor({ x: pixelPos.x - 1, y: pixelPos.y }) &&
                        this.isNotSelected(pixelSelected, { x: pixelPos.x - 1, y: pixelPos.y })
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
                        this.isNotSelected(pixelSelected, { x: pixelPos.x + 1, y: pixelPos.y })
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
        return pixelSelected;
    }

    private sameColorSelect(): Vec2[] {
        const pixelSelected: Vec2[] = [];
        let pixelPos: Vec2 = { x: 0, y: 0 };
        while (pixelPos.y < this.drawingService.baseCtx.canvas.height) {
            while (pixelPos.x < this.drawingService.baseCtx.canvas.width) {
                if (this.matchStartColor(pixelPos)) {
                    pixelSelected.push({ x: pixelPos.x, y: pixelPos.y });
                    if (this.isEdgePixel(pixelPos)) this.edgePixelsAllRegion.push({ x: pixelPos.x, y: pixelPos.y });
                }
                pixelPos.x++;
            }
            pixelPos.y++;
            pixelPos.x = 0;
        }
        return pixelSelected;
    }
    splitAndSortEdgeArray(): void {
        let regionIndex: number = -1;
        while ((this.edgePixelsAllRegion.length, regionIndex++)) {
            const newRegion: Vec2[] = [this.edgePixelsAllRegion[0]];
            this.edgePixelsAllRegion.splice(0, 1);
            for (const value of newRegion) {
                for (let j = 0; j < this.edgePixelsAllRegion.length; j++) {
                    if (
                        ((value.x - this.edgePixelsAllRegion[j].x === 1 || value.x - this.edgePixelsAllRegion[j].x === -1) &&
                            value.y - this.edgePixelsAllRegion[j].y === 0) ||
                        ((value.y - this.edgePixelsAllRegion[j].y === 1 || value.y - this.edgePixelsAllRegion[j].y === -1) &&
                            value.x - this.edgePixelsAllRegion[j].x === 0)
                    ) {
                        newRegion.push(this.edgePixelsAllRegion[j]);
                        this.edgePixelsAllRegion.splice(j, 1);
                        break;
                    }
                }
            }
            if (!(newRegion.length === 0)) {
                this.edgePixelsAllRegionSplitted.push({ edgePixels: [] });
                this.edgePixelsAllRegionSplitted[regionIndex].edgePixels = newRegion;
            }
        }
    }
    isNotSelected(pixelsSelected: Vec2[], pixelPos: Vec2): boolean {
        for (const pixel of pixelsSelected) {
            if (pixelPos.x === pixel.x && pixelPos.y === pixel.y) {
                return false;
            }
        }
        return true;
    }
    private drawSelectionCoutour(): void {
        this.drawingService.previewCtx.strokeStyle = '#777777';
        this.drawingService.previewCtx.lineWidth = 2;
        // tslint:disable-next-line:no-magic-numbers
        this.drawingService.previewCtx.setLineDash([8, 4]);
        for (let region of this.edgePixelsAllRegionSplitted) {
            this.drawingService.previewCtx.beginPath();
            for (const edge of region.edgePixels) {
                this.drawingService.previewCtx.lineTo(edge.x, edge.y);
            }
            this.drawingService.previewCtx.stroke();
        }
        this.drawingService.previewCtx.lineWidth = 1;
        this.drawingService.previewCtx.setLineDash([]);
    }

    private matchStartColor(pixelPos: Vec2): boolean {
        const imageData: ImageData = this.drawingService.baseCtx.getImageData(pixelPos.x, pixelPos.y, 1, 1);
        return imageData.data[0] === this.startR && imageData.data[1] === this.startG && imageData.data[2] === this.startB;
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
    private showSelection(canvas: CanvasRenderingContext2D, image: HTMLImageElement, size: Vec2, imageStart: Vec2, offset: number = 0): void {
        canvas.save();
        const path = this.getPath();
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
        const path = this.getPath();
        canvas.clip(path);
        canvas.clearRect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
        canvas.restore();
    }
    private getPath(): Path2D {
        const magicWandPath = new Path2D();
        // magicWandPath.moveTo(this.edgePixels[0].x, this.edgePixels[0].y)
        if (!(this.pathStartCoordReference === this.startDownCoord)) {
            const coordDiff = {
                x: this.startDownCoord.x - this.pathStartCoordReference.x,
                y: this.startDownCoord.y - this.pathStartCoordReference.y,
            };
            for (const region of this.edgePixelsAllRegionSplitted) {
                for (const edge of region.edgePixels) {
                    edge.x = edge.x + coordDiff.x;
                    edge.y = edge.y + coordDiff.y;
                }
            }
            this.pathStartCoordReference = this.startDownCoord;
        }
        for (const region of this.edgePixelsAllRegionSplitted) {
            magicWandPath.moveTo(region.edgePixels[0].x, region.edgePixels[0].y);
            for (const edge of region.edgePixels) {
                magicWandPath.lineTo(edge.x, edge.y);
            }
        }
        return magicWandPath;
    }
}
