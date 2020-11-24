import { Component } from '@angular/core';
import { GridService } from '@app/services/tools/grid/grid.service';

@Component({
    selector: 'app-attribute-grid-display',
    templateUrl: './attribute-grid-display.component.html',
    styleUrls: ['./attribute-grid-display.component.scss', '../attributes-section.component.scss'],
})
export class AttributeGridDisplayComponent {
    constructor(private gridService: GridService) {}

    gridMessage(): string {
        if (this.gridService.isGridActivated()) return 'Désactiver';
        else return 'Activer';
    }

    onClick(): void {
        this.gridService.toogleGrid();
    }
}
