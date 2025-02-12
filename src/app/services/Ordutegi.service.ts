import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { IOrdutegi } from '../interfaces/IOrdutegi';

@Injectable({
  providedIn: 'root'
})
export class OrdutegiService {
  private baseUrl = 'http://localhost:8080/api/ordutegiak'; 
  private OrdutegiaSubject = new BehaviorSubject<IOrdutegi[]>([]);

  constructor(private http: HttpClient) {
    this.getOrdutegisActivos().subscribe(tickets => this.OrdutegiaSubject.next(tickets));
  }


  getOrdutegisActivos(): Observable<IOrdutegi[]>{
   return this.http.get<IOrdutegi[]>(`${this.baseUrl}/aktiboak`);
  }

  getOrdutegisBorrados(): Observable<IOrdutegi[]>{
    return this.http.get<IOrdutegi[]>(`${this.baseUrl}/ezabatuta`);
   }

  crearOrdutegi(ticket: IOrdutegi): Observable<IOrdutegi> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.post<IOrdutegi>(`${this.baseUrl}/create`, ticket, { headers })
      .pipe(
        tap(nuevoticket => {
          const ticketsActualizados = [...this.OrdutegiaSubject.getValue(), nuevoticket];
          this.OrdutegiaSubject.next(ticketsActualizados);
        })
      );
  }

  actualizarOrdutegi(ticket: IOrdutegi): Observable<IOrdutegi> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
  
    return this.http.put(`${this.baseUrl}/update`, ticket, { headers, responseType: 'text' }).pipe(
      map((response: any) => {
        // Si la respuesta es un texto, puedes convertirla a un formato adecuado o simplemente devolverlo
        console.log(response);  // Aquí verás el mensaje del servidor
        return ticket;  // Aquí devuelves el ticket sin intentar hacer un parseo de JSON
      }),
      catchError(error => {
        console.error('Error al actualizar el ticket:', error);
        return throwError(error); // Re-lanza el error
      })
    );
  }
  
  
  eliminarOrdutegi(ticket: IOrdutegi): Observable<void> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put<void>(`${this.baseUrl}/delete`, ticket, { headers })
      .pipe(
        tap(() => this.getOrdutegisActivos().subscribe(tickets => this.OrdutegiaSubject.next(tickets)))
      );
  }

  eliminarOrdutegiPermanente(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/hard-delete/${id}`, { responseType: 'text' as 'json' });
  }

  get ordutegiak$(): Observable<IOrdutegi[]> {
    return this.OrdutegiaSubject.asObservable();
  }
}
