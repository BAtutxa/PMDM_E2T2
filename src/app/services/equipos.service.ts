import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IEquipos } from '../interfaces/IEquipos';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private baseUrl = 'http://localhost:8080/taldeak'; // URL del backend Spring Boot
  private fichasSubject = new BehaviorSubject<IEquipos[]>([]); // Almacenar las fichas

  constructor(private http: HttpClient) {
    // Al inicializar el servicio, cargamos las fichas para mantenerlas siempre actualizadas
    this.getFichas().subscribe(fichas => this.fichasSubject.next(fichas));
  }

  getFichas(): Observable<IEquipos[]> {
    return this.http.get<IEquipos[]>(`${this.baseUrl}/talde`);
  }

  actualizarFicha(ficha: IEquipos): Observable<IEquipos> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put<IEquipos>(`${this.baseUrl}/update`, ficha, { headers })
      .pipe(
        // Después de actualizar, actualizamos el BehaviorSubject
        tap(() => this.getFichas().subscribe(fichas => this.fichasSubject.next(fichas)))
      );
  }

  eliminarFicha(ficha: IEquipos): Observable<void> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put<void>(`${this.baseUrl}/delete`, ficha, { headers })
      .pipe(
        // Después de eliminar, actualizamos el BehaviorSubject
        tap(() => this.getFichas().subscribe(fichas => this.fichasSubject.next(fichas)))
      );
  }

  crearFicha(ficha: IEquipos): Observable<IEquipos> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.post<IEquipos>(`${this.baseUrl}/create`, ficha, { headers })
      .pipe(
        // Después de crear, actualizamos el BehaviorSubject
        tap(() => this.getFichas().subscribe(fichas => this.fichasSubject.next(fichas)))
      );
  }

  get fichas$(): Observable<IEquipos[]> {
    return this.fichasSubject.asObservable();
  }
}
