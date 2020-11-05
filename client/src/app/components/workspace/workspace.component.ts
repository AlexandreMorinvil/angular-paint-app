import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { WorkzoneSizeService } from '@app/services/workzone-size-service/workzone-size.service';

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
            this.workzoneContainer.nativeElement.style.width = dimension.width.toString() + 'px';
            this.workzoneContainer.nativeElement.style.height = dimension.height.toString() + 'px';
        });
    }
}
