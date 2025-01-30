import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Zerbitzuak } from '../interfaces/IZerbitzuak';

@Injectable({
  providedIn: 'root'
})
export class ZerbitzuakService {

  private apiUrl = 'http://localhost:8080/zerbitzuak';

  constructor(private http: HttpClient) { }

  getZerbitzuak(): Observable<Zerbitzuak[]> {
    return this.http.get<Zerbitzuak[]>(`${this.apiUrl}/zerbitzuGuztiak`);
  }

  saveZerbitzuak(zerbitzuak: Zerbitzuak): Observable<Zerbitzuak> {
    return this.http.post<Zerbitzuak>(`${this.apiUrl}/save`, zerbitzuak);
  }

  updateZerbitzuak(zerbitzuak: Zerbitzuak): Observable<Zerbitzuak> {
    return this.http.put<Zerbitzuak>(`${this.apiUrl}/update`, zerbitzuak);
  }

  deleteZerbitzuak(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
