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
  
    // Llama a la API para obtener los datos del usuario
    return this.getUserByUsername(username).pipe(
      map((user: IEUser | null) => {
        console.log('Datos del usuario obtenidos de la API:', user); 

        if (!user || !user.pasahitza) {
          console.error('No se encontró el usuario o la contraseña');
          return false;
        }
  
        // Recorta y registra las contraseñas para depuración
        const trimmedPassword = password.trim();
        const storedPassword = user.pasahitza.trim();
  
  
        // Realiza la comparación de contraseñas
        if (storedPassword === trimmedPassword) {
          console.log('¡Inicio de sesión exitoso!');
          this.setIzenaEtaPasahitza(user.username, user.pasahitza); // Almacena las credenciales si el inicio de sesión es exitoso
          return true;  // Inicio de sesión exitoso
        } else {
          return false;  // Inicio de sesión fallido
        }
      }),
      catchError((error) => {
        console.error('Error durante la autenticación:', error); // Registra cualquier error durante el proceso de autenticación
        return of(false);  // Retorna false en caso de error
      })
    );
  }
  
  
  // Guardar las credenciales en el localStorage
  setIzenaEtaPasahitza(name: string, password: string): void {
    localStorage.setItem('username', name);
    localStorage.setItem('password', password);
  }

  // Obtener las credenciales desde el localStorage
  getIzenaEtaPasahitza() {
    return {
      name: localStorage.getItem('username') || '', 
      password: localStorage.getItem('password') || ''  
    };
  }
}
