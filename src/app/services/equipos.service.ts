import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IEquipos } from '../interfaces/IEquipos';
import { map } from 'rxjs/operators'; // Asegurarnos de importar map

@Injectable({
  providedIn: 'root',
})
export class EquipoService {
  private baseUrl = 'http://localhost:8080/taldeak'; // URL del backend

  private gruposSubject = new BehaviorSubject<IEquipos[]>([]);
  grupos$ = this.gruposSubject.asObservable();

  constructor(private http: HttpClient) {
    // Cargar grupos al inicializar el servicio
    this.cargarGrupos();
  }

  // Obtener todos los grupos no eliminados
  cargarGrupos(): void {
    this.http.get<IEquipos[]>(`${this.baseUrl}/talde`).subscribe({
      next: (grupos) => this.gruposSubject.next(grupos),
      error: (err) => console.error('Error al cargar grupos:', err),
    });
  }
  

  // Obtener el siguiente ID disponible para un equipo como string
  obtenerIDDisponible(): Observable<string> {
    return this.http.get<IEquipos[]>(`${this.baseUrl}/talde`).pipe(
      map((equipos) => {
        // Si no hay equipos, el siguiente ID será "1"
        if (equipos.length === 0) {
          return '1';
        }

        // Buscar el id máximo y asignar el siguiente
        const ids = equipos.map(equipo => parseInt(equipo.kodea, 10) ?? 0); // Convertimos 'kodea' a número
        const maxId = Math.max(...ids);

        // Si maxId es NaN, devolver "1", de lo contrario, incrementar el valor máximo y convertir a string
        return isNaN(maxId) ? '1' : (maxId + 1).toString();
      })
    );
  }

  cargarGruposEliminados(): Observable<IEquipos[]> {
    return this.http.get<IEquipos[]>(`${this.baseUrl}/taldeEzabatuta`);
  }

  // Crear un nuevo grupo
  agregarGrupo(grupo: IEquipos): Observable<IEquipos> {
    return this.http.post<IEquipos>(`${this.baseUrl}/create`, grupo);
  }

  // Actualizar un grupo existente
  actualizarGrupo(grupo: IEquipos): Observable<IEquipos> {
    return this.http.put<IEquipos>(`${this.baseUrl}/update`, grupo);
  }

  // Marcar un grupo como eliminado
  eliminarGrupo(grupo: IEquipos): Observable<IEquipos> {
    return this.http.put<IEquipos>(`${this.baseUrl}/delete`, grupo);
  }
}
