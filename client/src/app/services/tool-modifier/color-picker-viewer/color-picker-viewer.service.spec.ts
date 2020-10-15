/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ColorPickerViewerService } from './color-picker-viewer.service';

describe('Service: ColorPickerViewer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColorPickerViewerService]
    });
  });

  it('should ...', inject([ColorPickerViewerService], (service: ColorPickerViewerService) => {
    expect(service).toBeTruthy();
  }));
});
