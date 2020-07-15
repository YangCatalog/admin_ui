import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { LoginComponent } from 'src/app/others/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
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
    const headers = new HttpHeaders({
      'Accept': 'text/plain',
      'Content-Type': 'text/plain'
    });
    // TODO CHANGE TO PUT
    return this.http.post(`${this.route}${this.selectedFilePath}`, fileContent, { headers, responseType: 'text'});
  }

  deleteFile(path: string) {
    // TODO CHANGE TO DELETE
    this.http.get(`${this.route}${path}`)
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
