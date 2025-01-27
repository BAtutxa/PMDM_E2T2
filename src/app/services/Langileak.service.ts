import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable } from 'rxjs';
import { ITrabajador } from '../interfaces/ITrabajador';


@Injectable({
  providedIn: 'root',
})
export class LangileakService {
  private apiUrl = 'http://localhost:8080/api/langileak';

  constructor(private http: HttpClient) {}

  getAllLangileak(): Observable<ITrabajador[]> {
    return this.http.get<ITrabajador[]>(this.apiUrl);
  }

  getLangileak(): Observable<ITrabajador[]> {
     return this.http.get<ITrabajador[]>(`${this.apiUrl}/trueLangileak`);
  }

  agregarLangile(langile: ITrabajador): Observable<ITrabajador> {
    return this.http.post<ITrabajador>(`${this.apiUrl}/create`, langile);
  }

  actualizarLangile(langile: ITrabajador): Observable<ITrabajador> {
    return this.http.put<ITrabajador>(`${this.apiUrl}/update`, langile);
  }

  eliminarLangile(langile: ITrabajador): Observable<ITrabajador> {
    return this.http.put<ITrabajador>(`${this.apiUrl}/delete`, langile);
  }
  obtenerIDMaximo(): Observable<number> {
    return this.http.get<string>(`${this.apiUrl}/max-kodea`).pipe( 
      map((maxKodea: string) => {
        const maxId = parseInt(maxKodea, 10) ?? 0;
        return isNaN(maxId) ? 1 : maxId + 1; 
      })
    );
  }
  
}
