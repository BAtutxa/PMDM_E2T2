import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EsHistorialService {

  private esHistorial: boolean = false;

  constructor() {
    const storedHistorial = localStorage.getItem('esHistorial');
    if (storedHistorial) {
      this.esHistorial = JSON.parse(storedHistorial);  
    }
  }

  getEsHistorial(): boolean {
    return this.esHistorial;
  }

  setEsHistorial(value: boolean): void {
    this.esHistorial = value;
    localStorage.setItem('esHistorial', JSON.stringify(value));
  }

  resetEsHistorial(): void {
    this.esHistorial = false;
    localStorage.setItem('esHistorial', JSON.stringify(false));  

  }
}
