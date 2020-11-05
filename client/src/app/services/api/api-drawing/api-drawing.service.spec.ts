import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DrawingToDatabase } from '@common/communication/drawing-to-database';
import { ApiDrawingService, BASE_URL } from './api-drawing.service';

fdescribe('ApiDrawingService', () => {
    let httpMock: HttpTestingController;
    let service: ApiDrawingService;
    let baseUrl: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(ApiDrawingService);
        httpMock = TestBed.inject(HttpTestingController);
        // BASE_URL is private so we need to access it with its name as a key
        // Try to avoid this syntax which violates encapsulation
        // tslint:disable: no-string-literal
        baseUrl = BASE_URL;
    });

    afterEach(() => {
        httpMock.verify();
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return expected message (HttpClient called once)', () => {
        console.log('allo');
        const data: DrawingToDatabase[] = [{ _id: '1', name: 'test', tags: [] }];
        // check the content of the mocked call
        service.getAll().subscribe((drawings) => {
            expect(drawings[0]._id).toBe(data[0]._id);
        });

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(data);
    });

    it('should post message (HttpClient called once)', () => {
        console.log('allo');
        const data: DrawingToDatabase[] = [{ _id: '1', name: 'test', tags: [] }];
        service.save(data[0]).subscribe();
        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(data[0]);
    });

    it('should delete expected message (HttpClient called once)', () => {
        console.log('allo');
        const data: DrawingToDatabase[] = [{ _id: '1', name: 'test', tags: [] }];
        // check the content of the mocked call
        service.delete(data[0]._id).subscribe();
        const req = httpMock.expectOne(baseUrl + data[0]._id);
        expect(req.request.method).toBe('DELETE');
        // actually send the request
        req.flush(data);
    });

    it('should handle http error safely', () => {
        service.getAll().subscribe((drawings) => {
            expect(drawings).toBeUndefined();
        });

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('GET');
        req.error(new ErrorEvent('Random error occured'));
    });
});
//     it('should not return any message when sending a POST request (HttpClient called once)', () => {
//         const sentMessage: Message = { body: 'Hello', title: 'World' };
//         // subscribe to the mocked call
//         // tslint:disable-next-line: no-empty
//         service.basicPost(sentMessage).subscribe(() => {}, fail);

//         const req = httpMock.expectOne(baseUrl + '/send');
//         expect(req.request.method).toBe('POST');
//         // actually send the request
//         req.flush(sentMessage);
//     });

//     it('should handle http error safely', () => {
//         service.basicGet().subscribe((response: Message) => {
//             expect(response).toBeUndefined();
//         }, fail);

//         const req = httpMock.expectOne(baseUrl);
//         expect(req.request.method).toBe('GET');
//         req.error(new ErrorEvent('Random error occured'));
//     });
// });
