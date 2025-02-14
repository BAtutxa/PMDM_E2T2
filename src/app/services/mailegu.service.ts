import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IMaileguak } from '../interfaces/IMaileguak';

@Injectable({
  providedIn: 'root'
})
export class MaileguService {
  private baseUrl = 'http://localhost:8080/api/mailegu'; // URL del backend Spring Boot
  private maileguSubject = new BehaviorSubject<IMaileguak[]>([]); 

  constructor(private http: HttpClient) {
    this.getMaileguak().subscribe(mailegus => this.maileguSubject.next(mailegus));
  }

  getMaileguak(): Observable<IMaileguak[]> {
    return this.http.get<IMaileguak[]>(`${this.baseUrl}/maileguGuztiak`);
  }

  getmailegusDelete(): Observable<IMaileguak[]> {
    return this.http.get<IMaileguak[]>(`${this.baseUrl}/ezabatuta`);
  }

  actualizarmailegu(mailegu: IMaileguak): Observable<IMaileguak> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    
    return this.http.put<IMaileguak>(`${this.baseUrl}/update`, mailegu, { headers }).pipe(
      tap((maileguActualizada) => {
        const mailegusActualizadas = this.maileguSubject.getValue().map(f =>
          f.id === maileguActualizada.id ? maileguActualizada : f  
        );
        this.maileguSubject.next(mailegusActualizadas);  
      })
    );
  }
  
  eliminarmailegu(mailegu: IMaileguak): Observable<void> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.put<void>(`${this.baseUrl}/delete`, mailegu, { headers })
      .pipe(
        tap(() => this.getMaileguak().subscribe(maileguak => this.maileguSubject.next(maileguak)))
      );
  }

  trueEliminarmailegu(mailegu: IMaileguak): Observable<void> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
      return this.http.delete<void>(`${this.baseUrl}/trueDelete/${mailegu.id}`)
      .pipe(
        tap(() => this.getMaileguak().subscribe(mailegus => this.maileguSubject.next(mailegus)))
      );
  }

  
  crearmailegu(mailegu: IMaileguak): Observable<IMaileguak> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    return this.http.post<IMaileguak>(`${this.baseUrl}/create`, mailegu, { headers })
      .pipe(
        tap(() => this.getMaileguak().subscribe(mailegus => this.maileguSubject.next(mailegus)))
      );
  }

  get maileguak$(): Observable<IMaileguak[]> {
    return this.maileguSubject.asObservable();
  }
}
