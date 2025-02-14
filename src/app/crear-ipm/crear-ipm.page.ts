import { Component, OnInit } from '@angular/core';
import { IPM } from '../interfaces/IPM';
import { ITrabajador } from '../interfaces/ITrabajador';
import { IEProduktuak } from '../interfaces/IEProduktuak';
import { LangileakService } from '../services/Langileak.service';
import { ProductoService } from '../services/productos.service';
import { IPMService } from '../services/ProduktuMugimendu.service';

@Component({
  selector: 'app-crear-ipm',
  templateUrl: './crear-ipm.page.html',
  styleUrls: ['./crear-ipm.page.scss'],
})
export class CrearIPMPage implements OnInit {

  ordutegi: IPM = {
    id: null,
    produktuak: 0,
    kantitatea: null,
    data: {
      sortze_data: new Date(),
      eguneratze_data: new Date(),
      ezabatze_data: null
    },
    langilea: 0,
    data_Zutabea: new Date()
  }
    
   
     langileak: ITrabajador[] = [];  
     maileguak: IPM[] = []; 
     produktuak: IEProduktuak[]=[];
   
     constructor(
       private IPMService: IPMService,
       private langileService: LangileakService,
       private produktuService: ProductoService
 
     ) {}
   
     ngOnInit() {
       this.cargarMaileguak();
       this.cargartrabajadores();
       this.cargarMateriales();
     }
   
    cargarMaileguak() {
     this.IPMService.getIPM().subscribe({
       next: (maileguak: IPM[]) => {
         this.maileguak = maileguak;
         console.log('Mailegu cargados:', this.maileguak);
       },
       error: (error: any) => {
         console.error('Error al obtener Maileguak:', error);
       }
     });
   }
 
   cargartrabajadores() {
     this.langileService.getLangileak().subscribe({
       next: (trabajadores: ITrabajador[]) => {
         this.langileak = trabajadores;
         console.log('Mailegu cargados:', this.langileak);
       },
       error: (error: any) => {
         console.error('Error al obtener Maileguak:', error);
       }
     });
   }
 
   cargarMateriales() {
     this.produktuService.getProductos().subscribe({
       next: (productos: IEProduktuak[]) => {
         this.produktuak = productos;
         console.log('productos cargados:', this.produktuak);
       },
       error: (error: any) => {
         console.error('Error al obtener productos:', error);
       }
     });
   }
   
   
   guardarOrdutegi() {
     const { produktuak, langilea, data_Zutabea, data, kantitatea } = this.ordutegi;
   
     if (!produktuak || !langilea || !data_Zutabea || !data ||!kantitatea) {
         alert('Por favor, completa todos los campos obligatorios.');
         return;
     }
   
       const ordutegiToSend: IPM = {
         ...this.ordutegi,
         data: {
           sortze_data: new Date(),
           eguneratze_data: new Date(),
           ezabatze_data: null // Puede ser null si se desea
         }
       };
       
   
       console.log("Enviando al servidor:", ordutegiToSend);
   
       this.IPMService.crearIPM(ordutegiToSend).subscribe({
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
          produktuak: 0,
          kantitatea: 0,
          data: {
            sortze_data: new Date(),
            eguneratze_data: new Date(),
            ezabatze_data: null
          },
          langilea: 0,
          data_Zutabea: new Date()
         }
     }
 }
 
