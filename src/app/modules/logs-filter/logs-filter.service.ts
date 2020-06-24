import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LogsFilterService {
    private logsRoute = `/api/admin/logs`;
    constructor(private http: HttpClient) {}

    fetchLogsFileNames(): Observable<any> {
        // return of({ data: ['yang', 'parseAndPopulate'] });
        return this.http.get<any>(this.logsRoute);
    }

    getLogs(formData: any): Observable<any> {
        const payload = {
            input: formData
        };

        return this.http.post<any>(this.logsRoute, payload);
        // return this.http.get('http://localhost:4200/assets/responseExample.json');
    }
}
