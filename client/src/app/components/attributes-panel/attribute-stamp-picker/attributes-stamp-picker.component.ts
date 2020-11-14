import { Component } from '@angular/core';
import { StampPickerService } from '@app/services/tool-modifier/stamp-picker/stamp-picker.service';
@Component({
    selector: 'app-attribute-stamp-picker',
    templateUrl: './attributes-stamp-picker.component.html',
    styleUrls: ['./attributes-stamp-picker.component.scss', '../attributes-section.component.scss'],
})
export class AttributeStampPickerComponent {
    stamp: string;

    constructor(private stampPickerService: StampPickerService) {
        this.stamp = this.stampPickerService.getStamp();
    }

    getListStamps(): string[] {
        return this.stampPickerService.getListStamps();
    }

    assign(): void {
        this.stampPickerService.setStamp(this.stamp);
    }

    revert(): void {
        this.stamp = this.stampPickerService.getStamp();
    }

    needConfirmation(): boolean {
        return this.stamp !== this.stampPickerService.getStamp();
    }
}
