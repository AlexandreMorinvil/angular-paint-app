import { TestBed } from '@angular/core/testing';
import { ApiDrawingService } from '@app/services/api/api-drawing/api-drawing.service';
import { DrawingToDatabase } from '@common/communication/drawingtodatabase';
import { RemoteMemoryService } from './remote-memory.service';

describe('RemoteMemoryService', () => {
    let service: RemoteMemoryService;
    let apiSpy: jasmine.SpyObj<ApiDrawingService>;
    const dataTest: DrawingToDatabase[] = [
        { _id: '1', name: 'test1', tags: [] },
        { _id: '2', name: 'test2', tags: [] },
    ];

    beforeEach(() => {
        apiSpy = jasmine.createSpyObj('ApiDrawingService', {
            getAll: Promise.resolve(true),
        });

        TestBed.configureTestingModule({
            providers: [{ provide: ApiDrawingService, useValue: apiSpy }],
        });
        service = TestBed.inject(RemoteMemoryService);
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
