import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { RectangleService } from '@app/services/tools/rectangle/rectangle-service';
import { SelectionToolService } from '@app/services/tools/selection/selection-tool.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionService extends SelectionToolService {
    mouseDownCoord: Vec2;
    startDownCoord: Vec2;
    pathLastCoord: Vec2;

    constructor(
        drawingService: DrawingService,
        private rectangleService: RectangleService,
        private tracingService: TracingService,
        private colorService: ColorService,
        private widthService: WidthService,
    ) {
        super(drawingService, colorService, new Description('selection rectangle', 'r', 'question_mark.png'));
    }

    onMouseDown(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.mouseDown = event.button === MouseButton.Left;
        this.widthService.setWidth(1);
        this.colorService.setPrimaryColor('#000000');
        this.colorService.setSecondaryColor('#000000');
        this.tracingService.setHasFill(false);
        this.tracingService.setHasContour(true);

        if (this.selectionCreated && this.checkHit(this.mouseDownCoord)) {
            this.getAnchorHit(this.drawingService.previewCtx, this.mouseDownCoord);
        } else if (this.selectionCreated && this.hitSelection(this.mouseDownCoord.x, this.mouseDownCoord.y)) {
            this.pathData.push(this.pathLastCoord);
            this.drawingService.baseCtx.clearRect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
            this.draggingImage = true;
            this.putImageData(this.evenImageStartCoord(this.mouseDownCoord), this.drawingService.previewCtx);
        } else {
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.imageData = new ImageData(1, 1);
            this.startDownCoord = this.getPositionFromMouse(event);
            this.rectangleService.onMouseDown(event);
            this.pathData.push(this.startDownCoord);
        }
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.draggingImage && this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.startDownCoord = this.evenImageStartCoord(mousePosition);
            this.putImageData(this.evenImageStartCoord(mousePosition), this.drawingService.previewCtx);
        } else if (this.clickOnAnchor && this.mouseDown) {
            this.drawingService.baseCtx.clearRect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.getAnchorHit(this.drawingService.previewCtx, mousePosition);
        } else if (this.isInCanvas(mousePosition) && this.mouseDown) {
            this.rectangleService.onMouseMove(event);
            if (this.startDownCoord.x !== mousePosition.x && this.startDownCoord.y !== mousePosition.y && this.rectangleService.shiftDown) {
                const square = this.getSquaredSize(mousePosition);
                this.imageData = this.drawingService.baseCtx.getImageData(this.startDownCoord.x, this.startDownCoord.y, square.x, square.y);
            } else if (this.startDownCoord.x !== mousePosition.x && this.startDownCoord.y !== mousePosition.y && !this.rectangleService.shiftDown) {
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
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.putImageData(this.evenImageStartCoord(mousePosition), this.drawingService.baseCtx);
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.rect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
            this.drawingService.previewCtx.stroke();
            this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
            this.draggingImage = false;
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
        } else if (this.clickOnAnchor) {
            this.getAnchorHit(this.drawingService.baseCtx, mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clickOnAnchor = false;
            this.selectionCreated = false;
        } else if (this.mouseDown) {
            if (this.rectangleService.shiftDown) {
                let square = this.getSquaredSize(mousePosition);
                this.pathData.push({ x: square.x + this.startDownCoord.x, y: square.y + this.startDownCoord.y });
            } else {
                this.pathData.push(mousePosition);
            }
            this.rectangleService.drawRectangle(this.drawingService.previewCtx, this.pathData);
            this.offsetAnchors();
            this.drawingService.previewCtx.putImageData(this.imageData, this.startDownCoord.x, this.startDownCoord.y);
            this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
            this.selectionCreated = true;
            this.pathLastCoord = this.pathData[this.pathData.length - 1];
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onShiftDown(event: KeyboardEvent): void {
        this.rectangleService.shiftDown = true;
        if (this.mouseDown) {
            const mouseEvent = {
                offsetX: this.pathData[this.pathData.length - 1].x,
                offsetY: this.pathData[this.pathData.length - 1].y,
                button: 0,
            } as MouseEvent;
            this.onMouseMove(mouseEvent);
        }
    }

    onShiftUp(event: KeyboardEvent): void {
        this.rectangleService.shiftDown = false;
        if (this.mouseDown) {
            const mouseEvent = {
                offsetX: this.pathData[this.pathData.length - 1].x,
                offsetY: this.pathData[this.pathData.length - 1].y,
                button: 0,
            } as MouseEvent;
            this.onMouseMove(mouseEvent);
        }
    }

    onCtrlADown(event: KeyboardEvent): void {
        this.mouseDown = true;
        this.startDownCoord = { x: 0, y: 0 };
        this.rectangleService.mouseDownCoord = { x: 0, y: 0 };
        this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
        const mouseEvent = {
            offsetX: this.drawingService.baseCtx.canvas.width,
            offsetY: this.drawingService.baseCtx.canvas.height,
            button: 0,
        } as MouseEvent;
        this.imageData = this.drawingService.baseCtx.getImageData(
            this.startDownCoord.x,
            this.startDownCoord.y,
            this.drawingService.baseCtx.canvas.width,
            this.drawingService.baseCtx.canvas.height,
        );
        this.onMouseUp(mouseEvent);
    }

    getSquaredSize(mousePosition: Vec2): Vec2 {
        let width = mousePosition.x - this.startDownCoord.x;
        let height = mousePosition.y - this.startDownCoord.y;
        if (this.rectangleService.shiftDown) {
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
        }
        return { x: width, y: height };
    }

    evenImageStartCoord(mousePosition: Vec2): Vec2 {
        let startCoord = { x: mousePosition.x - this.imageData.width / 2, y: mousePosition.y - this.imageData.height / 2 };
        if (this.imageData.width % 2 != 0 || this.imageData.height % 2 != 0) {
            if (this.imageData.width % 2 != 0) {
                startCoord.x = mousePosition.x - (this.imageData.width + 1) / 2;
            }
            if (this.imageData.height % 2 != 0) {
                startCoord.y = mousePosition.y - (this.imageData.height + 1) / 2;
            }
        }
        return startCoord;
    }
}
