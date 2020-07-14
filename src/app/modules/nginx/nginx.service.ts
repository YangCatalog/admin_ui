import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NginxService {

  constructor(private http: HttpClient) { }

  fetchConfigNames(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3000/nginxNames');
  }

  fetchConfig(selectedNginxConf: string): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'text/plain',
      'Content-Type': 'text/plain'
    });
    return this.http.get(`http://localhost:3000/nginx/${selectedNginxConf}`, { headers, responseType: 'text'});
  }

  saveConfig(config: string): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'text/plain',
      'Content-Type': 'text/plain'
    });
    return this.http.post('http://localhost:3000/nginx', config, { headers, responseType: 'text'});
  }
}
