import { Component } from '@angular/core';
@Component({
    selector: 'app-attribute-selection-manipulation',
    templateUrl: './attribute-selection-manipulation.component.html',
    styleUrls: ['./attribute-selection-manipulation.component.scss', '../attributes-section.component.scss'],
})
export class AttributeSelectionManipulationComponent {
    constructor() {}

    copy(): void {
        console.log('COPY');
    }

    paste(): void {
        console.log('PASTE');
    }

    cut(): void {
        console.log('CUT');
    }

    delete(): void {
        console.log('DELETE');
    }
}
