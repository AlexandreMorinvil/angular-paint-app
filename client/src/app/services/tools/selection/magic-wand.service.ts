import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Vec2 } from '@app/classes/vec2';
//import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { SelectionToolService } from '@app/services/tools/selection/selection-tool.service';

@Injectable({
    providedIn: 'root',
})
export class MagicWandService extends SelectionToolService {
    private startR: number;
    private startG: number;
    private startB: number;
    private edgePixels: Vec2[] = [];
    protected image: HTMLImageElement;
    protected oldImage: HTMLImageElement;
    private pathStartCoordReference: Vec2;
    protected firstMagicCoord: Vec2;

    constructor(
        drawingService: DrawingService,
        //private drawingStateTrackingService: DrawingStateTrackerService,
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
        this.drawingService.previewCtx.save();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.localMouseDown = event.button === MouseButton.Left;
        this.resetTransform();

        // translate
        if (this.selectionCreated && this.hitSelection(this.mouseDownCoord.x, this.mouseDownCoord.y)) {
            //this.pathData.push(this.pathLastCoord);
            // Puts back what was under the selection
            if (this.hasDoneFirstTranslation) {
                this.deleteUnderSelection(this.drawingService.baseCtx);

                this.showSelection(
                    this.drawingService.baseCtx,
                    this.oldImage,
                    { x: this.imageData.width, y: this.imageData.height },
                    this.firstMagicCoord,
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
            //this.startDownCoord = this.evenImageStartCoord(this.mouseDownCoord);
            // creation
        } else {
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.oldImage.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.setStartColor();
            let pixelsSelected = this.floodFillSelect(this.mouseDownCoord);
            this.drawRect(pixelsSelected);
            // For the path that will be form the clip
            this.sortEdgeArray();
            this.pathStartCoordReference = this.startDownCoord;
            this.firstMagicCoord = this.startDownCoord;
            // set variables
            this.selectionCreated = true;
            this.hasDoneFirstTranslation = false;
            this.localMouseDown = false;
            //this.pathData.push(this.startDownCoord);
        }
        this.drawingService.previewCtx.restore();
    }
    drawRect(pixelsSelected: Vec2[]) {
        let x_min = pixelsSelected[0].x;
        let x_max = pixelsSelected[0].x;
        let y_min = pixelsSelected[0].y;
        let y_max = pixelsSelected[0].y;
        for (let pixel of pixelsSelected) {
            if (pixel.x < x_min) x_min = pixel.x;
            if (pixel.x > x_max) x_max = pixel.x;
            if (pixel.y < y_min) y_min = pixel.y;
            if (pixel.y > y_max) y_max = pixel.y;
        }

        // Save the rectangle delimited by the same color pixels
        this.startDownCoord = { x: x_min, y: y_min };
        this.imageData = this.drawingService.baseCtx.getImageData(
            this.startDownCoord.x,
            this.startDownCoord.y,
            x_max - this.startDownCoord.x,
            y_max - this.startDownCoord.y,
        );

        // Drawing of the preview rectangle
        this.pathData.push({ x: x_max, y: y_max });
        this.rectangleService.mouseDownCoord = { x: x_min, y: y_min };
        this.rectangleService.drawRectangle(this.drawingService.previewCtx, this.pathData);
        this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
        //this.drawingService.previewCtx.putImageData(this.imageData, this.startDownCoord.x, this.startDownCoord.y);
        //this.showSelection(this.drawingService.previewCtx, this.image, { x: this.imageData.width, y: this.imageData.height }, this.startDownCoord);
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
            //this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.firstMagicCoord = this.startDownCoord;
            this.draggingImage = false;
            this.hasDoneFirstTranslation = true;
        }
        
        this.localMouseDown = false;
        this.clearPath();
    }

    private resetTransform(): void {
        this.widthService.setWidth(1);
        this.colorService.setPrimaryColor('#000000');
        this.colorService.setSecondaryColor('#000000');
        this.tracingService.setHasFill(false);
        this.tracingService.setHasContour(true);
    }

    private floodFillSelect(pixelClicked: Vec2): Vec2[] {
        // tslint:disable:no-non-null-assertion
        this.edgePixels = [];
        let pixelSelected: Vec2[] = [];
        let pixelStack: Vec2[] = [];
        //let pixelPos: Vec2 = {x: 0,y:0};
        pixelStack.push(pixelClicked);
        while (pixelStack.length) {
            let pixelPos = pixelStack.pop() as Vec2;
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
                if (this.isEdgePixel({ x: pixelPos.x, y: pixelPos.y })) this.edgePixels.push({ x: pixelPos.x, y: pixelPos.y });

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
    sortEdgeArray() {
        let foundSomething;
        let newArray: Vec2[] = [this.edgePixels[0]];
        this.edgePixels.splice(0, 1);
        for (let i = 0; i < newArray.length; i++) {
            foundSomething = false;
            for (let j = 0; j < this.edgePixels.length; j++) {
                if (
                    ((newArray[i].x - this.edgePixels[j].x === 1 || newArray[i].x - this.edgePixels[j].x === -1) &&
                        newArray[i].y - this.edgePixels[j].y === 0) ||
                    ((newArray[i].y - this.edgePixels[j].y === 1 || newArray[i].y - this.edgePixels[j].y === -1) &&
                        newArray[i].x - this.edgePixels[j].x === 0)
                ) {
                    newArray.push(this.edgePixels[j]);
                    this.edgePixels.splice(j, 1);
                    foundSomething = true;
                    break;
                }
            }
            console.log(foundSomething);
        }
        console.log(this.edgePixels);
        this.edgePixels = newArray;
    }

    isNotSelected(pixelsSelected: Vec2[], pixelPos: Vec2) {
        for (let pixel of pixelsSelected) {
            if (pixelPos.x === pixel.x && pixelPos.y === pixel.y) {
                return false;
            }
        }
        return true;
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
        let data = this.drawingService.baseCtx.getImageData(pixel.x - 1, pixel.y - 1, 3, 3).data;

        for (let i = 0; i < data.length; i += 4) {
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
        let magicWandPath = new Path2D();
        //magicWandPath.moveTo(this.edgePixels[0].x, this.edgePixels[0].y)
        if (!(this.pathStartCoordReference === this.startDownCoord)) {
            let coordDiff = { x: this.startDownCoord.x - this.pathStartCoordReference.x, y: this.startDownCoord.y - this.pathStartCoordReference.y };
            for (let edge of this.edgePixels) {
                edge.x = edge.x + coordDiff.x;
                edge.y = edge.y + coordDiff.y;
            }
            this.pathStartCoordReference = this.startDownCoord;
        }

        for (let edge of this.edgePixels) {
            magicWandPath.lineTo(edge.x, edge.y);
        }
        console.log(this.edgePixels);
        return magicWandPath;
    }
}
