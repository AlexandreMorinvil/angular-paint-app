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
// tslint:disable:max-file-line-count
@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionService extends SelectionToolService {
    private imageRotation: ImageData;
    constructor(
        drawingService: DrawingService,
        private drawingStateTrackingService: DrawingStateTrackerService,
        private rectangleService: RectangleService,
        private tracingService: TracingService,
        private colorService: ColorService,
        private widthService: WidthService,
    ) {
        super(drawingService, colorService, new Description('selection rectangle', 'r', 'rectangle-selection.png'));
        this.image = new Image();
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.mouseDown) {
            this.onEscapeDown();
        }
        this.arrowPress = [false, false, false, false];
        this.arrowDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.localMouseDown = event.button === MouseButton.Left;
        this.resetTransform();
        // resizing
        if (this.selectionCreated && this.checkHit(this.mouseDownCoord)) {
            this.getAnchorHit(this.drawingService.previewCtx, this.mouseDownCoord, 2);
            this.startSelectionPoint = this.startDownCoord;
            //this.pathLastCoord = this.mouseDownCoord; //added
            // translate
        } else if (this.selectionCreated && this.hitSelection(this.mouseDownCoord.x, this.mouseDownCoord.y)) {
            this.pathData.push(this.pathLastCoord);
            this.startSelectionPoint = this.startDownCoord;
            // Puts back what was under the selection
            if (this.hasDoneResizing) {
                this.drawingService.baseCtx.clearRect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
                this.hasDoneResizing = false;
            } else if (this.hasDoneFirstTranslation) {
                /* this.drawImage(
                    this.drawingService.baseCtx,
                    this.startDownCoord,
                    this.startSelectionPoint,
                    { x: this.imageData.width, y: this.imageData.height },
                    this.image,
                    { x: this.imageData.width, y: this.imageData.height },
                ); */
                this.putImageData(this.startDownCoord, this.drawingService.baseCtx, this.oldImageData);
            }
            // Puts a white rectangle on selection original placement
            else {
                this.drawingService.baseCtx.clearRect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
            }
            this.draggingImage = true;
            this.mouseDown = true;
            /* this.drawImage(
                this.drawingService.previewCtx,
                this.evenImageStartCoord(this.mouseDownCoord),
                this.startSelectionPoint,
                { x: this.imageData.width, y: this.imageData.height },
                this.image,
                { x: this.imageData.width, y: this.imageData.height },
            ); */
            this.putImageData(this.evenImageStartCoord(this.mouseDownCoord), this.drawingService.previewCtx, this.imageData);
            this.startDownCoord = this.evenImageStartCoord(this.mouseDownCoord);
            //this.angle = 0;
            // creation
        } else {
            this.resetCanvasRotation();
            this.imageData = new ImageData(1, 1);
            this.startDownCoord = this.getPositionFromMouse(event);
            this.rectangleService.onMouseDown(event);
            this.pathData.push(this.startDownCoord);
            this.startSelectionPoint = this.getPositionFromMouse(event);
            this.mouseDown = true;
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.hasDoneResizing = false;
            this.hasDoneFirstRotation = false;
            this.angle = 0;
        }
    }

    onMouseMove(event: MouseEvent): void {
        const MOUSE_POSITION = this.getPositionFromMouse(event);
        // translate
        if (this.draggingImage && this.localMouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.startDownCoord = this.evenImageStartCoord(MOUSE_POSITION);
            /* this.drawImage(
                this.drawingService.previewCtx,
                this.evenImageStartCoord(MOUSE_POSITION),
                this.startSelectionPoint,
                { x: this.imageData.width, y: this.imageData.height },
                this.image,
                { x: this.imageData.width, y: this.imageData.height },
            ); */
            this.putImageData(this.evenImageStartCoord(MOUSE_POSITION), this.drawingService.previewCtx, this.imageData);
            // resizing
        } else if (this.clickOnAnchor && this.localMouseDown) {
            this.drawingService.baseCtx.clearRect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.getAnchorHit(this.drawingService.previewCtx, MOUSE_POSITION, 2);
            // creation
        } else if (this.isInCanvas(MOUSE_POSITION) && this.localMouseDown) {
            this.rectangleService.onMouseMove(event);
            if (this.startDownCoord.x !== MOUSE_POSITION.x && this.startDownCoord.y !== MOUSE_POSITION.y && this.rectangleService.shiftDown) {
                const SQUARE = this.getSquaredSize(MOUSE_POSITION);
                this.imageData = this.drawingService.baseCtx.getImageData(this.startDownCoord.x, this.startDownCoord.y, SQUARE.x, SQUARE.y);
            } else if (this.startDownCoord.x !== MOUSE_POSITION.x && this.startDownCoord.y !== MOUSE_POSITION.y && !this.rectangleService.shiftDown) {
                this.imageData = this.drawingService.baseCtx.getImageData(
                    this.startDownCoord.x,
                    this.startDownCoord.y,
                    MOUSE_POSITION.x - this.startDownCoord.x,
                    MOUSE_POSITION.y - this.startDownCoord.y,
                );
            }
            this.pathData.push(MOUSE_POSITION);
        }
    }

    onMouseUp(event: MouseEvent): void {
        const MOUSE_POSITION = this.getPositionFromMouse(event);
        const SIZE = { x: this.imageData.width, y: this.imageData.height };
        const TRANSLATION = { x: this.startDownCoord.x + SIZE.x / 2, y: this.startDownCoord.y + SIZE.y / 2 };
        const MEMORY_COORDS = this.startDownCoord;
        const MAX_SIDE = Math.max(SIZE.x, SIZE.y);
        // translate
        if (this.draggingImage) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            // saves what was under the selection
            const SAVED_OLD_IMAGE_DATA = this.oldImageData;
            this.oldImageData = this.getOldImageData(MOUSE_POSITION);
            this.getImageRotation();
            this.rectangleService.mouseDownCoord = this.startDownCoord;
            this.pathLastCoord = { x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y + this.imageData.height };
            this.pathData.push(this.pathLastCoord);
            /* this.drawImage(
                this.drawingService.baseCtx,
                this.evenImageStartCoord(MOUSE_POSITION),
                this.startSelectionPoint,
                { x: this.imageData.width, y: this.imageData.height },
                this.image,
                { x: this.imageData.width, y: this.imageData.height },
            ); */
            this.putImageData(this.evenImageStartCoord(MOUSE_POSITION), this.drawingService.baseCtx, this.imageData);

            this.drawingStateTrackingService.addAction(
                this,
                new InteractionSelection(
                    this.hasDoneFirstTranslation,
                    this.startSelectionPoint,
                    this.startDownCoord,
                    this.imageData,
                    SAVED_OLD_IMAGE_DATA,
                ),
            );

            if (!this.hasDoneFirstRotation || this.angle === 0) {
                this.rectangleService.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
                this.drawnAnchor(this.drawingService.previewCtx);
                this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
            } else {
                // draw selection preview
                this.startDownCoord = { x: TRANSLATION.x - MAX_SIDE / 2, y: TRANSLATION.y - MAX_SIDE / 2 };
                this.pathLastCoord = { x: this.startDownCoord.x + MAX_SIDE, y: this.startDownCoord.y + MAX_SIDE };
                this.pathData.push(this.pathLastCoord);
                this.rectangleService.mouseDownCoord = this.startDownCoord;
                this.rectangleService.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
                this.drawnAnchor(this.drawingService.previewCtx, { x: MAX_SIDE, y: MAX_SIDE });
                this.clearPath();
            }
            this.pathLastCoord = { x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y + this.imageData.height };
            this.draggingImage = false;
            this.hasDoneFirstTranslation = true;
            this.startDownCoord = MEMORY_COORDS;

            //this.firstEllipseCoord = this.startDownCoord;
            //this.startSelectionPoint = this.startDownCoord;
            //this.drawingService.previewCtx.beginPath();
            //this.drawingService.previewCtx.rect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
            //this.drawingService.previewCtx.stroke();
            //this.drawnAnchor(this.drawingService.previewCtx);
            //this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
            // resizing
        } else if (this.clickOnAnchor) {
            this.getAnchorHit(this.drawingService.baseCtx, MOUSE_POSITION, 2);

            const TRACKING_INFO = this.getActionTrackingInfo(MOUSE_POSITION);
            const IMAGE_DATA_SELECTION = this.drawingService.baseCtx.getImageData(
                TRACKING_INFO[0].x,
                TRACKING_INFO[0].y,
                TRACKING_INFO[1].x - TRACKING_INFO[0].x,
                TRACKING_INFO[1].y - TRACKING_INFO[0].y,
            );
            this.drawingStateTrackingService.addAction(
                this,
                new InteractionSelection(
                    this.hasDoneFirstTranslation,
                    this.startSelectionPoint,
                    TRACKING_INFO[0],
                    IMAGE_DATA_SELECTION,
                    this.oldImageData,
                ),
            );
            this.oldImageData = IMAGE_DATA_SELECTION;

            this.pathData.push(MOUSE_POSITION);
            this.offsetAnchors(this.startDownCoord);
            this.clearPath();
            this.imageData = this.drawingService.baseCtx.getImageData(
                this.startDownCoord.x,
                this.startDownCoord.y,
                this.resizeWidth,
                this.resizeHeight,
            );
            this.getImageRotation();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.rect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
            this.drawingService.previewCtx.stroke();
            this.drawnAnchor(this.drawingService.previewCtx);
            this.clickOnAnchor = false;
            this.hasDoneResizing = true;
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL();

            // creation
        } else if (this.localMouseDown) {
            if (this.rectangleService.shiftDown) {
                const SQUARE = this.getSquaredSize(MOUSE_POSITION);
                const END_POINT = { x: SQUARE.x + this.startDownCoord.x, y: SQUARE.y + this.startDownCoord.y };
                this.pathData.push(END_POINT);
            } else {
                this.pathData.push(MOUSE_POSITION);
            }
            this.startDownCoord = this.offsetAnchors(this.startDownCoord);
            // saves what was under the selection
            this.oldImageData = this.drawingService.baseCtx.getImageData(
                this.startDownCoord.x,
                this.startDownCoord.y,
                this.imageData.width,
                this.imageData.height,
            );
            this.getImageRotation();

            this.rectangleService.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
            this.drawingService.previewCtx.putImageData(this.imageData, this.startDownCoord.x, this.startDownCoord.y);
            this.drawnAnchor(this.drawingService.previewCtx);

            this.selectionCreated = true;
            this.pathLastCoord = this.pathData[this.pathData.length - 1];
            this.hasDoneFirstTranslation = false;
        }
        this.localMouseDown = false;
        this.clearPath();
    }

    onShiftDown(event: KeyboardEvent): void {
        if (!event.ctrlKey) {
            this.shiftDown = true;
            this.ratio = this.getRatio(this.imageData.width, this.imageData.height);
            if (!this.clickOnAnchor) {
                this.rectangleService.shiftDown = true;
                this.createOnMouseMoveEvent();
            }
        }
    }

    onShiftUp(event: KeyboardEvent): void {
        if (!event.ctrlKey) {
            this.shiftDown = false;
            if (!this.clickOnAnchor) {
                this.rectangleService.shiftDown = false;
                this.createOnMouseMoveEvent();
            }
        }
    }

    onArrowDown(event: KeyboardEvent): void {
        if (!this.arrowDown) {
            this.arrowCoord = this.startDownCoord;
            if (this.hasDoneFirstTranslation) {
                this.putImageData(this.arrowCoord, this.drawingService.baseCtx, this.oldImageData);
            }
            // Puts a white rectangle on selection original placement
            else {
                this.drawingService.baseCtx.clearRect(this.arrowCoord.x, this.arrowCoord.y, this.imageData.width, this.imageData.height);
            }
            this.startSelectionPoint = { x: this.startDownCoord.x, y: this.startDownCoord.y };
        }
        if (this.selectionCreated) {
            this.pathLastCoord = { x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y + this.imageData.height };
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
            if (this.arrowPress.every((v) => !v)) {
                this.arrowDown = false;
                this.clearPath();
                this.pathLastCoord = { x: this.startDownCoord.x + this.imageData.width, y: this.startDownCoord.y + this.imageData.height };
                this.pathData.push(this.pathLastCoord);
                const SAVED_OLD_IMAGE_DATA = this.oldImageData;
                this.oldImageData = this.drawingService.baseCtx.getImageData(
                    this.startDownCoord.x,
                    this.startDownCoord.y,
                    this.imageData.width,
                    this.imageData.height,
                );
                this.rectangleService.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
                this.drawnAnchor(this.drawingService.previewCtx);
                this.putImageData(this.startDownCoord, this.drawingService.baseCtx, this.imageData);
                this.drawingStateTrackingService.addAction(
                    this,
                    new InteractionSelection(
                        this.hasDoneFirstTranslation,
                        this.startSelectionPoint,
                        this.startDownCoord,
                        this.imageData,
                        SAVED_OLD_IMAGE_DATA,
                    ),
                );
                this.hasDoneFirstTranslation = true;
            }
            if (this.arrowDown) {
                this.onArrowDown({} as KeyboardEvent);
            }
        }
    }

    onCtrlADown(): void {
        this.localMouseDown = true;
        this.startDownCoord = { x: 0, y: 0 };
        this.rectangleService.mouseDownCoord = { x: 0, y: 0 };
        const MOUSE_EVENT = {
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
        this.onMouseUp(MOUSE_EVENT);
    }

    // tslint:disable:no-magic-numbers
    onMouseWheel(event: WheelEvent): void {
        if (!this.mouseDown) {
            this.onEscapeDown();
        }
        if (this.selectionCreated) {
            // setting up variable/const
            const SIZE = { x: this.imageData.width, y: this.imageData.height };
            const TRANSLATION = { x: this.startDownCoord.x + SIZE.x / 2, y: this.startDownCoord.y + SIZE.y / 2 };
            const MEMORY_COORDS = this.startDownCoord;
            const ORIENTATION = event.deltaY / 100;

            // clearing old spot
            const MAX_SIDE = Math.hypot(SIZE.x, SIZE.y) + 1;
            this.putImageData({ x: TRANSLATION.x - MAX_SIDE / 2, y: TRANSLATION.y - MAX_SIDE / 2 }, this.drawingService.baseCtx, this.imageRotation);
            if (!this.hasDoneFirstTranslation || this.hasDoneResizing) {
                this.drawingService.baseCtx.clearRect(MEMORY_COORDS.x, MEMORY_COORDS.y, SIZE.x, SIZE.y);
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            // calculate desire angle for canvas rotation
            let angleVoulue = 0;
            if (event.altKey) {
                angleVoulue = 1;
            } else {
                angleVoulue = 15;
            }
            this.angle += ORIENTATION * angleVoulue;
            if (this.angle >= 360) {
                this.angle -= 360;
            }
            // rotation
            this.rotateCanvas(this.angle);
            this.startDownCoord = { x: -SIZE.x / 2, y: -SIZE.y / 2 };
            this.drawImage(this.drawingService.baseCtx, this.startDownCoord, this.startSelectionPoint, SIZE, this.image, SIZE);

            // reset canvas transform after rotation
            this.resetCanvasRotation();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);

            // draw selection preview
            this.startDownCoord = { x: TRANSLATION.x - MAX_SIDE / 2, y: TRANSLATION.y - MAX_SIDE / 2 };
            this.drawingService.previewCtx.beginPath();
            this.drawingService.previewCtx.rect(this.startDownCoord.x, this.startDownCoord.y, MAX_SIDE, MAX_SIDE);
            this.drawingService.previewCtx.stroke();
            this.drawnAnchor(this.drawingService.previewCtx, { x: MAX_SIDE, y: MAX_SIDE });
            this.startDownCoord = MEMORY_COORDS;
            this.hasDoneFirstRotation = true;
        }
    }

    private createOnMouseMoveEvent(): void {
        if (this.localMouseDown) {
            const MOUSE_EVENT = {
                offsetX: this.pathData[this.pathData.length - 1].x,
                offsetY: this.pathData[this.pathData.length - 1].y,
                button: 0,
            } as MouseEvent;
            this.onMouseMove(MOUSE_EVENT);
        }
    }

    private resetTransform(): void {
        this.widthService.setWidth(1);
        this.colorService.setPrimaryColor('#000000');
        this.colorService.setSecondaryColor('#000000');
        this.tracingService.setHasFill(false);
        this.tracingService.setHasContour(true);
    }
    private getImageRotation(): void {
        const MAX_SIDE = Math.hypot(this.imageData.width, this.imageData.height) + 1;
        this.imageRotation = this.drawingService.baseCtx.getImageData(
            this.startDownCoord.x + this.imageData.width / 2 - MAX_SIDE / 2,
            this.startDownCoord.y + this.imageData.height / 2 - MAX_SIDE / 2,
            MAX_SIDE,
            MAX_SIDE,
        );
    }

    execute(interaction: InteractionSelection): void {
        this.resetTransform();
        if (interaction.hasDoneFirstSelection)
            this.putImageData(interaction.startSelectionPoint, this.drawingService.baseCtx, interaction.belowSelection);
        else
            this.drawingService.baseCtx.clearRect(
                interaction.startSelectionPoint.x,
                interaction.startSelectionPoint.y,
                interaction.selection.width,
                interaction.selection.height,
            );
        this.putImageData(interaction.movePosition, this.drawingService.baseCtx, interaction.selection);
    }
}
