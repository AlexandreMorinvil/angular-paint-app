import { TestBed } from '@angular/core/testing';

import { SidesService } from './sides.service';

describe('SidesService', () => {
  let service: SidesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SidesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
