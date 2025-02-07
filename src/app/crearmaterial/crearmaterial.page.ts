import { Router } from '@angular/router';
import { MaterialService } from './../services/materiales.service';
import { Component } from '@angular/core';

export interface IEMaterialak{
    id: number | null,
    izena: string,
    etiketa: string,
    data: {
      sortze_data : Date |null,
      eguneratze_data :Date |null,
      ezabatze_data : Date |null,
    }
}

@Component({
  selector: 'app-crearmaterial',
  templateUrl: './crearmaterial.page.html',
  styleUrls: ['../crear-ficha/crear-ficha.page.scss'],
})
export class CrearmaterialPage {

  constructor(private materialService: MaterialService, private router: Router) {}

  material: IEMaterialak = {
    id: null,
    izena: '',
    etiketa: '',
    data: {
      sortze_data : new Date(),
      eguneratze_data :new Date(),
      ezabatze_data : null,
    }
  };

  guardarMaterial() {
      if (!this.material.izena || !this.material.etiketa) {
        console.error('Por favor, completa todos los campos obligatorios.');
        return;
      }
    
      this.materialService.crearMaterial(this.material).subscribe({
        next: (response: IEMaterialak) => {
          alert("Tu ficha ha sido creada.")
          this.router.navigate(['/materiales']);
        },
        error: (error: any) => {
          console.error('Error al crear la ficha:', error);
        },
      });
    }

}
