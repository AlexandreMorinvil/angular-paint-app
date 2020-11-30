import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { TextService } from './text.service';

// tslint:disable:no-any
describe('TextService', () => {
  let service: TextService;


  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [{ provide: DrawingService, useValue: jasmine.createSpyObj('DrawingService', ['resize']) }],
    });
    service = TestBed.inject(TextService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
})
