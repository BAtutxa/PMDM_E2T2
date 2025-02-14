import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { Itxandak } from '../interfaces/ITxandak';

@Injectable({
  providedIn: 'root'
})
export class TxandaService {
  private baseUrl = 'http://localhost:8080/api/txandak'; 
  private OrdutegiaSubject = new BehaviorSubject<Itxandak[]>([]);

  constructor(private http: HttpClient) {
    this.getTxandaActivos().subscribe(tickets => this.OrdutegiaSubject.next(tickets));
  }


  getTxandaActivos(): Observable<Itxandak[]>{
   return this.http.get<Itxandak[]>(`${this.baseUrl}/aktiboak`);
  }

  getTxandaBorrados(): Observable<Itxandak[]>{
    return this.http.get<Itxandak[]>(`${this.baseUrl}/ezabatuta`);
   }

  crearTxanda(ticket: Itxandak): Observable<Itxandak> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.post<Itxandak>(`${this.baseUrl}/create`, ticket, { headers })
      .pipe(
        tap(nuevoticket => {
          const ticketsActualizados = [...this.OrdutegiaSubject.getValue(), nuevoticket];
          this.OrdutegiaSubject.next(ticketsActualizados);
        })
      );
  }

  actualizarTxanda(ticket: Itxandak): Observable<Itxandak> {
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
        console.error('Error al actualizar la txanda:', error);
        return throwError(error); // Re-lanza el error
      })
    );
  }
  
  
  eliminarTxanda(ticket: Itxandak): Observable<void> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put<void>(`${this.baseUrl}/delete`, ticket, { headers })
      .pipe(
        tap(() => this.getTxandaActivos().subscribe(txanda => this.OrdutegiaSubject.next(txanda)))
      );
  }

  eliminarTxandaPermanente(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/hard-delete/${id}`, { responseType: 'text' as 'json' });
  }

  get ordutegiak$(): Observable<Itxandak[]> {
    return this.OrdutegiaSubject.asObservable();
  }
}
