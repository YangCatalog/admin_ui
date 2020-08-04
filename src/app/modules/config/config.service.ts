import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configRoute = '/api/admin/yangcatalog-config';
  constructor(private http: HttpClient) { }

  fetchConfig(): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'text/plain',
      'Content-Type': 'text/plain'
    });
    return this.http.get(this.configRoute, { headers });
  }

  saveConfig(config: string): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'text/plain',
      'Content-Type': 'application/json'
    });
    const body = {
      input: {
        data: config
      }
    };
    return this.http.put(this.configRoute, body, { headers });
  }
}
