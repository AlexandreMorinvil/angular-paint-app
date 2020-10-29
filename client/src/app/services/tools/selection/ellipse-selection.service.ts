import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { TracingService } from '@app/services/tool-modifier/tracing/tracing.service';
import { WidthService } from '@app/services/tool-modifier/width/width.service';
import { EllipseService } from '@app/services/tools/ellipse/ellipse-service';
import { SelectionToolService } from '@app/services/tools/selection/selection-tool.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseSelectionService extends SelectionToolService {
    mouseDownCoord: Vec2;
    startDownCoord: Vec2;
    pathLastCoord: Vec2;
    firstEllipseCoord: Vec2;

    constructor(
        drawingService: DrawingService,
        private ellipseService: EllipseService,
        private tracingService: TracingService,
        private colorService: ColorService,
        private widthService: WidthService,
    ) {
        super(drawingService, colorService, new Description('selection ellipse', 's', 'question_mark.png'));
    }

    onMouseDown(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.mouseDown = event.button === MouseButton.Left;
        this.resetTransform();
        if (this.selectionCreated && this.checkHit(this.mouseDownCoord)) {
            this.getAnchorHit(this.drawingService.previewCtx, this.mouseDownCoord);
        } else if (this.selectionCreated && this.hitSelection(this.mouseDownCoord.x, this.mouseDownCoord.y)) {
            this.pathData.push(this.pathLastCoord);
            this.clearCanvasEllipse();
            this.draggingImage = true;
            this.showSelection(this.drawingService.previewCtx);
        } else {
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
            this.imageData = new ImageData(1, 1);
            this.startDownCoord = this.getPositionFromMouse(event);
            this.firstEllipseCoord = this.getPositionFromMouse(event);
            this.ellipseService.onMouseDown(event);
            this.pathData.push(this.startDownCoord);
        }
    }

    onMouseMove(event: MouseEvent): void {
        const mousePosition = this.getPositionFromMouse(event);
        if (this.draggingImage && this.mouseDown) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.showSelection(this.drawingService.previewCtx);
            this.startDownCoord = { x: mousePosition.x - this.imageData.width / 2, y: mousePosition.y - this.imageData.height / 2 };
            this.pathLastCoord = { x: mousePosition.x + this.imageData.width / 2, y: mousePosition.y + this.imageData.height / 2 };
        } else if (this.clickOnAnchor && this.mouseDown) {
            this.drawingService.baseCtx.clearRect(this.startDownCoord.x, this.startDownCoord.y, this.imageData.width, this.imageData.height);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.getAnchorHit(this.drawingService.previewCtx, mousePosition);
        } else if (this.isInCanvas(mousePosition) && this.mouseDown) {
            this.ellipseService.onMouseMove(event);
            if (this.startDownCoord.x !== mousePosition.x && this.startDownCoord.y !== mousePosition.y && this.ellipseService.shiftDown) {
                const square = this.getSquaredSize(mousePosition);
                this.imageData = this.drawingService.baseCtx.getImageData(this.startDownCoord.x, this.startDownCoord.y, square.x, square.y);
            } else if (this.startDownCoord.x !== mousePosition.x && this.startDownCoord.y !== mousePosition.y && !this.ellipseService.shiftDown) {
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
            this.ellipseService.mouseDownCoord = this.startDownCoord;
            this.pathData.push(this.pathLastCoord);
            this.showSelection(this.drawingService.baseCtx);
            this.ellipseService.drawEllipse(this.drawingService.previewCtx, this.pathData);
            this.ellipseService.drawPreviewRect(this.drawingService.previewCtx, this.pathData);
            this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
            this.draggingImage = false;
            this.firstEllipseCoord = this.startDownCoord;
            this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
        } else if (this.clickOnAnchor) {
            this.getAnchorHit(this.drawingService.baseCtx, mousePosition);
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.clickOnAnchor = false;
            this.selectionCreated = false;
        } else if (this.mouseDown) {
            if (this.ellipseService.shiftDown) {
                const square = this.getSquaredSize(mousePosition);
                this.pathData.push({ x: square.x + this.startDownCoord.x, y: square.y + this.startDownCoord.y });
            } else {
                this.pathData.push(mousePosition);
            }
            this.ellipseService.drawEllipse(this.drawingService.previewCtx, this.pathData);
            this.offsetAnchors();
            this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
            this.selectionCreated = true;
            this.pathLastCoord = this.pathData[this.pathData.length - 1];
            this.showSelection(this.drawingService.previewCtx);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onArrowDown(event: KeyboardEvent): void {
        const move = 3;
        if (this.selectionCreated) {
            if (event.key === 'ArrowLeft') {
                this.startDownCoord = { x: this.startDownCoord.x - move, y: this.startDownCoord.y };
                this.pathLastCoord = { x: this.pathLastCoord.x - move, y: this.pathLastCoord.y };
            }
            if (event.key === 'ArrowRight') {
                this.startDownCoord = { x: this.startDownCoord.x + move, y: this.startDownCoord.y };
                this.pathLastCoord = { x: this.pathLastCoord.x + move, y: this.pathLastCoord.y };
            }
            if (event.key === 'ArrowUp') {
                this.startDownCoord = { x: this.startDownCoord.x, y: this.startDownCoord.y - move };
                this.pathLastCoord = { x: this.pathLastCoord.x, y: this.pathLastCoord.y - move };
            }
            if (event.key === 'ArrowDown') {
                this.startDownCoord = { x: this.startDownCoord.x, y: this.startDownCoord.y + move };
                this.pathLastCoord = { x: this.pathLastCoord.x, y: this.pathLastCoord.y + move };
            }
            /*switch (event.key) {
                case 'ArrowLeft':
                    this.startDownCoord = { x: this.startDownCoord.x - 3, y: this.startDownCoord.y };
                    this.pathLastCoord = { x: this.pathLastCoord.x - 3, y: this.pathLastCoord.y };
                    break;

                case 'ArrowRight':
                    this.startDownCoord = { x: this.startDownCoord.x + 3, y: this.startDownCoord.y };
                    this.pathLastCoord = { x: this.pathLastCoord.x + 3, y: this.pathLastCoord.y };
                    break;

                case 'ArrowUp':
                    this.startDownCoord = { x: this.startDownCoord.x, y: this.startDownCoord.y - 3 };
                    this.pathLastCoord = { x: this.pathLastCoord.x, y: this.pathLastCoord.y - 3 };
                    break;

                case 'ArrowDown':
                    this.startDownCoord = { x: this.startDownCoord.x, y: this.startDownCoord.y + 3 };
                    this.pathLastCoord = { x: this.pathLastCoord.x, y: this.pathLastCoord.y + 3 };
                    break;
                default:
                    break;
            }*/
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.showSelection(this.drawingService.previewCtx);
            this.draggingImage = false;
        }
    }

    onArrowUp(event: KeyboardEvent): void {
        if (this.selectionCreated) {
            this.draggingImage = true;
            this.clearPath();
            this.pathData.push(this.pathLastCoord);
            this.clearCanvasEllipse();
            this.clearPath();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.onMouseUp({ offsetX: 25, offsetY: 25, button: 0 } as MouseEvent);
            this.draggingImage = false;
        }
    }

    showSelection(canvas: CanvasRenderingContext2D): void {
        canvas.save();
        const ellipsePath = this.getPath();
        canvas.clip(ellipsePath);
        this.drawImage(canvas, this.startDownCoord, this.firstEllipseCoord, {
            x: this.imageData.width,
            y: this.imageData.height,
        });
        canvas.restore();
    }

    getPath(): Path2D {
        const ellipsePath = new Path2D();
        const mouseMoveCoord = this.pathLastCoord;
        const centerX = (mouseMoveCoord.x + this.startDownCoord.x) / 2;
        const centerY = (mouseMoveCoord.y + this.startDownCoord.y) / 2;

        const radiusX = Math.abs(mouseMoveCoord.x - this.startDownCoord.x) / 2;
        const radiusY = Math.abs(mouseMoveCoord.y - this.startDownCoord.y) / 2;

        const contourRadiusX = Math.abs(radiusX - this.widthService.getWidth() / 2);
        const contourRadiusY = Math.abs(radiusY - this.widthService.getWidth() / 2);
        ellipsePath.ellipse(centerX, centerY, contourRadiusX, contourRadiusY, 0, 0, Math.PI * 2, false);
        return ellipsePath;
    }

    clearCanvasEllipse(): void {
        this.ellipseService.drawEllipse(this.drawingService.previewCtx, this.pathData);
        this.colorService.setPrimaryColor('#FFFFFF');
        this.tracingService.setHasFill(true);
        this.tracingService.setHasContour(false);
        this.ellipseService.drawEllipse(this.drawingService.baseCtx, this.pathData);
        this.resetTransform();
    }

    onShiftDown(event: KeyboardEvent): void {
        this.ellipseService.shiftDown = true;
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
        this.ellipseService.shiftDown = false;
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
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.resetTransform();
        this.mouseDown = true;
        this.startDownCoord = { x: 0, y: 0 };
        this.firstEllipseCoord = { x: 0, y: 0 };
        this.ellipseService.mouseDownCoord = { x: 0, y: 0 };
        this.image.src = this.drawingService.baseCtx.canvas.toDataURL();
        const mouseEvent = {
            offsetX: this.drawingService.baseCtx.canvas.width,
            offsetY: this.drawingService.baseCtx.canvas.height,
            button: 0,
        } as MouseEvent;
        this.imageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.drawingService.baseCtx.canvas.width,
            this.drawingService.baseCtx.canvas.height,
        );
        this.onMouseUp(mouseEvent);
    }

    resetTransform(): void {
        this.widthService.setWidth(1);
        this.colorService.setPrimaryColor('#000000');
        this.colorService.setSecondaryColor('#000000');
        this.tracingService.setHasFill(false);
        this.tracingService.setHasContour(true);
    }
}
