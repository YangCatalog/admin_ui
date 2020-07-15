import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NginxService {
  route = 'http://localhost:3000/yangcatalog-nginx';
  constructor(private http: HttpClient) { }

  fetchConfigNames(): Observable<any> {
    return this.http.get<any>(this.route);
  }

  fetchConfig(selectedNginxConf: string): Observable<any> {
    return this.http.get<any>(`${this.route}/${selectedNginxConf}`);
  }

  saveConfig(config: string): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'text/plain',
      'Content-Type': 'text/plain'
    });
    return this.http.post('http://localhost:3000/nginx', config, { headers, responseType: 'text'});
  }
}
