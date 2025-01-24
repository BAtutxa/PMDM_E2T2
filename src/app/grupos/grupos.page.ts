import { Component, OnInit } from '@angular/core';
import { EquipoService } from './../services/equipos.service';
import { IEquipos } from './../interfaces/IEquipos';
import { AlertController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
})
export class GruposPage implements OnInit {
  grupos: IEquipos[] = []; // Lista de grupos

  constructor(private equipoService: EquipoService, private alertController: AlertController) {}

  ngOnInit(): void {
    this.cargarGrupos(); // Cargar los grupos al inicializar
  }

  cargarGrupos(): void {
    this.equipoService.grupos$.subscribe({
      next: (grupos) => {
        this.grupos = grupos;
        console.log('Grupos cargados:', grupos);
      },
      error: (err) => {
        console.error('Error al cargar los grupos:', err);
      },
    });
  }

  editarGrupo(index: number) {

  }

  async eliminarGrupo(grupo: IEquipos): Promise<void> {
    // Crear y mostrar el alert de confirmación
    const alert = await this.alertController.create({
      header: '¿Estás seguro?',
      message: 'Se eliminará el grupo seleccionado.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            const now = new Date();
            grupo.data = grupo.data || {};
            grupo.data.ezabatze_data = now;
  
            try {
              await firstValueFrom(this.equipoService.eliminarGrupo(grupo));
            
              this.grupos = this.grupos.filter((g) => g.kodea !== grupo.kodea);
              window.location.reload();
            } catch (error) {
              console.error('Error al eliminar el grupo:', error);
            }
          },
        },
      ],
    });
  
    // Mostrar el alert
    await alert.present();
  }  
}
