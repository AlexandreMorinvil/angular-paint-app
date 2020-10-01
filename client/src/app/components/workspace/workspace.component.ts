import { Component, OnInit } from '@angular/core';
import { WorkzoneSizeService } from '@app/services/workzone-size-service/workzone-size.service';

@Component({
    selector: 'app-workspace',
    templateUrl: './workspace.component.html',
    styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent implements OnInit {
    constructor(public workZoneSizeService: WorkzoneSizeService) {}

    ngOnInit(): void {
        this.workZoneSizeService.currentWorkzoneDimension.subscribe((dimension) => {
            const elem = document.getElementById('workzone-container');
            if (elem) {
                elem.style.width = dimension.width.toString() + 'px';
                elem.style.height = dimension.height.toString() + 'px';
            }
        });
    }
}
