import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  route = '/api/admin/directory-structure';
  diskUsageRoute = '/api/admin/disk-usage';
  selectedFilePath: string;
  subject$ = new Subject<string>();
  currentMessage$ = new BehaviorSubject<any>(null);
  currentPath$ = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) { }

  fetchFolder(path: string): Observable<any> {
    return this.http.get<any>(`${this.route}${path}`);
  }

  fetchFileContent(): Observable<any> {
    const headers = new HttpHeaders({
      Accept: 'text/plain',
      'Content-Type': 'text/plain'
    });
    return this.http.get(`${this.route}/read${this.selectedFilePath}`, { headers });
  }

  updateFile(fileContent: string): Observable<any> {
    const data = {
      input: {
        data: fileContent
      }
    };
    return this.http.put(`${this.route}${this.selectedFilePath}`, data);
  }

  deleteFile(path: string) {
    this.http.delete(`${this.route}${path}`).subscribe(
      response => {
        this.subject$.next('file-delete-ok');
      },
      err => {
        this.subject$.next('file-delete-error');
      }
    );
  }

  getDiskUsage(): Observable<any> {
    return this.http.get<any>(this.diskUsageRoute);
  }
}
