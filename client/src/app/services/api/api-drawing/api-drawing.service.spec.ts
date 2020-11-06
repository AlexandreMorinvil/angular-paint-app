import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DrawingToDatabase } from '@common/communication/drawing-to-database';
import { ApiDrawingService, BASE_URL } from './api-drawing.service';

describe('ApiDrawingService', () => {
    let httpMock: HttpTestingController;
    let service: ApiDrawingService;
    let baseUrl: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(ApiDrawingService);
        httpMock = TestBed.inject(HttpTestingController);
        baseUrl = BASE_URL;
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should perform a HTTP GET request to take all the drawings', () => {
        const expectedDrawings: DrawingToDatabase[] = [new DrawingToDatabase(), new DrawingToDatabase()];

        service.getAll().subscribe((response: DrawingToDatabase[]) => {
            expect(Array.isArray(response)).toEqual(true);
        }, fail);
        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('GET');
        req.flush(expectedDrawings);
    });

    it('should perform a HTTP GET request to get a drawing by its ID', () => {
        const id = '1';
        const expectedDrawing: DrawingToDatabase = new DrawingToDatabase(id, 'abc', ['a', 'b']);

        service.getById(id).subscribe((response: DrawingToDatabase) => {
            expect(response._id).toEqual(expectedDrawing._id);
            expect(response.name).toEqual(expectedDrawing.name);
        }, fail);
        const req = httpMock.expectOne(baseUrl + id);
        expect(req.request.method).toBe('GET');
        req.flush(expectedDrawing);
    });

    it('should perform a HTTP GET request to get all drawings having a given name', () => {
        const name = 'abc';
        const expectedDrawings: DrawingToDatabase[] = [new DrawingToDatabase(), new DrawingToDatabase()];

        service.getByName(name).subscribe((response: DrawingToDatabase[]) => {
            expect(Array.isArray(response)).toEqual(true);
        }, fail);
        const req = httpMock.expectOne(baseUrl + 'name/' + name);
        expect(req.request.method).toBe('GET');
        req.flush(expectedDrawings);
    });

    it('should perform a HTTP GET request to get all drawings having a given tag', () => {
        const tag = 'abc';
        const expectedDrawings: DrawingToDatabase[] = [new DrawingToDatabase(), new DrawingToDatabase()];

        service.getByTag(tag).subscribe((response: DrawingToDatabase[]) => {
            expect(Array.isArray(response)).toEqual(true);
        }, fail);
        const req = httpMock.expectOne(baseUrl + 'tag/' + tag);
        expect(req.request.method).toBe('GET');
        req.flush(expectedDrawings);
    });

    it('should send an HTTP POST request to create a drawing', () => {
        const sentDrawing: DrawingToDatabase = new DrawingToDatabase('1', 'abc', ['a', 'b']);
        // subscribe to the mocked call
        // tslint:disable-next-line: no-empty
        service.save(sentDrawing).subscribe(() => {}, fail);

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('POST');
        req.flush(sentDrawing);
    });

    it('should send an HTTP DELETE request to update a drawing', () => {
        const id = '2';
        // subscribe to the mocked call
        // tslint:disable-next-line: no-empty
        service.delete(id).subscribe(() => {}, fail);

        const req = httpMock.expectOne(baseUrl + id);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
    });

    it('should handle http error safely', () => {
        service.getAll().subscribe((response: DrawingToDatabase[]) => {
            expect(response).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(baseUrl);
        expect(req.request.method).toBe('GET');
        req.error(new ErrorEvent('Random error occured'));
    });
});
