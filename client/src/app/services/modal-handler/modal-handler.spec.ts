import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ModalHandlerService } from './modal-handler';

describe('ModalHandlerService', () => {
  let service: ModalHandlerService;
  let data: jasmine.SpyObj<MatDialog>;
  let drawingSpy: jasmine.SpyObj<DrawingService>;


  beforeEach(() => {
    drawingSpy = jasmine.createSpyObj('DrawingService', {
      shortcutEnable: true,
    })
    data = jasmine.createSpyObj('MatDialog', {
      open: true,
    });

    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [{ provide: DrawingService, useValue: drawingSpy }, { provide: MatDialogModule, useValue: data }],
    });
    service = TestBed.inject(ModalHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open dialog', () => {
    service.openDrawingCarouselDialog();
    expect(data.open).toHaveBeenCalled()
  });
});
