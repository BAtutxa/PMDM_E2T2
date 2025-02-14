import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  private apiUrl = 'http://localhost:8080/hitzorduak';

  constructor(private http: HttpClient) {}

  // INSERTAR CITA.
  createCita(citaData: any): Observable<any> {
    console.log('JSON enviado al backend:', JSON.stringify(citaData, null, 2));
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post<any>(`${this.apiUrl}/create`, citaData, { headers });
  }
  

  // GET CITA POR FECHA.
  getCitasPorFecha(fecha: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/datarenHitzorduak?date=${fecha}`);
  }


  updateCita(citaData: any): Observable<any> {
    console.log('JSON enviado para actualizar la cita:', JSON.stringify(citaData, null, 2));
    const headers = { 'Content-Type': 'application/json' };
    return this.http.put<any>(`${this.apiUrl}/update`, citaData, { headers });
  }

  deleteCita(id: number): Observable<any> {
    console.log('Eliminando cita con ID:', id);
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

   deleteCitaPermanently(id: number): Observable<any> {
    return this.http.delete<any>(`http://localhost:8080/hitzorduak/hardDelete/${id}`);
  }
}
