import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScriptsService {
  route = 'http://localhost:3000/scripts';

  constructor(private http: HttpClient) { }

  fetchScripts(): Observable<any> {
    return this.http.get<any>(this.route);
  }

  fetchOptions(script: string): Observable<any> {
    return this.http.get<any>(`${this.route}/${script}`);
  }

  postScripts(data): Observable<any> {
    return this.http.post(this.route, data);
  }
}
