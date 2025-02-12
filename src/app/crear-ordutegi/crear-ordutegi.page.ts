import { OrdutegiService } from './../services/Ordutegi.service';
import { Component, OnInit } from '@angular/core';
import { IOrdutegi } from '../interfaces/IOrdutegi';
import { IEquipos } from '../interfaces/IEquipos';
import { EquipoService } from '../services/equipos.service';

@Component({
  selector: 'app-crear-ordutegi',
  templateUrl: './crear-ordutegi.page.html',
  styleUrls: ['./crear-ordutegi.page.scss'],
})
export class CrearOrdutegiPage {
ordutegi: IOrdutegi = {
  id: null,
  kodea: '',
  eguna: null,
  hasiera_data: null,
  amaiera_data: null,
  denbora: {
    hasiera_ordua: {
      hours: 0,
      minutes: 0
    },
    amaiera_ordua: {
      hours: 0,
      minutes: 0
    },
  },
  data:{
    sortze_data: new Date(),
    eguneratze_data: new Date(),
    ezabatze_data: null
  },
 };

  equipos: IEquipos[] = [];  
  Ordutegiak: IOrdutegi[] = []; 

  constructor(
    private ordutegiService: OrdutegiService,
    private equipoService: EquipoService
  ) {}

  ngOnInit() {
    this.cargarEquipos();
    this.suscribirseAProductos(); 
  }

 cargarEquipos() {
  this.equipoService.grupos$.subscribe({
    next: (equipos: IEquipos[]) => {
      this.equipos = equipos;
      console.log('Equipos cargados:', this.equipos);
    },
    error: (error: any) => {
      console.error('Error al obtener equipos:', error);
    }
  });
}


  suscribirseAProductos() {
    this.ordutegiService.ordutegiak$.subscribe({
      next: (ordutegiak: IOrdutegi[]) => {
        this.Ordutegiak = ordutegiak;  // ✅ Se actualiza la lista local cuando cambia el servicio
      },
      error: (error: any) => {
        console.error('Error al suscribirse a productos:', error);
      }
    });
  }

  guardarOrdutegi() {
    const { kodea, eguna, hasiera_data, amaiera_data, denbora } = this.ordutegi;
  
    if (!kodea || !eguna || !hasiera_data || !amaiera_data || !denbora?.hasiera_ordua || !denbora?.amaiera_ordua) {
      console.error('Por favor, completa todos los campos obligatorios.');
      return;
    }
  
    const formatFecha = (fecha: any) => fecha ? new Date(fecha).toISOString().split('T')[0] : null;
    const today = new Date().toISOString().split('T')[0];
  
    const ordutegiToSend: IOrdutegi = {
      ...this.ordutegi,
      hasiera_data: formatFecha(hasiera_data),
      amaiera_data: formatFecha(amaiera_data),
      denbora: {
        hasiera_ordua: { hours: denbora.hasiera_ordua.hours, minutes: denbora.hasiera_ordua.minutes },
        amaiera_ordua: { hours: denbora.amaiera_ordua.hours, minutes: denbora.amaiera_ordua.minutes }
      },
      data: { sortze_data:  new Date(), eguneratze_data:  new Date(), ezabatze_data:  new Date() }
    };
  
    console.log("Enviando al servidor:", ordutegiToSend);
  
    this.ordutegiService.crearOrdutegi(ordutegiToSend).subscribe({
      next: () => {
        alert("El ordutegi ha sido creado.");
        this.resetOrdutegi();
        window.location.reload();
      },
      error: (error: any) => console.error('Error al crear el ordutegi:', error)
    });
  }
  
  resetOrdutegi() {
    this.ordutegi = {
      id: null, kodea: '', eguna: null, hasiera_data: null, amaiera_data: null,
      denbora: { hasiera_ordua: { hours: 0, minutes: 0 }, amaiera_ordua: { hours: 0, minutes: 0 } },
      data: { sortze_data: new Date(), eguneratze_data:  new Date(), ezabatze_data: null }
    };
  }  
}
