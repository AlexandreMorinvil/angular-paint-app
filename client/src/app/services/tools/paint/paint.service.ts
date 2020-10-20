import { Injectable } from '@angular/core';
import { Description } from '@app/classes/description';
import { MouseButton } from '@app/classes/mouse'
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from '@app/services/tool-modifier/color/color.service';
import { FillingService } from '@app/services/tool-modifier/filling/filling.service';
import { ToleranceService } from '@app/services/tool-modifier/tolerance/tolerance.service';

//const INCREMENTAL_VALUE_WIDTH = 4;
@Injectable({
    providedIn: 'root',
})
export class PaintService extends Tool {
    private pathData: Vec2[];

    private fillColorR: number;
    private fillColorG: number;
    private fillColorB: number;

    private startR: number;
    private startG: number;
    private startB: number;

    private tolerance: number;
    //private index: number;
    //private startA: number;

    //private imageData: ImageData;

    public startRGBHex: string;
    public pixelRGBHex: string;

    constructor(
        drawingService: DrawingService,
        private colorService: ColorService,
        public toleranceService: ToleranceService,
        public fillingService: FillingService,
    ) {
        super(drawingService, new Description('Paint', 'b', 'paint_icon.png'));
        this.modifiers.push(this.colorService);
        this.modifiers.push(this.toleranceService);
        this.modifiers.push(this.fillingService);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData.push(this.mouseDownCoord);
            /* this.getStartColor();
            this.floodfillAlgorithm(); */
            //this.floodfill(this.toleranceService.getTolerance());
            this.getStartColor();
            //this.setFillColor();

            //console.log(this.colorDifference(this.startRGBHex, this.colorService.getPrimaryColor()));
            //console.log(this.startR + '' + this.startG + '' + this.startB);
            this.updateTolerance();
            if (this.fillingService.getNeighbourPixelsOnly() && this.colorService.getPrimaryColor() != this.startRGBHex) {
                this.floodFill(this.drawingService.baseCtx, this.pathData);
            } else {
                this.sameColorFill(this.drawingService.baseCtx);
            }
        }
    }
    onMouseMove(event: MouseEvent){

    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
        this.clearPath();
    }

    sameColorFill(ctx: CanvasRenderingContext2D) {
        this.setAttribute(ctx);
        let pixelPos: Vec2 = { x: 0, y: 0 };
        while (pixelPos.y < ctx.canvas.height) {
            while (pixelPos.x < ctx.canvas.width) {
                if (this.matchStartColor(pixelPos)) {
                    this.colorPixel(pixelPos);
                }
                pixelPos.x++;
            }
            pixelPos.y++;
            pixelPos.x = 0;
        }

    }

    floodFill(ctx: CanvasRenderingContext2D, pathPixel: Vec2[]): void {
        this.setAttribute(ctx);
        while (pathPixel.length) {
            let pixelPos = pathPixel.pop()!;

            let x = pixelPos.x;
            let y = pixelPos.y;

            // Get current pixel position
            //this.index = (y * this.drawingService.baseCtx.canvas.width + x) * 4;
            console.log(this.matchStartColor(pixelPos))

            // Go up as long as the color matches and are inside the canvas
            while (y-- > -1 && this.matchStartColor(pixelPos)) {
                pixelPos.y -= 1;
                //this.index -= this.drawingService.baseCtx.canvas.width * 4;
            }
            pixelPos.y += 1;
            ++y;

            //this.index += this.drawingService.baseCtx.canvas.width * 4;
            let reachLeft = false;
            let reachRight = false;
            //console.log(this.startR + '' + this.startG + '' + this.startB);
            // Go down as long as the color matches and in inside the canvas
            while (y++ <= this.drawingService.baseCtx.canvas.height - 2 && this.matchStartColor(pixelPos) ){
                this.colorPixel(pixelPos);

                if (x > 0){
                    if (this.matchStartColor({x: pixelPos.x - 1, y: pixelPos.y}) ) {
                        if(!reachLeft){
                          // Add pixel to stack
                          pathPixel.push({ x: x - 1, y: y });
                          reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }
                if( x < this.drawingService.baseCtx.canvas.width ){
                    if (this.matchStartColor({x: pixelPos.x + 1, y: pixelPos.y})) {
                        if(!reachRight){
                            // Add pixel to stack
                            pathPixel.push({ x: x + 1, y: y });
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                    pixelPos.y += 1;
                }

                //this.index += this.drawingService.baseCtx.canvas.width * 4;
            }
        }
    }

    getStartColor() {
        //get the pixel on the first Path of mouse
        const imageData: ImageData = this.drawingService.baseCtx.getImageData(this.pathData[0].x, this.pathData[0].y, 1, 1);
        this.startR = imageData.data[0];
        this.startG = imageData.data[1];
        this.startB = imageData.data[2];

        let rgb = this.convertHexToRGB(this.colorService.getPrimaryColor())
        this.fillColorR = rgb[0];
        this.fillColorG = rgb[1];
        this.fillColorB = rgb[2];
        console.log(this.fillColorR)

/*
        let rHex = this.startR.toString(16);
        let gHex = this.startG.toString(16);
        let bHex = this.startB.toString(16);

        if (rHex.length == 1) rHex = '0' + rHex;
        if (gHex.length == 1) gHex = '0' + gHex;
        if (bHex.length == 1) bHex = '0' + bHex;

        this.startRGBHex = '#' + rHex + gHex + bHex;
*/
    }

    getPixelColorHex(pixelPos: Vec2): void {
        //get the pixel on the first Path of mouse
        const imageData: ImageData = this.drawingService.baseCtx.getImageData(pixelPos.x, pixelPos.y, 1, 1);
        let r = imageData.data[0];
        let g = imageData.data[1];
        let b = imageData.data[2];

        let rHex = r.toString(16);
        let gHex = g.toString(16);
        let bHex = b.toString(16);

        if (rHex.length == 1) rHex = '0' + rHex;
        if (gHex.length == 1) gHex = '0' + gHex;
        if (bHex.length == 1) bHex = '0' + bHex;

        this.pixelRGBHex = '#' + rHex + gHex + bHex;
    }

    updateTolerance(){
      this.tolerance = this.toleranceService.getPercentageTolerance();
    }

    matchStartColor(pixelPos: Vec2): boolean {
        //this.getPixelColorHex(pixelPos);
        //return this.similarColor();
        //console.log(this.index);

        const imageData: ImageData = this.drawingService.baseCtx.getImageData(pixelPos.x, pixelPos.y, 1, 1);

        const average = (
        (Math.abs(this.startR - imageData.data[0]) +
        Math.abs(this.startG - imageData.data[1]) +
        Math.abs(this.startB - imageData.data[2])) / 3);

        if ((imageData.data[0] === this.fillColorR && imageData.data[1] === this.fillColorG && imageData.data[2] === this.fillColorB))
          return false;

        if ( average <= this.tolerance /*&& (imageData.data[0] != this.fillColorR && imageData.data[1] != this.fillColorG && imageData.data[2] != this.fillColorB)*/){
            return true; //target to surface within tolerance
        }
        return false;
    }

    /* similarColor(): boolean {
        let difference = this.colorDifference(this.pixelRGBHex, this.startRGBHex)!;
        if (difference <= this.toleranceService.getTolerance()) {
            return true;
        } else return false;
    } */

    colorPixel(pixelPos: Vec2): void {
        //Using fillRect method
        this.drawingService.baseCtx.fillRect(pixelPos.x, pixelPos.y, 1, 1);
        //Using putImageData metho
    }

    /*   colorDifference(firstColor: string, secondColor: string) {
        if (!firstColor && !secondColor) return;

        const _firstColor = firstColor.charAt(0) == '#' ? firstColor.substring(1, 7) : firstColor;
        const _secondColor = secondColor.charAt(0) == '#' ? secondColor.substring(1, 7) : secondColor;

        const _r = parseInt(_firstColor.substring(0, 2), 16);
        const _g = parseInt(_firstColor.substring(2, 4), 16);
        const _b = parseInt(_firstColor.substring(4, 6), 16);

        const __r = parseInt(_secondColor.substring(0, 2), 16);
        const __g = parseInt(_secondColor.substring(2, 4), 16);
        const __b = parseInt(_secondColor.substring(4, 6), 16);

        let r1 = (_r / 255) * 100;
        let g1 = (_g / 255) * 100;
        let b1 = (_b / 255) * 100;

        let perc1 = Math.round((r1 + g1 + b1) / 3);

        let r2 = (__r / 255) * 100;
        let g2 = (__g / 255) * 100;
        let b2 = (__b / 255) * 100;

        let perc2 = Math.round((r2 + g2 + b2) / 3);
        return Math.abs(perc1 - perc2);
    } */

    setAttribute(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.colorService.getPrimaryColor();
        ctx.globalAlpha = this.colorService.getPrimaryColorOpacity();
    }

    clearPath(): void {
        this.pathData = [];
    }

    isInCanvas(mousePosition: Vec2): boolean {
        return mousePosition.x <= this.drawingService.baseCtx.canvas.width && mousePosition.y <= this.drawingService.baseCtx.canvas.height;
    }
    convertHexToRGB (hex: string) {
      hex = hex.substr(1);
      var values = hex.split(''),
          r,
          g,
          b;
      r = parseInt(values[0].toString() + values[1].toString(), 16);
      g = parseInt(values[2].toString() + values[3].toString(), 16);
      b = parseInt(values[4].toString() + values[5].toString(), 16);
      return [r, g, b];
    }



}

/*
    hexToRgb(hex: string): void {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result != null) {
            this.fillColorR = parseInt(result[1], 16);
            this.fillColorG = parseInt(result[2], 16);
            this.fillColorB = parseInt(result[3], 16);
            this.fillColorA = this.colorService.getPrimaryColorOpacity() * 255;
        }
    }

    // http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
    // tslint:disable:cyclomatic-complexity
    floodfillAlgorithm(): void {
        const pixelStack = [[this.pathData[0].x, this.pathData[0].y]];

        while (pixelStack.length) {
            let newPos;
            let x;
            let y;
            let pixelPos;
            let reachLeft;
            let reachRight;

            newPos = pixelStack.pop();
            x = newPos![0];
            y = newPos![1];

            pixelPos = (y * this.drawingService.baseCtx.canvas.width + x) * INCREMENTAL_VALUE_WIDTH;
            while (y-- >= 0 && this.matchStartColor(pixelPos)) {
                pixelPos -= this.drawingService.baseCtx.canvas.width * INCREMENTAL_VALUE_WIDTH;
            }
            pixelPos += this.drawingService.baseCtx.canvas.width * INCREMENTAL_VALUE_WIDTH;
            ++y;
            reachLeft = false;
            reachRight = false;
            while (y++ < this.drawingService.baseCtx.canvas.height - 1 && this.matchStartColor(pixelPos)) {
                this.colorPixel(pixelPos);

                if (x > 0) {
                    if (this.matchStartColor(pixelPos - INCREMENTAL_VALUE_WIDTH)) {
                        if (!reachLeft) {
                            pixelStack.push([x - 1, y]);
                            reachLeft = true;
                        }
                    } else if (reachLeft) {
                        reachLeft = false;
                    }
                }

                if (x < this.drawingService.baseCtx.canvas.width - 1) {
                    if (this.matchStartColor(pixelPos + INCREMENTAL_VALUE_WIDTH)) {
                        if (!reachRight) {
                            pixelStack.push([x + 1, y]);
                            reachRight = true;
                        }
                    } else if (reachRight) {
                        reachRight = false;
                    }
                }

                pixelPos += this.drawingService.baseCtx.canvas.width * INCREMENTAL_VALUE_WIDTH;
            }
        }
        this.drawingService.baseCtx.putImageData(this.imageData, 0, 0);
    }
    matchStartColor(pixelPos: number): boolean {
        this.imageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.drawingService.baseCtx.canvas.width,
            this.drawingService.baseCtx.canvas.height,
        );
        const r = this.imageData.data[pixelPos];
        const g = this.imageData.data[pixelPos + 1];
        const b = this.imageData.data[pixelPos + 2];

        return r === this.startR && g === this.startG && b === this.startB;
    }

    colorPixel(pixelPos: number): void {
        this.imageData.data[pixelPos] = this.fillColorR;
        this.imageData.data[pixelPos + 1] = this.fillColorG;
        this.imageData.data[pixelPos + 2] = this.fillColorB;
        // tslint:disable:no-magic-numbers
        this.imageData.data[pixelPos + 3] = this.fillColorA;
    }

    getStartColor(): number {
        this.startR = this.drawingService.baseCtx.getImageData(this.pathData[0].x, this.pathData[0].y, 1, 1).data[0];
        this.startG = this.drawingService.baseCtx.getImageData(this.pathData[0].x, this.pathData[0].y, 1, 1).data[1];
        this.startB = this.drawingService.baseCtx.getImageData(this.pathData[0].x, this.pathData[0].y, 1, 1).data[2];

        this.startA = this.drawingService.baseCtx.getImageData(this.pathData[0].x, this.pathData[0].y, 1, 1).data[3];
        return this.startR && this.startG && this.startB && this.startA;
    } */

/* floodfill(tolerance: number): boolean {
        let img: ImageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.drawingService.baseCtx.canvas.width,
            this.drawingService.baseCtx.canvas.height,
        );
        let data = img.data;
        let length = data.length;
        let stack = [];
        let i = (this.pathData[0].x + this.pathData[0].y * this.drawingService.baseCtx.canvas.width) * 4;
        let me,
            mw,
            w2 = this.drawingService.baseCtx.canvas.width * 4;
        let targetcolor = [data[i], data[i + 1], data[i + 2], data[i + 3]];

        if (!this.pixelCompare(i, targetcolor, tolerance)) {
            return false;
        }
        stack.push(i);
        while (stack.length) {
            let i: number = stack.pop()!;
            if (this.pixelCompareAndSet(i, targetcolor, tolerance)) {
                let e = i!;
                let w = i!;
                mw = (i / w2) * w2; //left bound
                me = mw + w2; //right bound
                while (mw < (w -= 4) && this.pixelCompareAndSet(w, targetcolor, tolerance)) {
                    console.log('inside while !!!');
                } //go left until edge hit
                while (me > (e += 4) && this.pixelCompareAndSet(e, targetcolor, tolerance)); //go right until edge hit
                for (var j = w; j < e; j += 4) {
                    if (j - w2 >= 0 && this.pixelCompare(j - w2, targetcolor, tolerance)) stack.push(j - w2); //queue y-1
                    if (j + w2 < length && this.pixelCompare(j + w2, targetcolor, tolerance)) stack.push(j + w2); //queue y+1
                }
            }
        }
        this.drawingService.baseCtx.putImageData(img, 0, 0);
        return true;
    }

    pixelCompare(i: number, targetcolor: number[], tolerance: number) {
        let img: ImageData = this.drawingService.baseCtx.getImageData(
            0,
            0,
            this.drawingService.baseCtx.canvas.width,
            this.drawingService.baseCtx.canvas.height,
        );

        if (i < 0 || i >= img.data.length) return false; //out of bounds
        if (img.data[i + 3] === 0) return true; //surface is invisible

        if (
            targetcolor[3] === this.fillColorA &&
            targetcolor[0] === this.fillColorR &&
            targetcolor[1] === this.fillColorG &&
            targetcolor[2] === this.fillColorB
        )
            return false; //target is same as fill

        if (
            targetcolor[3] === img.data[i + 3] &&
            targetcolor[0] === img.data[i] &&
            targetcolor[1] === img.data[i + 1] &&
            targetcolor[2] === img.data[i + 2]
        )
            return true; //target matches surface

        if (
            Math.abs(targetcolor[3] - img.data[i + 3]) <= 255 - tolerance &&
            Math.abs(targetcolor[0] - img.data[i]) <= tolerance &&
            Math.abs(targetcolor[1] - img.data[i + 1]) <= tolerance &&
            Math.abs(targetcolor[2] - img.data[i + 2]) <= tolerance
        )
            return true; //target to surface within tolerance

        return false; //no match
    }

    pixelCompareAndSet(i: number, targetcolor: number[], tolerance: number) {
        if (this.pixelCompare(i, targetcolor, tolerance)) {
            let img: ImageData = this.drawingService.baseCtx.getImageData(
                0,
                0,
                this.drawingService.baseCtx.canvas.width,
                this.drawingService.baseCtx.canvas.height,
            );
            //fill the color
            img.data[i] = this.fillColorR;
            img.data[i + 1] = this.fillColorG;
            img.data[i + 2] = this.fillColorB;
            img.data[i + 3] = this.fillColorA;
            return true;
        }
        return false;
    }

    setFillColor() {
        let hexColor = this.colorService.getPrimaryColor();
        // console.log(this.colorService.getPrimaryColor());

        // 4 digits
        if (hexColor.length == 5) {
            this.fillColorR = parseInt('0x' + hexColor[1] + hexColor[1]);
            this.fillColorG = parseInt('0x' + hexColor[2] + hexColor[2]);
            this.fillColorB = parseInt('0x' + hexColor[3] + hexColor[3]);
            this.fillColorA = this.colorService.getPrimaryColorOpacity();
            //console.log(this.fillColorR + ' ' + this.fillColorG + ' ' + this.fillColorB + ' ' + (this.fillColorA * 255).toFixed(0));
            // 9 digits
        } else {
            this.fillColorR = parseInt('0x' + hexColor[1] + hexColor[2]);
            this.fillColorG = parseInt('0x' + hexColor[3] + hexColor[4]);
            this.fillColorB = parseInt('0x' + hexColor[5] + hexColor[6]);
            this.fillColorA = this.colorService.getPrimaryColorOpacity();

            //console.log(this.fillColorR + ' ' + this.fillColorG + ' ' + this.fillColorB + ' ' + (this.fillColorA * 255).toFixed(0));
        }
    } */
