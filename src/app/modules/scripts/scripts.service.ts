import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Script from './interfaces/script';

@Injectable({
  providedIn: 'root'
})
export class ScriptsService {
  route = 'http://localhost:3000/apiscripts';

  constructor(private http: HttpClient) { }

  fetchScripts(): Observable<{scripts: Script[]}> {
    return this.http.get<{scripts: Script[]}>(this.route);
  }

  postScripts(data): Observable<any> {
    return this.http.post(this.route, data);
  }
}
