import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IKoloreHistorialak } from '../interfaces/IKoloreHistorialak';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KoloreHistorialakService {

  private apiUrl = 'http://localhost:8080/kolore-historialak'; // Asegúrate de tener la URL correcta.

  constructor(private http: HttpClient) { }

  // Obtener historial no eliminado
  getKoloreHistorialak(): Observable<IKoloreHistorialak[]> {
    return this.http.get<IKoloreHistorialak[]>(`${this.apiUrl}/historial`);
  }

  // Obtener historial eliminado
  getKoloreHistorialakEzabatuta(): Observable<IKoloreHistorialak[]> {
    return this.http.get<IKoloreHistorialak[]>(`${this.apiUrl}/ezabatuta`);
  }

  // Crear un nuevo historial
  createKoloreHistorialak(koloreHistorialak: IKoloreHistorialak): Observable<IKoloreHistorialak> {
    return this.http.post<IKoloreHistorialak>(`${this.apiUrl}/create`, koloreHistorialak, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Actualizar historial existente
  updateKoloreHistorialak(koloreHistorialak: IKoloreHistorialak): Observable<IKoloreHistorialak> {
    return this.http.put<IKoloreHistorialak>(`${this.apiUrl}/update`, koloreHistorialak, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  // Eliminar historial (soft delete)
  deleteKoloreHistorialak(id: number): Observable<IKoloreHistorialak> {
    return this.http.delete<IKoloreHistorialak>(`${this.apiUrl}/delete/${id}`);
  }

  // Eliminar historial (hard delete)
  hardDeleteKoloreHistorialak(id: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/hard-delete/${id}`);
  }
}
