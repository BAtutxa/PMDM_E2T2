import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {IEUser} from '../interfaces/IEUser';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl: string = 'http://localhost:8080/'; 

  constructor(private http: HttpClient) { }

  getUserByUsername(username: string): Observable<IEUser | null> {
    return this.http.get<IEUser>(`${this.apiUrl}erabiltzaileak/${username}`).pipe( 
      catchError(error => {
        return of(error);  
      })
    );
  }
  login(username: string, password: string): Observable<boolean> {
  

    return this.getUserByUsername(username).pipe(
      map((user: IEUser | null) => {

        if (!user || !user.pasahitza) {
          return false;
        }
  
        const trimmedPassword = password.trim();
        const storedPassword = user.pasahitza.trim();
  
  
        if (storedPassword === trimmedPassword) {
          this.setIzenaEtaPasahitza(user.username, user.pasahitza); 
          this.setRola(user.rola);
          return true;  
        } else {
          return false;  
        }
      }),
      catchError((error) => {
        console.error('Error durante la autenticación:', error); 
        return of(false); 
      })
    );
  }
  
  setRola(rola: string) {
    localStorage.setItem('rola', rola)
  }
  
  setIzenaEtaPasahitza(name: string, password: string): void {
    localStorage.setItem('username', name);
    localStorage.setItem('password', password);
  }

  getIzenaEtaPasahitza() {
    return {
      name: localStorage.getItem('username') || '', 
      password: localStorage.getItem('password') || ''  
    };
  }

  getRola() {
    return {rola: localStorage.getItem('rola') || '', };
  }
}
