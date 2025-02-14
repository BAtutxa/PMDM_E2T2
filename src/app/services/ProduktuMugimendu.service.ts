import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IPM } from '../interfaces/IPM';

@Injectable({
  providedIn: 'root'
})
export class IPMService {
  private baseUrl = 'http://localhost:8080/api/produktu-mugimenduak'; // URL del backend Spring Boot
  private materialSubject = new BehaviorSubject<IPM[]>([]);

  constructor(private http: HttpClient) {
    // Inicializa la lista de materiales
    this.getIPM().subscribe(materiales => this.materialSubject.next(materiales));
  }

  getIPM(): Observable<IPM[]> {
    return this.http.get<IPM[]>(`${this.baseUrl}/aktiboak`);
  }

  getIPMBorrados(): Observable<IPM[]> {
    return this.http.get<IPM[]>(`${this.baseUrl}/materialakEzabatuta`);
  }

  actualizarIPM(material: IPM): Observable<IPM> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    
    return this.http.put<IPM>(`${this.baseUrl}/eguneratu`, material, { headers }).pipe(
      tap((materialActualizado) => {
        const materialesActualizados = this.materialSubject.getValue().map(m =>
          m.id === materialActualizado.id ? materialActualizado : m
        );
        this.materialSubject.next(materialesActualizados);
      })
    );
  }

  crearIPM(material: IPM): Observable<IPM> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    
    return this.http.post<IPM>(`${this.baseUrl}/sortu`, material, { headers }).pipe(
      tap(() => this.getIPM().subscribe(materiales => this.materialSubject.next(materiales)))
    );
  }

  trueEliminarIPM(material: IPM): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/hard/${material.id}`).pipe(
      tap(() => this.getIPM().subscribe(materiales => this.materialSubject.next(materiales)))
    );
  }

  get materiales$(): Observable<IPM[]> {
    return this.materialSubject.asObservable();
  }
}
