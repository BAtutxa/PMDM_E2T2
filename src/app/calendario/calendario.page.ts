import { Component } from '@angular/core';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage {
  meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  
  anioActual: number = new Date().getFullYear();
  mesActual: number = new Date().getMonth();
  diaSeleccionado: number | null = null;

  diasMes: number[] = [];
  grupoSeleccionado = '';
  citasSeleccionadas: string[] = [];

  grupos = ['Talde_1', 'Talde_2', 'Talde_3', 'Talde_4', 'Talde_5'];
  citas = ['Alejandro, corte de pelo', 'Oier, corte de pelo', 'Raúl, tinte', 'Luca, peinado'];

  constructor() {
    this.generarCalendario();
  }

  generarCalendario() {
    const inicioMes = new Date(this.anioActual, this.mesActual, 1).getDay();
    const diasEnMes = new Date(this.anioActual, this.mesActual + 1, 0).getDate();

    const dias = [];
    for (let i = 0; i < inicioMes; i++) {
      dias.push(0);
    }
    for (let i = 1; i <= diasEnMes; i++) {
      dias.push(i);
    }

    this.diasMes = dias;
  }

  cambiarMes(incremento: number) {
    this.mesActual += incremento;

    if (this.mesActual < 0) {
      this.mesActual = 11;
      this.anioActual--;
    } else if (this.mesActual > 11) {
      this.mesActual = 0;
      this.anioActual++;
    }

    this.diaSeleccionado = null;
    this.generarCalendario();
  }

  seleccionarDia(dia: number) {
    if (dia > 0) {
      this.diaSeleccionado = dia;

      // Actualiza el grupo y las citas aleatoriamente
      this.grupoSeleccionado = this.grupos[Math.floor(Math.random() * this.grupos.length)];
      this.citasSeleccionadas = Array.from(
        { length: Math.floor(Math.random() * 4) + 1 },
        () => this.citas[Math.floor(Math.random() * this.citas.length)],
      );
    }
  }
}
