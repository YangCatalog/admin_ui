import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthcheckService {
  private healthcheckRoute = '/api/admin/healthcheck';
  private jobsRoute = '/api/job';
  constructor(private http: HttpClient) { }

  fetchServicesList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.healthcheckRoute}/services-list`);
  }

  getServiceHealthStatus(serviceName: string): Observable<any> {
    return this.http.get<string[]>(`${this.healthcheckRoute}/${serviceName}`);
  }

  getCronjobsStatus(): Observable<any> {
    return this.http.get<any[]>(`${this.healthcheckRoute}/cronjobs`);
  }

  getColorByStatus(status: string) {
    switch (status) {
      case 'down':
      case 'Fail':
        return '#f0514c'; // red
      case 'problem':
        return '#fbc941'; // yellow
      case 'running':
      case 'Success':
        return '#96c87d'; // green
      case 'In Progress':
        return '#7dc8d3' // blue
    }
  }

  getJobStatus(jobId: string): Observable<any> {
    return this.http.get<any>(`${this.jobsRoute}/${jobId}`);
  }
}
