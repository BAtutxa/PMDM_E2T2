import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private apiUrl = 'http://localhost:8080/hitzorduak';  // Endpoint del backend

  constructor(private http: HttpClient) {}

  // INSERTAR CITA.
  createCita(citaData: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(this.apiUrl, citaData, { headers });
  }

  // GET CITA POR FECHA.
  getCitasPorFecha(fecha: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointmentsByDate?date=${fecha}`);
  }
  
}
