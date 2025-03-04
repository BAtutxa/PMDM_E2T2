import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IBezero } from '../interfaces/IEBezero';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private baseUrl = 'http://localhost:8080/fitxak'; // URL del backend Spring Boot
  private fichasSubject = new BehaviorSubject<IBezero[]>([]); 

  constructor(private http: HttpClient) {
    this.getFichas().subscribe(fichas => this.fichasSubject.next(fichas));
  }

  getFichas(): Observable<IBezero[]> {
    return this.http.get<IBezero[]>(`${this.baseUrl}/fitxakGuztiak`);
  }

  getFichasDelete(): Observable<IBezero[]> {
    return this.http.get<IBezero[]>(`${this.baseUrl}/fitxakEzabatuta`);
  }

  actualizarFicha(ficha: IBezero): Observable<IBezero> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    
    return this.http.put<IBezero>(`${this.baseUrl}/update`, ficha, { headers }).pipe(
      tap((fichaActualizada) => {
        // Aquí actualizamos la lista de fichas
        const fichasActualizadas = this.fichasSubject.getValue().map(f =>
          f.id === fichaActualizada.id ? fichaActualizada : f  // Reemplazamos la ficha restaurada
        );
        this.fichasSubject.next(fichasActualizadas);  // Emitimos la nueva lista
      })
    );
  }
  
  eliminarFicha(ficha: IBezero): Observable<void> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put<void>(`${this.baseUrl}/delete`, ficha, { headers })
      .pipe(
        tap(() => this.getFichas().subscribe(fichas => this.fichasSubject.next(fichas)))
      );
  }

  trueEliminarFicha(ficha: IBezero): Observable<void> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
      return this.http.delete<void>(`${this.baseUrl}/trueDelete/${ficha.id}`)
      .pipe(
        tap(() => this.getFichas().subscribe(fichas => this.fichasSubject.next(fichas)))
      );
  }

  
  crearFicha(ficha: IBezero): Observable<IBezero> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.post<IBezero>(`${this.baseUrl}/create`, ficha, { headers })
      .pipe(
        tap(() => this.getFichas().subscribe(fichas => this.fichasSubject.next(fichas)))
      );
  }

  get fichas$(): Observable<IBezero[]> {
    return this.fichasSubject.asObservable();
  }
}
