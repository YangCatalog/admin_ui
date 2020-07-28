import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ScriptsService {
  change$ = new Subject<string>();
  scriptsRoute = '/api/admin/scripts';
  jobsRoute = '/api/job';
  jobsToFilterBy = [];

  constructor(private http: HttpClient) { }

  fetchScripts(): Observable<any> {
    return this.http.get<any>(this.scriptsRoute);
  }

  fetchOptions(script: string): Observable<any> {
    return this.http.get<any>(`${this.scriptsRoute}/${script}`);
  }

  postScripts(formValue: any, selectedScript: string): Observable<any> {
    const data = { input: formValue };
    return this.http.post(`${this.scriptsRoute}/${selectedScript}`, data);
  }

  storeJob(jobName: string, jobId: string) {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    jobs.unshift({ jobName, jobId });
    localStorage.setItem('jobs', JSON.stringify(jobs));
    this.change$.next('job-stored');
  }

  removeJob(job: any) {
    this.jobsToFilterBy.push(job);
    const localStorageJobs = JSON.parse(localStorage.getItem('jobs') || '[]');

    if (localStorageJobs.length === this.jobsToFilterBy.length) {
      const notFinishedJobs = [];

      this.jobsToFilterBy.forEach(job => {
        if (!job.finished) {
          notFinishedJobs.push(localStorageJobs.find(localStorageJob => localStorageJob.jobId === job.jobId));
        }
      });

      localStorage.setItem('jobs', JSON.stringify(notFinishedJobs));
      this.jobsToFilterBy = [];
      this.change$.next('reinit');
    }
  }

  getJobStatus(jobId: string): Observable<any> {
    return this.http.get<any>(`${this.jobsRoute}/${jobId}`);
  }
}
