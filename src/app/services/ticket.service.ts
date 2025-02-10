import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ITicket } from '../interfaces/ITicket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private baseUrl = 'http://localhost:8080/api/ticket_lerroak'; // URL del backend Spring Boot
  private ticketSubject = new BehaviorSubject<ITicket[]>([]); // Estado reactivo

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
    return this.http.put<ITicket>(`${this.baseUrl}/update`, ticket, { headers })
      .pipe(
        tap(ticketActualizado => {
          const ticketsActualizados = this.ticketSubject.getValue().map(p =>
            p.id === ticketActualizado.id ? ticketActualizado : p
          );
          this.ticketSubject.next(ticketsActualizados);
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
