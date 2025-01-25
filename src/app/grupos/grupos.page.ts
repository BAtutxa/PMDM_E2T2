import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoService } from './../services/equipos.service';
import { IEquipos } from './../interfaces/IEquipos';
import { AlertController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { LangileakService } from '../services/Langileak.service';
import { ITrabajador } from '../interfaces/ITrabajador';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
})
export class GruposPage implements OnInit {
  grupos: IEquipos[] = [];
  ficha: IEquipos = { 
    langileak: [],
    kodea: '',      // Inicializado con valor vacío
    izena: '',      // Inicializado con valor vacío
    data: {
      sortze_data: null,
      eguneratze_data: null,
      ezabatze_data: null
    }        // Inicializado con objeto vacío
  }; // Inicializamos con un objeto vacío que incluye todos los campos
  trabajadores: ITrabajador[] = []; // Lista de trabajadores disponibles
  grupoId: string | undefined; // Para almacenar el ID del grupo desde la URL

  constructor(
    private equipoService: EquipoService,
    private alertController: AlertController,
    private langileakService: LangileakService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.grupoId = this.activatedRoute.snapshot.paramMap.get('kodea')!;
    this.cargarGrupos();
    this.cargarTrabajadores();
  }

  cargarGrupos(): void {
    this.equipoService.grupos$.subscribe({
      next: (grupos) => {
        this.grupos = grupos;
        console.log('Grupos cargados:', grupos);

        const grupo = this.grupos.find(grupo => grupo.kodea === this.grupoId);
        if (grupo) {
          this.ficha = { ...grupo }; // Asignamos los datos del grupo a 'ficha'
        } else {
          console.error('Grupo no encontrado con el ID:', this.grupoId);
        }
      },
      error: (err) => {
        console.error('Error al cargar los grupos:', err);
      },
    });
  }

  cargarTrabajadores() {
    this.langileakService.getAllLangileak().subscribe(trabajadores => {
      this.trabajadores = trabajadores;
      console.log('Trabajadores disponibles:', this.trabajadores);
    });
  }

  // Método para editar el grupo
  editarGrupo() {
    console.log('Grupo a editar:', this.ficha);
    
    this.equipoService.actualizarGrupo(this.ficha).subscribe({
      next: (grupoActualizado) => {
        console.log('Grupo actualizado:', grupoActualizado);
      },
      error: (err) => {
        console.error('Error al actualizar el grupo:', err);
      }
    });
  }

  async eliminarGrupo(grupo: IEquipos): Promise<void> {
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
    await alert.present();
  }
}
