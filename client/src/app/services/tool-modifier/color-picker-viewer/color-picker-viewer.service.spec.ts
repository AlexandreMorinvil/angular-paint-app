/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { ColorPickerViewerService } from './color-picker-viewer.service';

describe('Service: ColorPickerViewer', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ColorPickerViewerService],
        });
    });

    it('should ...', inject([ColorPickerViewerService], (service: ColorPickerViewerService) => {
        expect(service).toBeTruthy();
    }));
});
