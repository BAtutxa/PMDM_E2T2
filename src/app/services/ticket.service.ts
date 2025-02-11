import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { ITicket } from '../interfaces/ITicket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private baseUrl = 'http://localhost:8080/api/ticket_lerroak'; 
  private ticketSubject = new BehaviorSubject<ITicket[]>([]);

  constructor(private http: HttpClient) {
    this.getTicketActivos().subscribe(tickets => this.ticketSubject.next(tickets));
  }


  getTicketActivos(): Observable<ITicket[]>{
   return this.http.get<ITicket[]>(`${this.baseUrl}/aktiboak`);
  }

  getTicketBorrados(): Observable<ITicket[]>{
    return this.http.get<ITicket[]>(`${this.baseUrl}/ezabatuta`);
   }

  crearTicket(ticket: ITicket): Observable<ITicket> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.post<ITicket>(`${this.baseUrl}/create`, ticket, { headers })
      .pipe(
        tap(nuevoticket => {
          const ticketsActualizados = [...this.ticketSubject.getValue(), nuevoticket];
          this.ticketSubject.next(ticketsActualizados);
        })
      );
  }

  actualizarTicket(ticket: ITicket): Observable<ITicket> {
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
  
  
  eliminarticket(ticket: ITicket): Observable<void> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put<void>(`${this.baseUrl}/delete`, ticket, { headers })
      .pipe(
        tap(() => this.getTicketActivos().subscribe(tickets => this.ticketSubject.next(tickets)))
      );
  }

  eliminarticketPermanente(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/hard-delete/${id}`, { responseType: 'text' as 'json' });
  }

  get tickets$(): Observable<ITicket[]> {
    return this.ticketSubject.asObservable();
  }
}
