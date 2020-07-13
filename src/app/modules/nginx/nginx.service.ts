import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NginxService {

  constructor(private http: HttpClient) { }

  fetchConfig(): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'text/plain',
      'Content-Type': 'text/plain'
    });
    return this.http.get('/nginx', { headers, responseType: 'text'});
  }

  saveConfig(config: string): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'text/plain',
      'Content-Type': 'text/plain'
    });
    return this.http.post('/nginx', config, { headers, responseType: 'text'});
  }
}
