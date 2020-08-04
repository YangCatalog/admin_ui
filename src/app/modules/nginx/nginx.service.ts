import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NginxService {
  nginxRoute = '/api/admin/yangcatalog-nginx';
  constructor(private http: HttpClient) { }

  fetchConfigNames(): Observable<any> {
    return this.http.get<any>(this.nginxRoute);
  }

  fetchConfig(selectedNginxConf: string): Observable<any> {
    return this.http.get<any>(`${this.nginxRoute}/${selectedNginxConf}`);
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
    return this.http.post(this.nginxRoute, body, { headers });
  }
}
