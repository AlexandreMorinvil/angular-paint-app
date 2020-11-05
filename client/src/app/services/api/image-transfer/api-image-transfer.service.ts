import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '@common/communication/drawing';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ApiImageTransferService {
    private readonly BASE_URL: string = 'http://localhost:3000/api/drawing';

    constructor(private http: HttpClient) {}

    basicPost(drawing: Drawing): Observable<Drawing | void> {
        return this.http.post<Drawing>(this.BASE_URL, drawing).pipe(catchError(this.handleError<void>('save')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            alert(error.message);
            return of(result as T);
        };
    }
}
