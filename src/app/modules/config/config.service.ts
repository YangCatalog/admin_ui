import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) { }

  fetchConfig(): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'text/plain',
      'Content-Type': 'text/plain'
    });
    return this.http.get('/yangcatalog-config', { headers, responseType: 'text'});
  }

  saveConfig(config: string): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'text/plain',
      'Content-Type': 'text/plain'
    });
    return this.http.put('/yangcatalog-config', config, { headers, responseType: 'text'});
  }
}
