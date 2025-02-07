import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IEProduktuak } from '../interfaces/IEProduktuak';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = 'http://localhost:8080/produktuak'; // URL del backend Spring Boot
  private productosSubject = new BehaviorSubject<IEProduktuak[]>([]); // Estado reactivo

  constructor(private http: HttpClient) {
    this.getProductosActivos().subscribe(productos => this.productosSubject.next(productos));
  }

  getProductos(): Observable<IEProduktuak[]> {
    return this.http.get<IEProduktuak[]>(`${this.baseUrl}/produktuGuztiak`);
  }

  getProductoById(id: number): Observable<IEProduktuak> {
    return this.http.get<IEProduktuak>(`${this.baseUrl}/produktuGuztiak/${id}`);
  }

  getProductosActivos(): Observable<IEProduktuak[]> {
    return this.http.get<IEProduktuak[]>(`${this.baseUrl}/aktiboak`);
  }

  getProductosEliminados(): Observable<IEProduktuak[]> {
    return this.http.get<IEProduktuak[]>(`${this.baseUrl}/ezabatuta`);
  }

  crearProducto(producto: IEProduktuak): Observable<IEProduktuak> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.post<IEProduktuak>(`${this.baseUrl}/create`, producto, { headers })
      .pipe(
        tap(nuevoProducto => {
          const productosActualizados = [...this.productosSubject.getValue(), nuevoProducto];
          this.productosSubject.next(productosActualizados);
        })
      );
  }

  actualizarProducto(producto: IEProduktuak): Observable<IEProduktuak> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put<IEProduktuak>(`${this.baseUrl}/update`, producto, { headers })
      .pipe(
        tap(productoActualizado => {
          const productosActualizados = this.productosSubject.getValue().map(p =>
            p.id === productoActualizado.id ? productoActualizado : p
          );
          this.productosSubject.next(productosActualizados);
        })
      );
  }

  eliminarProducto(producto: IEProduktuak): Observable<void> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put<void>(`${this.baseUrl}/delete`, producto, { headers })
      .pipe(
        tap(() => this.getProductosActivos().subscribe(productos => this.productosSubject.next(productos)))
      );
  }

  eliminarProductoPermanente(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/hard-delete/${id}`, { responseType: 'text' as 'json' });
  }

  get productos$(): Observable<IEProduktuak[]> {
    return this.productosSubject.asObservable();
  }
}
