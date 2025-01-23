import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBezero } from '../interfaces/IEBezero';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private baseUrl = 'http://localhost:8080/fitxak'; // URL del backend Spring Boot

  constructor(private http: HttpClient) {}

  getFichas(): Observable<IBezero[]> {
    return this.http.get<IBezero[]>(`${this.baseUrl}/fitxakGuztiak`);
  }

  actualizarFicha(ficha: IBezero): Observable<IBezero> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json'); 
    return this.http.put<IBezero>(`${this.baseUrl}/update`, ficha, { headers });
  }

  eliminarFicha(ficha: IBezero){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json'); 
    return this.http.put<IBezero>(`${this.baseUrl}/delete`, ficha, { headers });
  }

  crearFicha(){

  }
}
