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

 guardarTxanda() {
  const { langileak, mota, data } = this.ordutegi;

  // Validar que todos los campos obligatorios estén completos
  if (!langileak || !mota || !data) {
    alert('Por favor, completa todos los campos obligatorios.');
    return;
  }

  // Validar que el tipo (mota) sea válido
  if (mota !== 'M' && mota !== 'G') {
    alert('El tipo de txanda es inválido. Debe ser "M" o "G".');
    return;
  }

  const ordutegiToSend: Itxandak = {
    ...this.ordutegi,
    id: null,
    mota: mota,  // Asegurarse de que el tipo es válido
    data: new Date(),
    dataSimple: {
      sortze_data: new Date(),
      eguneratze_data: new Date(),
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
