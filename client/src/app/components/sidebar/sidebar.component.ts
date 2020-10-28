import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ModalHandlerService } from '@app/services/modal-handler/modal-handler';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    messageNewDrawing: string = 'Nouveau dessin\n(Raccourci: Ctr + O)';
    messageUserGuide: string = "Guide d'utilisation";
    messageBack: string = 'Retour';
    messageExportDialog: string = 'Exporter\n(Raccourci: Ctr + E)';
    messageSaveDialog: string = 'Sauvegarder\n(Raccourci: Ctr + S)';

    constructor(
        private toolboxSevice: ToolboxService,
        private drawingService: DrawingService,
        private router: Router,
        private modalHandler: ModalHandlerService,
    ) {}

    getListOfTools(): Tool[] {
        return this.toolboxSevice.getAvailableTools();
    }

    getCurrentTool(): Tool {
        return this.toolboxSevice.getCurrentTool();
    }

    setCurrentTool(tool: Tool): void {
        this.toolboxSevice.setSelectedTool(tool);
    }

    formatTooltipMessage(tool: Tool): string {
        return 'Outil : ' + tool.name + '\n( Raccourci: ' + tool.shortcut + ' )';
    }

    navigateToMain(): void {
        this.router.navigate(['home']);
    }

    resetDrawing(): void {
        this.drawingService.resetDrawingWithWarning();
    }

    openGuide(): void {
        this.modalHandler.openUserGuide();
    }

    saveDialog(): void {
        this.modalHandler.openSaveDialog();
    }
    openExportDialog(): void {
        this.modalHandler.openExportDialog();
    }
}
