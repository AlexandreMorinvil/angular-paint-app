import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';
import { UserGuideModalService } from '@app/services/user-guide-modal/user-guide-modal.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    messageNewDrawing: string = 'Nouveau dessin\n(Raccourci: Ctr + O)';
    messageUserGuide: string = "Guide d'utilisation";
    messageBack: string = 'Retour';

    constructor(
        private toolboxSevice: ToolboxService,
        private drawingService: DrawingService,
        private router: Router,
        private userGuideModalService: UserGuideModalService,
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
        this.userGuideModalService.openUserGuide();
    }
}
