import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // Esto hace que el servicio esté disponible en toda la aplicación
})
export class UserService {
  private name: string = '';
  private password: string = '';

  constructor() { }

  setIzenaEtaPasahitza(name: string, password: string) {
    this.name = name;
    this.password = password;
  }

  getIzenaEtaPasahitza() {
    return { name: this.name, password: this.password };
  }
}
