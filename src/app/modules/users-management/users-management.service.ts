import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersManagementService {
  private route = '/api/admin/users';
  private validateUserRoute = '/api/admin/move-user';
  constructor(private http: HttpClient) { }

  fetchTable(tableName: string): Observable<any> {
    return this.http.get<any>(`${this.route}/${tableName}`);
  }

  saveNewRecord(tableName: string, data: any): Observable<any> {
    return this.http.post(`${this.route}/${tableName}`, data);
  }

  deleteRecord(tableName: string, recordId: number): Observable<any> {
    return this.http.delete(`${this.route}/${tableName}/id/${recordId}`);
  }

  validateRecord(data: any): Observable<any> {
    return this.http.post(`${this.validateUserRoute}`, data);
  }

  editRecord(tableName: string, recordId: number, data: any): Observable<any> {
    return this.http.put(`${this.route}/${tableName}/id/${recordId}`, data);
  }
}
