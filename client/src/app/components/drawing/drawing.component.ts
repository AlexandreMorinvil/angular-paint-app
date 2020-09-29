// import { variable } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';
import { WorkzoneSizeService } from '@app/services/workzone-size-service/workzone-size.service';

// TODO : Avoir un fichier séparé pour les constantes ?
export const DEFAULT_WIDTH = 1000;
export const DEFAULT_HEIGHT = 800;
@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('editCanvas', { static: false }) editCanvas: ElementRef<HTMLCanvasElement>;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private editCtx: CanvasRenderingContext2D;

    hasBeenDrawnOnto: boolean;

    constructor(private drawingService: DrawingService, public toolbox: ToolboxService, private workzoneSizeService: WorkzoneSizeService) {}

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.editCtx = this.editCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.editCtx.canvas.width = window.innerWidth;
        this.editCtx.canvas.height = window.innerHeight;
        this.drawingService.hasBeenDrawnOnto = false;
    }

    resetDrawing(): void {
        this.drawingService.clearCanvas(this.baseCtx);
        this.drawingService.clearCanvas(this.previewCtx);
        this.drawingService.hasBeenDrawnOnto = false;
    }

    resetDrawingWithWarning(): void {
        if (!this.drawingService.hasBeenDrawnOnto) {
            this.resetDrawing();
        } else if (confirm('Voulez-vous abandonner le dessin en cours?')) {
            this.resetDrawing();
        }
    }

    @HostListener('document:keydown.control.o', ['$event'])
    createNewDrawingKeyboardEvent(event: KeyboardEvent): void {
        event.preventDefault();

        this.resetDrawingWithWarning();
    }

    @HostListener('mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.toolbox.getCurrentTool().onMouseMove(event);
    }

    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.toolbox.getCurrentTool().onMouseDown(event);
        this.drawingService.hasBeenDrawnOnto = true;
    }

    @HostListener('mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.toolbox.getCurrentTool().onMouseUp(event);
    }

    @HostListener('click', ['$event'])
    onMouseClick(event: MouseEvent): void {
        this.toolbox.getCurrentTool().onMouseClick(event);
    }

    @HostListener('dblclick', ['$event'])
    onMouseDblClick(event: MouseEvent): void {
        this.toolbox.getCurrentTool().onMouseDblClick(event);
    }

    @HostListener('window:keyup', ['$event'])
    keyEventUp(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.toolbox.getCurrentTool().onShiftUp(event);
        } else if (event.key === 'Backspace') {
            this.toolbox.getCurrentTool().onBackspaceDown(event);
        } else {
            for (const i in this.toolbox.getAvailableTools()) {
                if (this.toolbox.getAvailableTools()[i].shortcut === event.key.toLowerCase()) {
                    this.toolbox.setSelectedTool(this.toolbox.getAvailableTools()[i]);
                }
            }
        }
    }

    @HostListener('window:keydown', ['$event'])
    onShiftDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.toolbox.getCurrentTool().onShiftDown(event);
        } else if (event.key == 'Escape') {
            this.toolbox.getCurrentTool().onEscapeDown(event);
            this.hasBeenDrawnOnto = true;
        }
    }

    get width(): number {
        // return this.canvasSize.x;
        return this.workzoneSizeService.drawingZoneWidth;
    }

    get height(): number {
        // return this.canvasSize.y;
        return this.workzoneSizeService.drawingZoneHeight;
    }
}
