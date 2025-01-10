import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private baseUrl = 'http://localhost:8080/materialak'; // URL del backend Spring Boot

  constructor(private http: HttpClient) {}

  getMateriales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/materialGuztiak`);
  }

  actualizarMaterial(material: any): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json'); 
    return this.http.put(`${this.baseUrl}/update`, material, { headers });
  }
}
