import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { ApiDrawingService } from '@app/services/api/api-drawing/api-drawing.service';
import { DrawingToDatabase } from '@common/communication/drawingtodatabase';
import { of } from 'rxjs';
import { RemoteMemoryService } from './remote-memory.service';



class ApiDrawingServiceMock extends ApiDrawingService { }


describe('RemoteMemoryService', () => {
  let service: RemoteMemoryService;
  let mockApi: ApiDrawingServiceMock;
  const data: DrawingToDatabase[] = [{ _id: "1", name: "test1", tags: [] }]



  beforeEach(() => {
    mockApi = new ApiDrawingServiceMock({} as HttpClient);


    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provides: ApiDrawingService, useValue: mockApi }],
    });
    service = TestBed.inject(RemoteMemoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the database', async(() => {
    let spy = spyOn(mockApi, 'getAll').and.returnValue(of(data));
    service.getAllFromDatabase().then(() => {
      expect(spy).toHaveBeenCalled();
      expect(service.getDrawingsFromDatabase()).toBeDefined();
    });
  }));

  it('should save to the database', async () => {
    let spy = spyOn(mockApi, 'save').and.returnValue(of());
    service.saveToDatabase(data[0]).then(() => {
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should delete from the database', async () => {
    let spy = spyOn(mockApi, 'delete').and.returnValue(of());
    service.deleteFromDatabase(data[0]._id).then(() => {
      expect(spy).toHaveBeenCalled();
    });
  });


});
