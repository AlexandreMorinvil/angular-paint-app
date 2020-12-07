import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ModalHandlerService } from '@app/services/modal-handler/modal-handler';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';
import { GridService } from '@app/services/tools/grid/grid.service';
import { TextService } from '@app/services/tools/text/text.service';
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
    @ViewChild('gridCanvas', { static: false }) gridCanvas: ElementRef<HTMLCanvasElement>;

    readonly BACKSPACE_KEYCODE: number = 32;
    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private editCtx: CanvasRenderingContext2D;
    private gridCtx: CanvasRenderingContext2D;
    private TOOL_BOX_WIDTH: number = 313;
    hasBeenDrawnOnto: boolean;

    constructor(
        public modalHandlerService: ModalHandlerService,
        private drawingService: DrawingService,
        public toolbox: ToolboxService,
        private workzoneSizeService: WorkzoneSizeService,
        private drawingStateTrackerService: DrawingStateTrackerService,
        private gridService: GridService,
    ) {}

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.editCtx = this.editCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridCtx = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.editCtx.canvas.width = window.innerWidth - this.TOOL_BOX_WIDTH;
        this.editCtx.canvas.height = window.innerHeight;
        this.drawingService.hasBeenDrawnOnto = false;
        this.gridService.gridCtx = this.gridCtx;
        this.gridService.gridCanvas = this.gridCanvas.nativeElement;
        // Fills the canvas with white
        this.baseCtx.fillStyle = '#FFFFFF';
        this.baseCtx.fillRect(0, 0, this.baseCtx.canvas.width, this.baseCtx.canvas.height);
        this.gridService.resetGrid();
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

    @HostListener('mousewheel', ['$event'])
    onMousewheel(event: WheelEvent): void {
        event.preventDefault(); // to prevent key of windows
        this.toolbox.getCurrentTool().onMouseWheel(event);
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
        if (this.drawingService.shortcutEnable) {
            for (const i in this.toolbox.getAvailableTools()) {
                if (this.toolbox.getAvailableTools()[i].shortcut === event.key.toLowerCase()) {
                    this.toolbox.setSelectedTool(this.toolbox.getAvailableTools()[i]);
                }
            }
        }

        const keyCode: String = event.key;
        const SHORT_CUT_ENABLE: boolean = this.drawingService.shortcutEnable;
        if (!keyCode) {
            return;
        }

        switch (keyCode) {
            case 'Shift':
                if (SHORT_CUT_ENABLE) {
                    this.toolbox.getCurrentTool().onShiftUp(event);
                }
                break;
            case 'Backspace' || event.keyCode === this.BACKSPACE_KEYCODE:
                if (SHORT_CUT_ENABLE) {
                    this.toolbox.getCurrentTool().onBackspaceDown(event);
                }
                break;
            case 'ArrowLeft' || 'ArrowRight' || 'ArrowUp' || 'ArrowDown':
                this.toolbox.getCurrentTool().onArrowUp(event);
                break;
            case 'Alt':
                event.preventDefault(); // to prevent key of windows
                this.toolbox.getCurrentTool().onAltUp(event);
                break;
            default:
                if (!SHORT_CUT_ENABLE) return;
                for (const i in this.toolbox.getAvailableTools()) {
                    if (this.toolbox.getAvailableTools()[i].shortcut === keyCode.toLowerCase()) {
                        this.toolbox.setSelectedTool(this.toolbox.getAvailableTools()[i]);
                    }
                }
        }
    }
    // The disablement of the "cyclomatic-complexity" tslint rule is justified in this situation
    // since it is required for the program to have a number of linearly independents paths that is high
    // tslint:disable:cyclomatic-complexity
    @HostListener('window:keydown', ['$event'])
    onShiftDown(event: KeyboardEvent): void {
        if (this.toolbox.getCurrentTool() instanceof TextService) {
            event.preventDefault();
            this.toolbox.getCurrentTool().onKeyDown(event);
        }

        const KEY_CODE: String = event.key;
        const KEY_CODE_LOWER_CASE = KEY_CODE.toLowerCase();
        const IS_CTRL_KEY: boolean = event.ctrlKey;
        const IS_SHIFT_KEY: boolean = event.shiftKey;
        const SHORT_CUT_ENABLE: boolean = this.drawingService.shortcutEnable;

        if (!KEY_CODE) {
            return;
        }

        if (KEY_CODE === 'Shift') {
            this.toolbox.getCurrentTool().onShiftDown(event);
        } else if (KEY_CODE === 'Escape') {
            this.toolbox.getCurrentTool().onEscapeDown(event);
            this.hasBeenDrawnOnto = true;
        } else if (KEY_CODE === 'Alt') {
            event.preventDefault(); // to prevent key of windows
            this.toolbox.getCurrentTool().onAltDown(event);
        } else if (KEY_CODE === 'ArrowLeft' || KEY_CODE === 'ArrowRight' || KEY_CODE === 'ArrowUp' || KEY_CODE === 'ArrowDown') {
            event.preventDefault(); // to prevent key of windows
            this.toolbox.getCurrentTool().onArrowDown(event);
        }

        if (IS_CTRL_KEY) {
            if (SHORT_CUT_ENABLE) {
                if (KEY_CODE_LOWER_CASE === 's') {
                    event.preventDefault(); // to prevent key of windows
                    this.modalHandlerService.openSaveDialog();
                } else if (KEY_CODE_LOWER_CASE === 'g') {
                    event.preventDefault(); // to prevent key of windows
                    this.modalHandlerService.openDrawingCarouselDialog();
                } else if (KEY_CODE_LOWER_CASE === 'e') {
                    event.preventDefault(); // to prevent key of windows
                    this.modalHandlerService.openExportDialog();
                }
            } else if (IS_SHIFT_KEY) {
                if (KEY_CODE_LOWER_CASE === 'z') {
                    event.preventDefault(); // to prevent key of windows
                    this.drawingStateTrackerService.onCtrlShiftZDown();
                }
            } else {
                if (KEY_CODE_LOWER_CASE === 'z') {
                    event.preventDefault(); // to prevent key of windows
                    this.drawingStateTrackerService.onCtrlZDown();
                } else if (KEY_CODE_LOWER_CASE === 'a') {
                    event.preventDefault(); // to prevent key of windows
                    this.toolbox.getCurrentTool().onCtrlADown();
                }
            }
        } else {
            if (!SHORT_CUT_ENABLE) return;
            if (KEY_CODE_LOWER_CASE === 'g') {
                this.gridService.toogleGrid();
            } else if (KEY_CODE_LOWER_CASE === '+') {
                this.gridService.incrementSpacing();
            } else if (KEY_CODE_LOWER_CASE === '-') {
                this.gridService.decrementSpacing();
            }
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
