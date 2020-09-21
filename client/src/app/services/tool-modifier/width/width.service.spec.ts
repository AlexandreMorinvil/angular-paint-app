import { TestBed } from '@angular/core/testing';

import { WidthService } from './width.service';

describe('WidthService', () => {
  let service: WidthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
