import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Drawing } from '@common/communication/drawing';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ApiImageTransferService {
    private readonly BASE_URL: string = 'http://localhost:3000/api/drawing';

    constructor(private http: HttpClient) {}

    basicPost(drawing: Drawing): Observable<Drawing> {
        return this.http.post<Drawing>(this.BASE_URL, drawing);
    }
}
