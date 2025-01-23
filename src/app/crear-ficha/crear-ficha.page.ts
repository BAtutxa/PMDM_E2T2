import { Component } from '@angular/core';
import { ClientesService } from '../services/clientes.service';
import { Router } from '@angular/router';

export interface IBezero {
  id: number | null;
  izena: string;
  abizena: string;
  telefonoa: number | null;
  azal_sentikorra: string;
  data: {
    sortze_data: Date | null; 
    eguneratze_data: Date | null;
    ezabatze_data: Date | null;
  };
}

@Component({
  selector: 'app-crear-ficha',
  templateUrl: './crear-ficha.page.html',
  styleUrls: ['./crear-ficha.page.scss'],
})
export class CrearFichaPage {

  ficha: IBezero = {
    id: null, 
    izena: '',
    abizena: '',
    telefonoa: null,
    azal_sentikorra: '', 
    data: {
      sortze_data: new Date(), 
      eguneratze_data: new Date(), 
      ezabatze_data: null, 
    },
  };

  constructor(private clientesService: ClientesService, private router: Router) {}

  guardarFicha() {
    if (!this.ficha.izena || !this.ficha.abizena || !this.ficha.telefonoa) {
      console.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    this.clientesService.crearFicha(this.ficha).subscribe({
      next: (response: IBezero) => {
        this.router.navigate(['/clientes']);
      },
      error: (error: any) => {
        console.error('Error al crear la ficha:', error);
      },
    });
  }
}
