import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginComponent } from 'src/app/others/login/login.component';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  route = 'http://localhost:3000/apifolders';
  selectedFolder;
  selectedFile;

  constructor(private http: HttpClient) { }

  fetchFolders(): Observable<string[]> {
    return this.http.get<string[]>(this.route);
  }

  fetchFiles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.route}/${this.selectedFolder}`);
  }

  fetchFileContent() {
    const headers = new HttpHeaders({
      'Accept': 'text/plain',
      'Content-Type': 'text/plain'
    });
    return this.http.get(`${this.route}/${this.selectedFolder}/${this.selectedFile}`, { headers, responseType: 'text'});
  }

  saveFile(fileContent: string): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'text/plain',
      'Content-Type': 'text/plain'
    });
    return this.http.post(`${this.route}/${this.selectedFolder}/${this.selectedFile}`, fileContent, { headers, responseType: 'text'});
  }

  deleteFile(fileName: string) {
    return this.http.get(`${this.route}/${this.selectedFolder}/${fileName}/2`);
  }
}
