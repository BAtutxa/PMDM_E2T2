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
  eguna: 1,
  hasiera_data: null,
  amaiera_data: null,
  denbora: {
    hasiera_ordua: null,
    amaiera_ordua: null
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

    // Función para formatear fechas como "YYYY-MM-DD"
    const formatFecha = (fecha: any): string | null => {
        return fecha ? new Date(fecha).toISOString().split('T')[0] : null;
    };

    const formatHora = (hora: string | null): string | null => {
      if (!hora) return null; // Verifica que haya un valor
  
      const [hours, minutes] = hora.split(":"); // Divide el string en horas y minutos
  
      if (!hours || !minutes) return null; // Verifica que los valores sean correctos
  
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`; // Retorna el formato "HH:mm:ss"
  };
  
    const ordutegiToSend: IOrdutegi = {
        ...this.ordutegi,
        hasiera_data: formatFecha(hasiera_data),
        amaiera_data: formatFecha(amaiera_data),
        denbora: {
            hasiera_ordua: formatHora(denbora.hasiera_ordua),
            amaiera_ordua: formatHora(denbora.amaiera_ordua)
        },
        data: {
            sortze_data: new Date(),
            eguneratze_data:new Date(),
            ezabatze_data: null // Puede ser null si se desea
        }
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
          id: null,
          kodea: '',
          eguna: 1,
          hasiera_data: null,
          amaiera_data: null,
          denbora: {
              hasiera_ordua: "00:00:00",
              amaiera_ordua: "00:00:00"
          },
          data: {
              sortze_data: null,
              eguneratze_data: null,
              ezabatze_data: null
          }
      };
  }
}
