import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'https://pci-backend.vercel.app/admin'; 

  constructor(private http: HttpClient) {}

  create(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  findAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  findOne(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  remove(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
