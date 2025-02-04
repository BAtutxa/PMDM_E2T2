import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EsHistorialService {

  private esHistorial: boolean = false;  

  constructor() { }
  getEsHistorial(): boolean {
    return this.esHistorial;
  }

  setEsHistorial(value: boolean): void {
    this.esHistorial = value;
  }

  resetEsHistorial(): void {
    this.esHistorial = false;  
    console.log('esHistorial ha sido restablecido a false');
  }
}
