import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IZerbitzuak } from '../interfaces/IZerbitzuak';

@Injectable({
  providedIn: 'root'
})
export class ZerbitzuakService {

  private apiUrl = 'http://localhost:8080/zerbitzuak';

  constructor(private http: HttpClient) { }

  getZerbitzuak(): Observable<IZerbitzuak[]> {
    return this.http.get<IZerbitzuak[]>(`${this.apiUrl}/aktiboak`);
  }

  getZerbitzuakBorrado(): Observable<IZerbitzuak[]> {
    return this.http.get<IZerbitzuak[]>(`${this.apiUrl}/ezabatuak`);
  }

  saveZerbitzuak(zerbitzuak: IZerbitzuak): Observable<IZerbitzuak> {
    return this.http.post<IZerbitzuak>(`${this.apiUrl}/insert`, zerbitzuak);
  }

  updateZerbitzuak(zerbitzuak: IZerbitzuak): Observable<IZerbitzuak> {
    return this.http.put<IZerbitzuak>(`${this.apiUrl}/update`, zerbitzuak);
  }

  deleteZerbitzuak(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
