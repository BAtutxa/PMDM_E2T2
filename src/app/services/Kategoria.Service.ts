import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IKategoria } from '../interfaces/IKategoria';

@Injectable({
  providedIn: 'root'
})
export class KategoriaService {
  private baseUrl = 'http://localhost:8080/kategoriak'; // URL del backend Spring Boot
  private categoriasSubject = new BehaviorSubject<IKategoria[]>([]); 

  constructor(private http: HttpClient) {
    this.getCategorias().subscribe(categorias => this.categoriasSubject.next(categorias));
  }

  getCategorias(): Observable<IKategoria[]> {
    return this.http.get<IKategoria[]>(`${this.baseUrl}/kategoriakGuztiak`);
  }

  getCategoriasDelete(): Observable<IKategoria[]> {
    return this.http.get<IKategoria[]>(`${this.baseUrl}/kategoriakEzabatuta`);
  }

  actualizarCategoria(ficha: IKategoria): Observable<IKategoria> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    
    return this.http.put<IKategoria>(`${this.baseUrl}/update`, ficha, { headers }).pipe(
      tap((fichaActualizada) => {
        // Aquí actualizamos la lista de fichas
        const fichasActualizadas = this.categoriasSubject.getValue().map(f =>
          f.id === fichaActualizada.id ? fichaActualizada : f  // Reemplazamos la ficha restaurada
        );
        this.categoriasSubject.next(fichasActualizadas);  // Emitimos la nueva lista
      })
    );
  }
  
  trueEliminarCategoria(categoria: IKategoria): Observable<void> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
      return this.http.delete<void>(`${this.baseUrl}/trueDelete/${categoria.id}`)
      .pipe(
        tap(() => this.getCategorias().subscribe(categorias => this.categoriasSubject.next(categorias)))
      );
  }

  
  crearCategoria(ficha: IKategoria): Observable<IKategoria> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.post<IKategoria>(`${this.baseUrl}/create`, ficha, { headers })
      .pipe(
        tap(() => this.getCategorias().subscribe(categorias => this.categoriasSubject.next(categorias)))
      );
  }

  get fichas$(): Observable<IKategoria[]> {
    return this.categoriasSubject.asObservable();
  }
}
