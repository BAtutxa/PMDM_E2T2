import { Component} from '@angular/core';
import { ZerbitzuakService } from '../services/zerbitzuak.service';
import { Router } from '@angular/router';

export interface IZerbitzuak{
  id: number |null
  izena: string
  etxeko_prezioa: number | null
  kanpoko_prezioa: number |null
  data: {
    sortze_data: Date | null; 
    eguneratze_data: Date | null;
    ezabatze_data: Date | null;
  };
}

@Component({
  selector: 'app-crear-servicio',
  templateUrl: './crear-servicio.page.html',
  styleUrls: ['../crear-ficha/crear-ficha.page.scss'],
})
export class CrearServicioPage{

  constructor(private zerbitzuakService: ZerbitzuakService, private router: Router) { }

  servicio:IZerbitzuak = {
    id: null,
    izena: "",
    etxeko_prezioa: null,
    kanpoko_prezioa: null,
    data:{
      sortze_data: new Date,
      eguneratze_data: new Date,
      ezabatze_data:  null,
    },
  }

  guardarServicio() {
    if (!this.servicio.izena || !this.servicio.etxeko_prezioa || !this.servicio.kanpoko_prezioa) {
      console.error('Por favor, completa todos los campos obligatorios.');
      return;
    }
  
    console.log('Servicio a guardar:', this.servicio); // Verifica los datos aquí
   
    this.zerbitzuakService.saveZerbitzuak(this.servicio).subscribe({
      next: (response: IZerbitzuak) => {
        this.servicio.id=0;
        alert("Tu servicio ha sido creado.");
        this.router.navigate(['/servicios']);
      },
      error: (error: any) => {
        console.error('Error al crear el servicio:', error);
      },
    });
  }
}
