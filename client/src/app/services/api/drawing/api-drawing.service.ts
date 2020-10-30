import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '@common/schema/drawing';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const BASE_URL: string = 'http://localhost:3000/api/drawing/';
export const FILE_SERVER_BASE_URL: string = 'http://localhost:3000/files/';

@Injectable({
    providedIn: 'root',
})
export class ApiDrawingService {

    constructor(private http: HttpClient) {}

    getAll(): Observable<Drawing[]> {
        return this.http.get<Drawing[]>(BASE_URL).pipe(catchError(this.handleError<Drawing[]>('getAll')));
    }

    getById(id: string): Observable<Drawing> {
        return this.http.get<Drawing>(BASE_URL + id).pipe(catchError(this.handleError<Drawing>('getByID')));
    }

    getByName(name: string): Observable<Drawing[]> {
        return this.http.get<Drawing[]>(BASE_URL + name).pipe(catchError(this.handleError<Drawing[]>('getByName')));
    }

    getByTag(tag: string): Observable<Drawing[]> {
        return this.http.get<Drawing[]>(BASE_URL + "tag/" + tag).pipe(catchError(this.handleError<Drawing[]>('getByTag')));
    }

    save(drawing: Drawing): Observable<void> {
        return this.http.post<void>(BASE_URL, drawing).pipe(catchError(this.handleError<void>('save')));
    }

    update(id: string, drawing: Drawing): Observable<Drawing> {
        return this.http.patch<Drawing>(BASE_URL + id, drawing).pipe(catchError(this.handleError<Drawing>('update')));
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(BASE_URL + id).pipe(catchError(this.handleError<void>('')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
