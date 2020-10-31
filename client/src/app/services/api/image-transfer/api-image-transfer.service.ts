import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '@common/schema/drawing';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ApiImageTransferService {
    private readonly BASE_URL: string = 'http://localhost:3000/api/drawing';

    constructor(private http: HttpClient) {}

    basicGet(): Observable<Drawing> {
        return this.http.get<Drawing>(this.BASE_URL).pipe(catchError(this.handleError<Drawing>('basicGet')));
    }

    basicPost(drawing: Drawing): Observable<Drawing> {
        return this.http.post<Drawing>(this.BASE_URL, drawing); //JSON.stringify(drawing));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
