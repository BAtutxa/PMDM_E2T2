import { TxandaService } from './../services/txanda.service';
import { Component, OnInit } from '@angular/core';
import { Itxandak } from '../interfaces/ITxandak';
import { ITrabajador } from '../interfaces/ITrabajador';
import { LangileakService } from '../services/Langileak.service';

@Component({
  selector: 'app-crear-txandak',
  templateUrl: './crear-txandak.page.html',
  styleUrls: ['./crear-txandak.page.scss'],
})
export class CrearTxandakPage implements OnInit {
guardarTxanda() {
throw new Error('Method not implemented.');
}

 ordutegi: Itxandak = {
   id: null,
   dataSimple: {
     sortze_data: new Date(),
     eguneratze_data: new Date(),
     ezabatze_data: null
   },
   mota: null,
   data: null,
   langileak: {
     kodea: '',
     id: null,
     izena: '',
     abizenak: '',
     data: {
       sortze_data: null,
       eguneratze_data: null,
       ezabatze_data: null
     }
   }
 };
 
   trabajadores: ITrabajador[] = [];  
   txandak: Itxandak[] = []; 
 
 
   constructor(
     private txandaService: TxandaService,
     private langileakService: LangileakService
   ) {}
 
   ngOnInit() {
    this.cargarLangiles();
   }
 
  cargarLangiles() {
   this.langileakService.getLangileak().subscribe({
     next: (trabajadores: ITrabajador[]) => {
       this.trabajadores = trabajadores;
       console.log('Trabajadores cargados:', this.trabajadores);
     },
     error: (error: any) => {
       console.error('Error al obtener Trabajadores:', error);
     }
   });
 }



   guardarOrdutegi() {
     const { langileak, mota, data} = this.ordutegi;
 
     if (!langileak || !mota || !data) {
         alert('Por favor, completa todos los campos obligatorios.');
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
   
     const ordutegiToSend: Itxandak = {
         ...this.ordutegi,
         id: null,
         mota : null,
         data: new Date(),
         dataSimple: {
             sortze_data: new Date(),
             eguneratze_data:new Date(),
             ezabatze_data: null 
         }
     };
 
     console.log("Enviando al servidor:", ordutegiToSend);
 
     this.txandaService.crearTxanda(ordutegiToSend).subscribe({
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
           mota: null,
           data: null,
           langileak: {
             kodea: '',
             id: null,
             izena: '',
             abizenak: '',
             data: {
               sortze_data: null,
               eguneratze_data: null,
               ezabatze_data: null
             }
           },
           dataSimple: {
               sortze_data: null,
               eguneratze_data: null,
               ezabatze_data: null
           }
       };
   }

}
