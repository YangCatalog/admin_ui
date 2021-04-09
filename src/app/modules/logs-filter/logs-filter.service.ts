import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LogsFilterService {
    private logsRoute = `/api/admin/logs`;
    constructor(private http: HttpClient) {}

    fetchLogsFileNames(): Observable<any> {
        return this.http.get<any>(this.logsRoute);
    }

    getLogs(formData: any): Observable<any> {
        const payload = {
            input: formData
        };

        return this.http.post<any>(this.logsRoute, payload);
    }

    datetimeToTimestamp(time: any): number {
        // By default in miliseconds = divide by 1000
        return Math.round(new Date(time).getTime() / 1000);
    }

    isTracebackMessage(logMessage: string): boolean {
        const tracebackRegexp = /[-] \d*\nTraceback/gm;
        return tracebackRegexp.test(logMessage);
    }
}
