import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiDrawingService } from '@app/services/api/api-drawing/api-drawing.service';
import { DrawingToDatabase } from '@common/communication/drawingtodatabase';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
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
    //mockApi = jasmine.createSpyObj('ApiDrawingService', ['getAll'])
    mockApi = jasmine.createSpyObj('ApiDrawingService', ['getAll', 'save', 'delete'])

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provides: ApiDrawingService, useValue: mockApi }],
    });
    service = TestBed.inject(RemoteMemoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the database', async () => {
    let spy = mockApi.getAll.and.returnValue(of(data));
    service.getAllFromDatabase().then; {
      expect(spy).toHaveBeenCalled();
    }
  });

  it('should save to the database', () => {
    let spy = mockApi.save.and.returnValue(of());
    service.saveToDatabase(data[0]);
    expect(spy).toHaveBeenCalled();
  });

  it('should delete from the database', async () => {
    let spy = mockApi.delete.and.returnValue(of(data[0].name));
    await service.deleteFromDatabase(data[0]._id)
    expect(spy).toHaveBeenCalled();
  });

  it('should get drawings', async () => {
    let Observable = of(data);
    mockApi.getAll.and.returnValue(Observable.pipe(take(1)));
    service.saveToDatabase(data[0]);
    expect(service.getDrawingsFromDatabase()).toBeDefined();
  });
});
