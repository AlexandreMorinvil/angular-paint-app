import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ClipBoardService } from '@app/services/clipboard/clipboard.service';
import { DrawingStateTrackerService } from '@app/services/drawing-state-tracker/drawing-state-tracker.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MagnetismService } from '@app/services/magnetism/magnetism.service';
import { ModalHandlerService } from '@app/services/modal-handler/modal-handler';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';
import { GridService } from '@app/services/tools/grid/grid.service';
import { RectangleSelectionService } from '@app/services/tools/selection/rectangle-selection.service';
import { SelectionToolService } from '@app/services/tools/selection/selection-tool.service';
import { TextService } from '@app/services/tools/text/text.service';
import { WorkzoneSizeService } from '@app/services/workzone-size-service/workzone-size.service';

export const DEFAULT_WIDTH = 1000;
export const DEFAULT_HEIGHT = 800;
const TOOL_BOX_WIDTH = 313;
const SIDEBARWIDTH = 95;
@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit {
    @ViewChild('clipboardCanvas', { static: false }) clipboardCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('editCanvas', { static: false }) editCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('gridCanvas', { static: false }) gridCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('selectionCanvas', { static: false }) selectionCanvas: ElementRef<HTMLCanvasElement>;

    readonly BACKSPACE_KEYCODE: number = 32;
    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;
    private editCtx: CanvasRenderingContext2D;
    private gridCtx: CanvasRenderingContext2D;
    private clipboardCtx: CanvasRenderingContext2D;
    private selectionCtx: CanvasRenderingContext2D;
    hasBeenDrawnOnto: boolean;

    constructor(
        public modalHandlerService: ModalHandlerService,
        private drawingService: DrawingService,
        public toolbox: ToolboxService,
        private workzoneSizeService: WorkzoneSizeService,
        private drawingStateTrackerService: DrawingStateTrackerService,
        private gridService: GridService,
        private magnetismService: MagnetismService,
        private clipboardService: ClipBoardService,
        private rectangleSelectionService: RectangleSelectionService,
    ) {}
    // tslint:disable:no-magic-numbers
    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.editCtx = this.editCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridCtx = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.clipboardCtx = this.clipboardCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.selectionCtx = this.selectionCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.selectionCtx = this.selectionCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;
        this.editCtx.canvas.width = window.innerWidth - TOOL_BOX_WIDTH - SIDEBARWIDTH;
        this.editCtx.canvas.height = window.innerHeight - 5;
        this.gridCtx.canvas.width = this.baseCtx.canvas.width;
        this.gridCtx.canvas.height = this.baseCtx.canvas.height;
        this.drawingService.hasBeenDrawnOnto = false;
        this.gridService.gridCtx = this.gridCtx;
        this.gridService.gridCanvas = this.gridCanvas.nativeElement;
        this.clipboardService.clipboardCtx = this.clipboardCtx;
        this.clipboardService.canvas = this.clipboardCanvas.nativeElement;
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
        this.editCtx.canvas.width = window.innerWidth - TOOL_BOX_WIDTH - SIDEBARWIDTH;
        this.editCtx.canvas.height = window.innerHeight;
    }

    @HostListener('document:keydown.control.o', ['$event'])
    createNewDrawingKeyboardEvent(event: KeyboardEvent): void {
        event.preventDefault();
        this.resetDrawing();
    }

    @HostListener('mousewheel', ['$event'])
    onMouseWheel(event: WheelEvent): void {
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
    // The disablement of the "cyclomatic-complexity" tslint rule is justified in this situation
    // since it is required for the program to have a number of linearly independents paths that is high
    // tslint:disable:cyclomatic-complexity
    @HostListener('window:keyup', ['$event'])
    keyEventUp(event: KeyboardEvent): void {
        const IS_CTRL_KEY: boolean = event.ctrlKey;
        if (this.drawingService.shortcutEnable && !IS_CTRL_KEY) {
            for (const i in this.toolbox.getAvailableTools()) {
                if (this.toolbox.getAvailableTools()[i].shortcut === event.key.toLowerCase()) {
                    this.toolbox.setSelectedTool(this.toolbox.getAvailableTools()[i]);
                }
            }
        }

        const keyCode: string = event.key;
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
            case 'Backspace': // || event.keyCode === this.BACKSPACE_KEYCODE:
                if (SHORT_CUT_ENABLE) {
                    this.toolbox.getCurrentTool().onBackspaceDown(event);
                }
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowDown':
                this.toolbox.getCurrentTool().onArrowUp(event);
                break;
            case 'Alt':
                event.preventDefault(); // to prevent key of windows
                this.toolbox.getCurrentTool().onAltUp(event);
                break;
            default:
                return;
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
        const KEY_CODE: string = event.key;
        const KEY_CODE_LOWER_CASE = KEY_CODE.toLowerCase();
        const IS_CTRL_KEY: boolean = event.ctrlKey;
        const IS_SHIFT_KEY: boolean = event.shiftKey;
        const SHORT_CUT_ENABLE: boolean = this.drawingService.shortcutEnable;

        if (!KEY_CODE) {
            return;
        }

        switch (KEY_CODE) {
            case 'Shift':
                this.toolbox.getCurrentTool().onShiftDown(event);
                break;
            case 'Escape':
                this.toolbox.getCurrentTool().onEscapeDown(event);
                this.hasBeenDrawnOnto = true;
                break;
            case 'Alt':
                event.preventDefault(); // to prevent key of windows
                this.toolbox.getCurrentTool().onAltDown(event);
                break;
            case 'Delete':
                event.preventDefault(); // to prevent key of windows
                if (this.toolbox.getCurrentTool() instanceof SelectionToolService) (this.toolbox.getCurrentTool() as SelectionToolService).delete();
                break;
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
            case 'ArrowDown':
                event.preventDefault(); // to prevent key of windows
                this.toolbox.getCurrentTool().onArrowDown(event);
                break;
        }

        if (IS_CTRL_KEY) {
            if (IS_SHIFT_KEY) {
                if (KEY_CODE_LOWER_CASE === 'z') {
                    event.preventDefault(); // to prevent key of windows
                    this.drawingStateTrackerService.onCtrlShiftZDown();
                }
            } else {
                switch (KEY_CODE_LOWER_CASE) {
                    case 'z':
                        event.preventDefault(); // to prevent key of windows
                        this.drawingStateTrackerService.onCtrlZDown();
                        break;
                    case 'a':
                        event.preventDefault(); // to prevent key of windows
                        this.toolbox.getCurrentTool().onCtrlADown();
                        break;
                    case 'c':
                        event.preventDefault(); // to prevent key of windows
                        if (this.toolbox.getCurrentTool() instanceof SelectionToolService)
                            (this.toolbox.getCurrentTool() as SelectionToolService).copy();
                        break;
                    case 'x':
                        event.preventDefault(); // to prevent key of windows
                        if (this.toolbox.getCurrentTool() instanceof SelectionToolService)
                            (this.toolbox.getCurrentTool() as SelectionToolService).cut();
                        break;
                    case 'v':
                        event.preventDefault(); // to prevent key of windows
                        if (this.toolbox.getCurrentTool() instanceof SelectionToolService) {
                            this.toolbox.setSelectedTool(this.rectangleSelectionService);
                            (this.toolbox.getCurrentTool() as SelectionToolService).paste();
                        }
                        break;
                    default:
                        break;
                }
                if (SHORT_CUT_ENABLE) {
                    switch (KEY_CODE_LOWER_CASE) {
                        case 's':
                            event.preventDefault(); // to prevent key of windows
                            this.modalHandlerService.openSaveDialog();
                            break;
                        case 'g':
                            event.preventDefault(); // to prevent key of windows
                            this.modalHandlerService.openDrawingCarouselDialog();
                            break;
                        case 'e':
                            event.preventDefault(); // to prevent key of windows
                            this.modalHandlerService.openExportDialog();
                            break;
                    }
                }
            }
        } else {
            if (!SHORT_CUT_ENABLE) return;
            switch (KEY_CODE_LOWER_CASE) {
                case 'g':
                    this.gridService.toogleGrid();
                    break;
                case '+':
                    this.gridService.incrementSpacing();
                    break;
                case '-':
                    this.gridService.decrementSpacing();
                    break;
                case 'm':
                    this.magnetismService.toogleMagnetism();
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
