import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthcheckService {
  private healthcheckRoute = '/api/admin/healthcheck';
  constructor(private http: HttpClient) { }

  fetchServicesList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.healthcheckRoute}/services-list`);
  }

  getServiceHealthStatus(serviceName: string): Observable<any> {
    return this.http.get<string[]>(`${this.healthcheckRoute}/${serviceName}`);
  }

  getColorByStatus(status: string) {
    switch (status) {
      case 'down':
        return '#f0514c'; // red
      case 'problem':
        return '#fbce41'; // yellow
      case 'running':
        return '#95d37d'; // green
    }
  }
}
