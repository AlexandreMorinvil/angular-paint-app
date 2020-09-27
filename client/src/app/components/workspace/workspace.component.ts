import { Component } from '@angular/core';
import { WorkzoneSizeService } from '@app/services/workzone-size-service/workzone-size.service';

@Component({
    selector: 'app-workspace',
    templateUrl: './workspace.component.html',
    styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent {
    constructor(public workZoneSizeService: WorkzoneSizeService) {}
}
