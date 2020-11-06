import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ColorPickerService } from '@app/services/tools/color-picker/color-picker.service';

@Component({
    selector: 'app-attribute-color-picker-viewer',
    templateUrl: './attribute-color-picker-viewer.component.html',
    styleUrls: ['./attribute-color-picker-viewer.component.scss'],
})
export class AttributeColorPickerViewerComponent implements AfterViewInit {
    @ViewChild('previewcanvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;

    private ctx: CanvasRenderingContext2D;
    SQUARE_DIM: number = 70;

    constructor(private colorPickerService: ColorPickerService) {}

    ngAfterViewInit(): void {
        this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.colorPickerService.currentPrevisualizationZoneSource.subscribe((data) => {
            const img = new ImageData(data, this.SQUARE_DIM, this.SQUARE_DIM);
            this.ctx.putImageData(img, 0, 0);
        });
    }
}
