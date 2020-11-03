import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Drawing } from '@common/communication/drawing';
import { ApiImageTransferService } from './api-image-transfer.service';

describe('IndexService', () => {
    let httpMock: HttpTestingController;
    let service: ApiImageTransferService;
    let baseUrl: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(ApiImageTransferService);
        httpMock = TestBed.inject(HttpTestingController);
        // BASE_URL is private so we need to access it with its name as a key
        // Try to avoid this syntax which violates encapsulation
        // tslint:disable: no-string-literal
        baseUrl = service['BASE_URL'];
    });

    afterEach(() => {
        httpMock.verify();
    });

    // it('should return expected message (HttpClient called once)', () => {
    //     const expectedMessage: Drawing = { name: 'Drawing', tags: ['un', 'deux'], imageSrc: 'imageSrc' };

    //     // check the content of the mocked call
    //     service.basicGet().subscribe((response: Drawing) => {
    //         expect(response.name).toEqual(expectedMessage.name, 'Drawing');
    //         expect(response.image).toEqual(expectedMessage.image, new ImageData(100, 100));
    //     }, fail);

    //     const req = httpMock.expectOne(baseUrl);
    //     expect(req.request.method).toBe('GET');
    //     // actually send the request
    //     req.flush(expectedMessage);
    // });

    it('should not return any message when sending a POST request (HttpClient called once)', () => {
        const sentMessage: Drawing = { _id: '1', name: 'Drawing', tags: ['un', 'deux'], imageSrc: 'imageSrc' };
        // subscribe to the mocked call
        service.basicPost(sentMessage).subscribe(() => {}, fail);
        const req = httpMock.expectOne(baseUrl + '/send');
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush({});
    });

    // it('should handle http error safely', () => {
    //     service.basicGet().subscribe((response: Image) => {
    //         expect(response).toBeUndefined();
    //     }, fail);

    //     const req = httpMock.expectOne(baseUrl);
    //     expect(req.request.method).toBe('GET');
    //     req.error(new ErrorEvent('Random error occured'));
    // });
});
