import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { WorkzoneSizeService } from '@app/services/workzone-size-service/workzone-size.service';
const TOOL_BOX_WIDTH = 266;
const SIDEBARWIDTH = 95;
@Component({
    selector: 'app-workspace',
    templateUrl: './workspace.component.html',
    styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent implements AfterViewInit {
    @ViewChild('workzonecontainer', { static: false }) workzoneContainer: ElementRef<HTMLDivElement>;
    constructor(public workZoneSizeService: WorkzoneSizeService) {}

    ngAfterViewInit(): void {
        this.workZoneSizeService.currentWorkzoneDimension.subscribe((dimension) => {
            this.workzoneContainer.nativeElement.style.width = (window.innerWidth - TOOL_BOX_WIDTH - SIDEBARWIDTH).toString() + 'px';
            this.workzoneContainer.nativeElement.style.height = window.innerHeight.toString() + 'px';
        });
    }
}
