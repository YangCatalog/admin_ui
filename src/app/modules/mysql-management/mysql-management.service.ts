import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MysqlManagementService {
  private route = '/api/admin/sql-tables';
  constructor(private http: HttpClient) { }

  fetchTables(): Observable<string[]> {
    return this.http.get<string[]>(this.route);
  }

  fetchTable(tableName: string): Observable<any> {
    return this.http.get<string[]>(`${this.route}/${tableName}`);
  }

  saveNewRecord(tableName: string, data: any): Observable<any> {
    return this.http.post(`${this.route}/${tableName}`, data);
  }

  deleteRecord(tableName: string, recordId: number): Observable<any> {
    return this.http.delete(`${this.route}/${tableName}/id/${recordId}`,);
  }
}
