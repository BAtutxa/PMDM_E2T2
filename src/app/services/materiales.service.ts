import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IEMaterialak } from '../interfaces/IEMaterialak';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private baseUrl = 'http://localhost:8080/materialak'; // URL del backend Spring Boot
  private materialSubject = new BehaviorSubject<IEMaterialak[]>([]);

  constructor(private http: HttpClient) {
    // Inicializa la lista de materiales
    this.getMateriales().subscribe(materiales => this.materialSubject.next(materiales));
  }

  getMateriales(): Observable<IEMaterialak[]> {
    return this.http.get<IEMaterialak[]>(`${this.baseUrl}/aktiboak`);
  }

  getMaterialesBorrados(): Observable<IEMaterialak[]> {
    return this.http.get<IEMaterialak[]>(`${this.baseUrl}/materialakEzabatuta`);
  }

  actualizarMaterial(material: IEMaterialak): Observable<IEMaterialak> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    
    return this.http.put<IEMaterialak>(`${this.baseUrl}/update`, material, { headers }).pipe(
      tap((materialActualizado) => {
        const materialesActualizados = this.materialSubject.getValue().map(m =>
          m.id === materialActualizado.id ? materialActualizado : m
        );
        this.materialSubject.next(materialesActualizados);
      })
    );
  }

  crearMaterial(material: IEMaterialak): Observable<IEMaterialak> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    
    return this.http.post<IEMaterialak>(`${this.baseUrl}/create`, material, { headers }).pipe(
      tap(() => this.getMateriales().subscribe(materiales => this.materialSubject.next(materiales)))
    );
  }

  trueEliminarMaterial(material: IEMaterialak): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${material.id}`).pipe(
      tap(() => this.getMateriales().subscribe(materiales => this.materialSubject.next(materiales)))
    );
  }

  get materiales$(): Observable<IEMaterialak[]> {
    return this.materialSubject.asObservable();
  }
}
