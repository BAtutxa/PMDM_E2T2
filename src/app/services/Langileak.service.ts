import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable } from 'rxjs';
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
}
