import { Component, OnInit } from '@angular/core';
import { ToolboxService } from '@app/services/toolbox/toolbox.service';

@Component({
    selector: 'app-attribute-selection',
    templateUrl: './attribute-selection.component.html',
    styleUrls: ['./attribute-selection.component.scss'],
})
export class AttributeSelectionComponent implements OnInit {
    constructor(private toolboxService: ToolboxService) {}
    // tslint:disable:no-empty
    ngOnInit(): void {}

    onClick(): void {
        this.toolboxService.getCurrentTool().onCtrlADown();
    }
}
