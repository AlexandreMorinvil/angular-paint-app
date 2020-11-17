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
/*
class Direction {
  Left: Vec2 = { x: -1, y: 0 };
  BottomLeft: Vec2 = { x: -1, y: 1 };
  Bottom: Vec2 = { x: 0, y: 1 };
  BottomRight: Vec2 = { x: 1, y: 1 };
  Right: Vec2 = { x: 1, y: 0 };
  UpperRight: Vec2 = { x: 1, y: -1 };
  Up: Vec2 = { x: 0, y: -1 };
  UpperLeft: Vec2 = { x: -1, y: 0 };
  public directionList: Vec2[] = [this.Left, this.BottomLeft, this.Bottom, this.BottomRight, this.Right, this.UpperRight, this.Up, this.UpperLeft];
}
*/
@Injectable({
    providedIn: 'root',
})
export class MagicWandService extends SelectionToolService {
    //private direction: Direction;
    private startR: number;
    private startG: number;
    private startB: number;

    constructor(
        drawingService: DrawingService,
        //private drawingStateTrackingService: DrawingStateTrackerService,
        private rectangleService: RectangleService,
        private tracingService: TracingService,
        private widthService: WidthService,
        private colorService: ColorService,
    ) {
        super(drawingService, colorService, new Description('Baguette magique', 'v', 'magic-wand.png'));
        //this.direction = new Direction;
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.mouseDown) {
            this.selectionCreated = false;
        }
        this.arrowPress = [false, false, false, false];
        this.arrowDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.localMouseDown = event.button === MouseButton.Left;
        this.resetTransform();
        // translate
        if (this.selectionCreated && this.hitSelection(this.mouseDownCoord.x, this.mouseDownCoord.y)) {
            this.pathData.push(this.pathLastCoord);
            // Puts back what was under the selection
            if (this.hasDoneFirstTranslation) {
                this.putImageData(this.startDownCoord, this.drawingService.baseCtx, this.oldImageData);
                this.startSelectionPoint = this.startDownCoord;
            }
            // Puts a white rectangle on selection original placement
            else {
                this.drawingService.baseCtx.clearRect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
            }
            this.draggingImage = true;
            this.mouseDown = true;
            this.putImageData(this.evenImageStartCoord(this.mouseDownCoord), this.drawingService.previewCtx, this.imageData);
            // creation
        } else {
            /*
      this.imageData = new ImageData(1, 1);
      this.startDownCoord = this.getPositionFromMouse(event);
      this.rectangleService.onMouseDown(event);
      this.pathData.push(this.startDownCoord);
      this.startSelectionPoint = this.getPositionFromMouse(event);
      this.mouseDown = true;
      */
            this.setStartColor();
            let pixelsSelected = this.floodFillSelect(this.mouseDownCoord);
            console.log(pixelsSelected);
        }
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        // translate
        if (this.draggingImage && this.localMouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.startDownCoord = this.evenImageStartCoord(mousePosition);
            this.putImageData(this.evenImageStartCoord(mousePosition), this.drawingService.previewCtx, this.imageData);
            // creation
        } /*else if (this.isInCanvas(mousePosition) && this.localMouseDown) {
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
        }*/
    }

    onMouseUp(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        // translate
        if (this.draggingImage) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            // saves what was under the selection
            //const savedOldImageData = this.oldImageData;
            this.oldImageData = this.getOldImageData(mousePosition);
            this.putImageData(this.evenImageStartCoord(mousePosition), this.drawingService.baseCtx, this.imageData);
            /*
this.drawingStateTrackingService.addAction(
  this,
  new InteractionSelection(
    this.hasDoneFirstTranslation,
    this.startSelectionPoint,
    this.startDownCoord,
    this.imageData,
    savedOldImageData,
  ),
);
*/
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.rect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
            this.drawingService.previewCtx.stroke();
            this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
            this.draggingImage = false;
            this.hasDoneFirstTranslation = true;
            // creation
        } else if (this.localMouseDown) {
            this.pathData.push(mousePosition);

            // saves what was under the selection
            this.oldImageData = this.drawingService.baseCtx.getImageData(
                this.startDownCoord.x,
                this.startDownCoord.y,
                this.imageData.width,
                this.imageData.height,
            );

            this.rectangleService.drawRectangle(this.drawingService.previewCtx, this.pathData);
            this.offsetAnchors(this.startDownCoord);
            this.drawingService.previewCtx.putImageData(this.imageData, this.startDownCoord.x, this.startDownCoord.y);
            this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
            this.selectionCreated = true;
            this.pathLastCoord = this.pathData[this.pathData.length - 1];
            this.hasDoneFirstTranslation = false;
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

    isNotSelected(pixelsSelected: Vec2[], pixelPos: Vec2) {
        for (let pixel of pixelsSelected) {
            if (pixelPos.x === pixel.x && pixelPos.y === pixel.y) {
                return false;
            }
        }
        return true;
    }
    isInPath(pixelInspected: Vec2, pathPixel: Vec2[]): boolean {
        for (let pixel of pathPixel) {
            if (pixelInspected.x === pixel.x && pixelInspected.y === pixel.y) return true;
        }
        return false;
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
    /*
    private isEdgePixel(pixel: Vec2): boolean {
      let pixelInspected: Vec2;
      for (let direction of this.direction.directionList) {
        pixelInspected = { x: pixel.x + direction.x, y: pixel.y + direction.y };
        if (!this.matchStartColor(pixelInspected)) return true;
      }
      return false;
    }
  */
}
