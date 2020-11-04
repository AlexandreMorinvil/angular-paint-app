import { TestBed } from '@angular/core/testing';
import { ApiDrawingService } from '@app/services/api/api-drawing/api-drawing.service';
import { DrawingToDatabase } from '@common/communication/drawingtodatabase';
import { RemoteMemoryService } from './remote-memory.service';

/*
export class mockApi {
  //private drawingsFromDatabase: DrawingToDatabase[];
  mockApi() { };
  getAll(): Observable<DrawingToDatabase[]> {
    const data: DrawingToDatabase[] = [{ _id: "1", name: "test1", tags: [] }]
    return of(data)
  };
}
*/

describe('RemoteMemoryService', () => {
  let service: RemoteMemoryService;
  let mockApi: jasmine.SpyObj<ApiDrawingService>;
  const data: DrawingToDatabase[] = [{ _id: "1", name: "test1", tags: [] }]



  beforeEach(() => {
    mockApi = jasmine.createSpyObj('ApiDrawingService', ['getAll'])
    TestBed.configureTestingModule({
      providers: [{ provides: ApiDrawingService, useValue: mockApi }],
    });
    service = TestBed.inject(RemoteMemoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get drawings', () => {
    service.getAllFromDatabase().then(); {
      expect(service.getDrawingsFromDatabase()[0]._id).not.toBe(5);
    };
  });
});
