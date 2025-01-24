import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IEquipos } from '../interfaces/IEquipos';

@Injectable({
  providedIn: 'root',
})
export class EquipoService {
  private baseUrl = 'http://localhost:8080/taldeak'; // URL del backend Spring Boot
  private fichasSubject = new BehaviorSubject<IEquipos[]>([]); // Almacenar las fichas

  // Observable que los componentes pueden suscribirse
  grupos$ = this.fichasSubject.asObservable();

  constructor(private http: HttpClient) {
    // Al inicializar el servicio, cargar los grupos del backend
    this.getGrupos().subscribe((grupos) => this.fichasSubject.next(grupos));
  }

  // Obtener todos los grupos del backend
  getGrupos(): Observable<IEquipos[]> {
    return this.http.get<IEquipos[]>(`${this.baseUrl}/talde`);
  }

//   actualizarGrupo(ficha: IEquipos): Observable<IEquipos> {
//     const headers = new HttpHeaders()
//       .set('Content-Type', 'application/json')
//       .set('Accept', 'application/json');
//     return this.http.put<IEquipos>(`${this.baseUrl}/update`, ficha, { headers })
//       .pipe(
//         // Después de actualizar, actualizamos el BehaviorSubject
//         tap(() => this.getGrupos().subscribe(fichas => this.fichasSubject.next(fichas)))
//       );
//   }

//   eliminarGrupo(ficha: IEquipos): Observable<void> {
//     const headers = new HttpHeaders()
//       .set('Content-Type', 'application/json')
//       .set('Accept', 'application/json');
//     return this.http.put<void>(`${this.baseUrl}/delete`, ficha, { headers })
//       .pipe(
//         // Después de eliminar, actualizamos el BehaviorSubject
//         tap(() => this.getGrupos().subscribe(fichas => this.fichasSubject.next(fichas)))
//       );
//   }

//   crearGrupo(ficha: IEquipos): Observable<IEquipos> {
//     const headers = new HttpHeaders()
//       .set('Content-Type', 'application/json')
//       .set('Accept', 'application/json');
//     return this.http.post<IEquipos>(`${this.baseUrl}/create`, ficha, { headers })
//       .pipe(
//         // Después de crear, actualizamos el BehaviorSubject
//         tap(() => this.getGrupos().subscribe(fichas => this.fichasSubject.next(fichas)))
//       );
//   }

//   get fichas$(): Observable<IEquipos[]> {
//     return this.fichasSubject.asObservable();
//   }
}
