import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEProduktuak } from '../interfaces/IEProduktuak';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = 'http://localhost:8080/produktuak'; // URL del backend Spring Boot

  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  getProductos(): Observable<IEProduktuak[]> {
    return this.http.get<any[]>(`${this.baseUrl}/produktuGuztiak`);
  }

  // Obtener un producto por ID
  getProductoById(id: number): Observable<IEProduktuak> {
    return this.http.get<any>(`${this.baseUrl}/produktuGuztiak/${id}`);
  }

  // Obtener productos activos (no eliminados)
  getProductosActivos(): Observable<IEProduktuak[]> {
    return this.http.get<any[]>(`${this.baseUrl}/aktiboak`);
  }

  // Obtener productos eliminados
  getProductosEliminados(): Observable<IEProduktuak[]> {
    return this.http.get<any[]>(`${this.baseUrl}/ezabatuta`);
  }

  // Crear un nuevo producto
  crearProducto(producto: IEProduktuak): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.post(`${this.baseUrl}/create`, producto, { headers });
  }

  // Actualizar un producto
  actualizarProducto(producto: IEProduktuak): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put(`${this.baseUrl}/update`, producto, { headers });
  }

  // Eliminar un producto (soft delete)
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  // Eliminar un producto permanentemente (hard delete)
  eliminarProductoPermanente(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/hard-delete/${id}`);
  }
}
