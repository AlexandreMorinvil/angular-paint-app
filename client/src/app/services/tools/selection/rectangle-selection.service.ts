import { Injectable } from '@angular/core';
import { InteractionSelection } from '@app/classes/action/interaction-selection';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
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
    constructor(
        drawingService: DrawingService,
        private drawingStateTrackingService: DrawingStateTrackerService,
        private rectangleService: RectangleService,
        private tracingService: TracingService,
        private colorService: ColorService,
        private widthService: WidthService,
    ) {
        super(drawingService, colorService, new Description('selection rectangle', 'r', 'question_mark.png'));
    }

    onMouseDown(event: MouseEvent): void {
        this.arrowPress = [false, false, false, false];
        this.arrowDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.mouseDown = event.button === MouseButton.Left;
        this.resetTransform();
        // translate
        if (this.selectionCreated && this.hitSelection(this.mouseDownCoord.x, this.mouseDownCoord.y)) {
            this.pathData.push(this.pathLastCoord);
            // Puts back what was under the selection
            if (this.firstTranslation) {
                this.putImageData(this.startDownCoord, this.drawingService.baseCtx, this.oldImageData);
            }
            // Puts a white rectangle on selection original placement
            else {
                this.drawingService.baseCtx.clearRect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
            }
            this.draggingImage = true;
            this.putImageData(this.evenImageStartCoord(this.mouseDownCoord), this.drawingService.previewCtx, this.imageData);
            // creation
        } else {
            this.imageData = new ImageData(1, 1);
            this.startDownCoord = this.getPositionFromMouse(event);
            this.rectangleService.onMouseDown(event);
            this.pathData.push(this.startDownCoord);
            this.startSelectionPoint = this.getPositionFromMouse(event);
        }
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        // translate
        if (this.draggingImage && this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.startDownCoord = this.evenImageStartCoord(mousePosition);
            this.putImageData(this.evenImageStartCoord(mousePosition), this.drawingService.previewCtx, this.imageData);
            // creation
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
        // translate
        if (this.draggingImage) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            // saves what was under the selection
            this.oldImageData = this.getOldImageData(mousePosition);
            this.putImageData(this.evenImageStartCoord(mousePosition), this.drawingService.baseCtx, this.imageData);
            this.drawingStateTrackingService.addAction(
                this,
                new InteractionSelection(
                    this.firstTranslation,
                    this.startSelectionPoint,
                    this.endSelectionPoint,
                    mousePosition,
                    this.imageData,
                    this.oldImageData,
                ),
            );
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.rect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
            this.drawingService.previewCtx.stroke();
            this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
            this.draggingImage = false;
            this.firstTranslation = true;
            // creation
        } else if (this.mouseDown) {
            if (this.rectangleService.shiftDown) {
                const square = this.getSquaredSize(mousePosition);
                this.pathData.push({ x: square.x + this.startDownCoord.x, y: square.y + this.startDownCoord.y });
            } else {
                this.pathData.push(mousePosition);
            }
            // saves what was under the selection
            this.oldImageData = this.getOldImageData(mousePosition);
            this.rectangleService.drawRectangle(this.drawingService.previewCtx, this.pathData);
            this.offsetAnchors(this.startDownCoord);
            this.drawingService.previewCtx.putImageData(this.imageData, this.startDownCoord.x, this.startDownCoord.y);
            this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
            this.selectionCreated = true;
            this.pathLastCoord = this.pathData[this.pathData.length - 1];
            this.firstTranslation = false;
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onShiftDown(event: KeyboardEvent): void {
        this.rectangleService.shiftDown = true;
        this.createOnMouseMoveEvent();
    }

    onShiftUp(event: KeyboardEvent): void {
        this.rectangleService.shiftDown = false;
        this.createOnMouseMoveEvent();
    }

    onArrowDown(event: KeyboardEvent): void {
        if (!this.arrowDown) {
            this.arrowCoord = this.startDownCoord;
            this.drawingService.baseCtx.clearRect(this.arrowCoord.x, this.arrowCoord.y, this.imageData.width, this.imageData.height);
        }
        if (this.selectionCreated) {
            this.checkArrowHit(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clearPath();
            this.rectangleService.mouseDownCoord = this.startDownCoord;
            this.pathData.push(this.pathLastCoord);
            this.drawingService.previewCtx.putImageData(this.imageData, this.startDownCoord.x, this.startDownCoord.y);
        }
    }

    onArrowUp(event: KeyboardEvent): void {
        if (this.selectionCreated) {
            this.checkArrowUnhit(event);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            if (this.arrowPress.every((v) => v === false)) {
                this.arrowDown = false;
                this.pathData.push(this.pathLastCoord);
                this.rectangleService.drawRectangle(this.drawingService.previewCtx, this.pathData);
                this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
                this.putImageData(this.startDownCoord, this.drawingService.baseCtx, this.imageData);
            }
            if (this.arrowDown) {
                this.onArrowDown({} as KeyboardEvent);
            }
        }
    }

    onCtrlADown(): void {
        this.mouseDown = true;
        this.startDownCoord = { x: 0, y: 0 };
        this.rectangleService.mouseDownCoord = { x: 0, y: 0 };
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

    createOnMouseMoveEvent(): void {
        if (this.mouseDown) {
            const mouseEvent = {
                offsetX: this.pathData[this.pathData.length - 1].x,
                offsetY: this.pathData[this.pathData.length - 1].y,
                button: 0,
            } as MouseEvent;
            this.onMouseMove(mouseEvent);
        }
    }

    resetTransform(): void {
        this.widthService.setWidth(1);
        this.colorService.setPrimaryColor('#000000');
        this.colorService.setSecondaryColor('#000000');
        this.tracingService.setHasFill(false);
        this.tracingService.setHasContour(true);
    }

    execute(interaction: InteractionSelection): void {
        this.resetTransform();
        const startX = interaction.startSelectionPoint.x;
        const startY = interaction.startSelectionPoint.y;
        const width = interaction.endSelectionPoint.x - interaction.startSelectionPoint.x;
        const height = interaction.endSelectionPoint.y - interaction.startSelectionPoint.y;
        if (interaction.isFirstSelection) this.drawingService.baseCtx.clearRect(startX, startY, width, height);
        else this.putImageData(interaction.startSelectionPoint, this.drawingService.baseCtx, interaction.belowSelection);
        this.putImageData(interaction.movePosition, this.drawingService.baseCtx, interaction.selection);
    }
}
