import { Component, OnInit } from '@angular/core';
import { KategoriaService } from '../services/Kategoria.Service';
import { Router } from '@angular/router';

export interface IKategoria {
  id: number | null;
  izena: string;
  data: {
    sortze_data: Date | null; 
    eguneratze_data: Date | null;
    ezabatze_data: Date | null;
  };
}

@Component({
  selector: 'app-crear',
  templateUrl: './crear.page.html',
  styleUrls: ['../crear-ficha/crear-ficha.page.scss'],
})


export class CrearPage {

  
  categoria: IKategoria = {
     id: null, 
     izena: '',
     data: {
       sortze_data: new Date(), 
       eguneratze_data: new Date(), 
       ezabatze_data: null, 
     },
   };
 
   constructor(private kategoriaService: KategoriaService, private router: Router) {}
 
 
   guardarCategoria() {
     if (!this.categoria.izena) {
       console.error('Por favor, completa todos los campos obligatorios.');
       return;
     }
   
     this.kategoriaService.crearCategoria(this.categoria).subscribe({
       next: (response: IKategoria) => {
         alert("Tu categoria ha sido creada.")
         this.router.navigate(['/categorias']);
       },
       error: (error: any) => {
         console.error('Error al crear la categoria:', error);
       },
     });
   }
}
