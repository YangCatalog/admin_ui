import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  // route = '/api/admin/directory-structure';
  route = 'http://localhost:3000/tree';
  selectedFilePath: string;
  subject$ = new Subject<string>();

  constructor(private http: HttpClient) { }

  fetchFolder(path: string): Observable<any> {
    return this.http.get<any>(`${this.route}${path}`);
  }

  fetchFileContent() {
    const headers = new HttpHeaders({
      'Accept': 'text/plain',
      'Content-Type': 'text/plain'
    });
    return this.http.get(`${this.route}${this.selectedFilePath}`, { headers, responseType: 'text'});
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
    this.http.delete(`${this.route}${path}`)
    .subscribe(
      response => {
        this.subject$.next('file-delete-ok');
      },
      err => {
        this.subject$.next('file-delete-error');
      }
    );
  }
}
