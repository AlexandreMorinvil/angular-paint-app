import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ModalHandlerService } from '@app/services/modal-handler/modal-handler';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';
import { WorkzoneSizeService } from '@app/services/workzone-size-service/workzone-size.service';

export const DEFAULT_WIDTH = 1000;
export const DEFAULT_HEIGHT = 800;
@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('editCanvas', { static: false }) editCanvas: ElementRef<HTMLCanvasElement>;

    readonly BACKSPACE_KEYCODE: number = 32;
    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private editCtx: CanvasRenderingContext2D;
    private TOOL_BOX_WIDTH: number = 313;
    hasBeenDrawnOnto: boolean;

    constructor(
        public modalHandlerService: ModalHandlerService,
        private drawingService: DrawingService,
        public toolbox: ToolboxService,
        private workzoneSizeService: WorkzoneSizeService,
        private drawingStateTrackerService: DrawingStateTrackerService,
    ) {}

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.editCtx = this.editCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.editCtx.canvas.width = window.innerWidth - this.TOOL_BOX_WIDTH;
        this.editCtx.canvas.height = window.innerHeight;
        this.drawingService.hasBeenDrawnOnto = false;
        // Fills the canvas with white
        this.baseCtx.fillStyle = '#FFFFFF';
        this.baseCtx.fillRect(0, 0, this.baseCtx.canvas.width, this.baseCtx.canvas.height);
    }

    resetDrawing(): void {
        this.drawingService.resetDrawingWithWarning();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.workzoneSizeService.onResize();
        this.editCtx.canvas.width = window.innerWidth - this.TOOL_BOX_WIDTH;
        this.editCtx.canvas.height = window.innerHeight;
    }

    @HostListener('document:keydown.control.o', ['$event'])
    createNewDrawingKeyboardEvent(event: KeyboardEvent): void {
        event.preventDefault();
        this.resetDrawing();
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

    @HostListener('wheel', ['$event'])
    onMouseScroll(event: WheelEvent): void {
        if (event.deltaY < 0) {
            this.toolbox.getCurrentTool().onMouseScrollUp(event);
        } else if (event.deltaY > 0) {
            this.toolbox.getCurrentTool().onMouseScrollDown(event);
        }
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
            if (this.drawingService.shortcutEnable) {
                this.toolbox.getCurrentTool().onShiftUp(event);
            }
            // The deprecation warning is justified in this case because some operating systems
            // do recognize the keycodes while others will prefere the 'Backspace' reference
            // tslint:disable-next-line:deprecation
        } else if (event.key === 'Backspace' || event.keyCode === this.BACKSPACE_KEYCODE) {
            if (this.drawingService.shortcutEnable) {
                this.toolbox.getCurrentTool().onBackspaceDown(event);
            }
            // tslint:disable:prefer-switch
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            this.toolbox.getCurrentTool().onArrowUp(event);
        } else if (event.key == 'Alt') {
            event.preventDefault(); // to prevent key of windows
            this.toolbox.getCurrentTool().onAltUp(event);
        } else {
            if (this.drawingService.shortcutEnable) {
                for (const i in this.toolbox.getAvailableTools()) {
                    if (this.toolbox.getAvailableTools()[i].shortcut === event.key.toLowerCase()) {
                        this.toolbox.setSelectedTool(this.toolbox.getAvailableTools()[i]);
                    }
                }
            }
        }
    }
    // The disablement of the "cyclomatic-complexity" tslint rule is justified in this situation
    // since it is required for the program to have a number of linearly independents paths that is high
    // tslint:disable:cyclomatic-complexity
    @HostListener('window:keydown', ['$event'])
    onShiftDown(event: KeyboardEvent): void {
        if (event.key === 'Shift') {
            this.toolbox.getCurrentTool().onShiftDown(event);
        } else if (event.key === 'Escape') {
            this.toolbox.getCurrentTool().onEscapeDown(event);
            this.hasBeenDrawnOnto = true;
        } else if (event.key == 'Alt') {
            event.preventDefault(); // to prevent key of windows
            this.toolbox.getCurrentTool().onAltDown(event);
        } else if (event.ctrlKey && event.key.toLowerCase() === 's' && this.drawingService.shortcutEnable) {
            event.preventDefault(); // to prevent key of windows
            this.modalHandlerService.openSaveDialog();
        } else if (event.ctrlKey && event.key.toLowerCase() === 'g' && this.drawingService.shortcutEnable) {
            event.preventDefault(); // to prevent key of windows
            this.modalHandlerService.openDrawingCarouselDialog();
        } else if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'z') {
            event.preventDefault(); // to prevent key of windows
            this.drawingStateTrackerService.onCtrlShiftZDown();
        } else if (event.ctrlKey && event.key.toLowerCase() === 'z') {
            event.preventDefault(); // to prevent key of windows
            this.drawingStateTrackerService.onCtrlZDown();
        } else if (event.ctrlKey && event.key.toLowerCase() === 'e' && this.drawingService.shortcutEnable) {
            event.preventDefault(); // to prevent key of windows
            this.modalHandlerService.openExportDialog();
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault(); // to prevent key of windows
            this.toolbox.getCurrentTool().onArrowDown(event);
        } else if (event.ctrlKey && event.key.toLowerCase() === 'a') {
            event.preventDefault(); // to prevent key of windows
            this.toolbox.getCurrentTool().onCtrlADown();
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
