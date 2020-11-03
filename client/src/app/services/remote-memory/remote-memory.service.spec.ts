import { TestBed } from '@angular/core/testing';
import { ApiDrawingService } from '@app/services/api/api-drawing/api-drawing.service';
import { RemoteMemoryService } from './remote-memory.service';




describe('RemoteMemoryService', () => {
  let service: RemoteMemoryService;
  //let api: ApiDrawingService;


  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [ApiDrawingService],
    });
    service = TestBed.inject(RemoteMemoryService);
    //api = TestBed.inject(ApiDrawingService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get drawings', () => {
    service.getAllFromDatabase().then();
    {
      expect(service.getDrawingsFromDatabase()[0]._id).not.toBe(5);
    }
  });
});
