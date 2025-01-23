import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IBezero } from '../interfaces/IEBezero';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private baseUrl = 'http://localhost:8080/fitxak'; // URL del backend Spring Boot
  private fichasSubject = new BehaviorSubject<IBezero[]>([]); // Almacenar las fichas

  constructor(private http: HttpClient) {
    // Al inicializar el servicio, cargamos las fichas para mantenerlas siempre actualizadas
    this.getFichas().subscribe(fichas => this.fichasSubject.next(fichas));
  }

  getFichas(): Observable<IBezero[]> {
    return this.http.get<IBezero[]>(`${this.baseUrl}/fitxakGuztiak`);
  }

  actualizarFicha(ficha: IBezero): Observable<IBezero> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put<IBezero>(`${this.baseUrl}/update`, ficha, { headers })
      .pipe(
        // Después de actualizar, actualizamos el BehaviorSubject
        tap(() => this.getFichas().subscribe(fichas => this.fichasSubject.next(fichas)))
      );
  }

  eliminarFicha(ficha: IBezero): Observable<void> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put<void>(`${this.baseUrl}/delete`, ficha, { headers })
      .pipe(
        // Después de eliminar, actualizamos el BehaviorSubject
        tap(() => this.getFichas().subscribe(fichas => this.fichasSubject.next(fichas)))
      );
  }

  crearFicha(ficha: IBezero): Observable<IBezero> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.post<IBezero>(`${this.baseUrl}/create`, ficha, { headers })
      .pipe(
        // Después de crear, actualizamos el BehaviorSubject
        tap(() => this.getFichas().subscribe(fichas => this.fichasSubject.next(fichas)))
      );
  }

  // Método para que los componentes puedan suscribirse a las fichas
  get fichas$(): Observable<IBezero[]> {
    return this.fichasSubject.asObservable();
  }
}
