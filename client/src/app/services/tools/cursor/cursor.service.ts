import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { WorkzoneSizeService } from '@app/services/workzone-size-service/workzone-size.service';

const minSurfaceSize = 50;

@Injectable({
    providedIn: 'root',
})
export class CursorService extends Tool {
    mouseDownCoord: Vec2;
    mouseDown: boolean = false;
    private dotSize: number = 10;
    private clickOnAnchor: boolean = false;
    private anchorHit: number = 0;
    // tslint:disable-next-line:no-any
    private imageData: any;

    constructor(drawingService: DrawingService, private workzoneService: WorkzoneSizeService) {
        super(drawingService, new Description('redimensionneur', 'y', 'crop-icon.png'));
    }

    onMouseDown(event: MouseEvent): void {
        this.drawingService.previewCtx.fillStyle = '#000000';
        this.imageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.drawingService.baseCtx.canvas.width,
            this.drawingService.baseCtx.canvas.height,
        );
        this.mouseDownCoord = this.getPositionFromMouse(event);
        this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
        this.checkHit(this.mouseDownCoord, this.drawingService.canvas);
        this.mouseDown = true;
    }

    onMouseUp(event: MouseEvent): void {
        this.clickOnAnchor = false;
        this.mouseDown = false;
        this.drawingService.baseCtx.canvas.width = this.drawingService.previewCtx.canvas.width;
        this.drawingService.baseCtx.canvas.height = this.drawingService.previewCtx.canvas.height;
        this.drawnAnchor(this.drawingService.previewCtx, this.drawingService.canvas);
        this.drawingService.baseCtx.putImageData(this.imageData, 0, 0);

        this.workzoneService.updateDrawingZoneDimension({
            width: this.drawingService.previewCtx.canvas.width,
            height: this.drawingService.previewCtx.canvas.height,
        });
    }

    onMouseMove(event: MouseEvent): void {
        if (this.clickOnAnchor && this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            switch (this.anchorHit) {
                case 1:
                    this.moveWidth(this.mouseDownCoord.x);
                    this.moveHeight(this.mouseDownCoord.y);
                    break;
                case 2:
                    this.moveWidth(this.mouseDownCoord.x);
                    break;
                // tslint:disable-next-line:no-magic-numbers
                case 3:
                    this.moveHeight(this.mouseDownCoord.y);
                    break;
                default:
                    this.anchorHit = 0;
                    break;
            }
        }
    }

    private moveWidth(mouseDownCoordX: number): void {
        if (mouseDownCoordX >= minSurfaceSize) {
            this.drawingService.previewCtx.canvas.width = mouseDownCoordX;
        } else {
            this.drawingService.previewCtx.canvas.width = minSurfaceSize;
        }
    }

    private moveHeight(mouseDownCoordY: number): void {
        if (mouseDownCoordY >= minSurfaceSize) {
            this.drawingService.previewCtx.canvas.height = mouseDownCoordY;
        } else {
            this.drawingService.previewCtx.canvas.height = minSurfaceSize;
        }
    }

    private drawnAnchor(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        ctx.beginPath();
        ctx.arc(canvas.width, canvas.height, this.dotSize, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.arc(canvas.width / 2, canvas.height, this.dotSize, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.arc(canvas.width, canvas.height / 2, this.dotSize, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    }

    private checkHit(mouse: Vec2, canvas: HTMLCanvasElement): void {
        let x: number;
        let y: number;
        const dotSizeSquare: number = Math.pow(this.dotSize, 2);

        x = Math.pow(mouse.x - canvas.width, 2);
        y = Math.pow(mouse.y - canvas.height, 2);
        if (x + y <= dotSizeSquare) {
            this.clickOnAnchor = true;
            this.anchorHit = 1;
        }

        x = Math.pow(mouse.x - canvas.width, 2);
        y = Math.pow(mouse.y - canvas.height / 2, 2);
        if (x + y <= dotSizeSquare) {
            this.clickOnAnchor = true;
            this.anchorHit = 2;
        }

        x = Math.pow(mouse.x - canvas.width / 2, 2);
        y = Math.pow(mouse.y - canvas.height, 2);
        if (x + y <= dotSizeSquare) {
            this.clickOnAnchor = true;
            // tslint:disable-next-line:no-magic-numbers
            this.anchorHit = 3;
        }

        if (!this.clickOnAnchor) {
            this.clickOnAnchor = false;
            this.anchorHit = 0;
        }
    }
}
