import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiDrawingService } from '@app/services/api/api-drawing/api-drawing.service';
import { DrawingToDatabase } from '@common/communication/drawing-to-database';
import { of } from 'rxjs';
import { RemoteMemoryService } from './remote-memory.service';

describe('RemoteMemoryService', () => {
    let service: RemoteMemoryService;
    const data: DrawingToDatabase[] = [{ _id: '1', name: 'test1', tags: ['a'] }];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ApiDrawingService],
        });
        service = TestBed.inject(RemoteMemoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call the database', (done) => {
        const spy = spyOn(service.apiDrawingService, 'getAll').and.returnValue(of(data));
        service.getAllFromDatabase().then(() => {
            expect(spy).toHaveBeenCalled();
            expect(service.getDrawingsFromDatabase()).toBeDefined();
            done();
        });
    });

    it('should save to the database', (done) => {
        const spy = spyOn(service.apiDrawingService, 'save').and.returnValue(of(void 0));
        service.saveToDatabase(data[0]).then(() => {
            expect(spy).toHaveBeenCalled();
            done();
        });
    });

    it('should delete from the database', (done) => {
        const spy = spyOn(service.apiDrawingService, 'delete').and.returnValue(of('void 0'));
        service.deleteFromDatabase(data[0]._id).then(() => {
            expect(spy).toHaveBeenCalled();
            done();
        });
    });
});
