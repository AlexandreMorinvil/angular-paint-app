import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Image } from '@common/communication/image';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ApiImageTransferService {
    private readonly BASE_URL: string = 'http://localhost:3000/api/index';

    constructor(private http: HttpClient) {}

    basicGet(): Observable<Image> {
        return this.http.get<Image>(this.BASE_URL).pipe(catchError(this.handleError<Image>('basicGet')));
    }

    basicPost(drawing: Image): Observable<void> {
        return this.http.post<void>(this.BASE_URL + '/send', drawing);
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
