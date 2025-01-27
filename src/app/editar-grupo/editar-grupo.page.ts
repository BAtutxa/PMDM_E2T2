import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoService } from './../services/equipos.service';
import { IEquipos } from './../interfaces/IEquipos';
import { LangileakService } from '../services/Langileak.service';
import { ITrabajador } from '../interfaces/ITrabajador'
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-editar-grupo',
  templateUrl: './editar-grupo.page.html',
  styleUrls: ['./editar-grupo.page.scss'],
})
export class EditarGrupoPage implements OnInit {
  equipo: IEquipos = {
    langileak: [], // Lista de trabajadores del grupo
    kodea: '',
    izena: '',
    data: {
      sortze_data: null,
      eguneratze_data: null,
      ezabatze_data: null,
    },
  };
  trabajadores: ITrabajador[] = []; 
  grupoId: string | undefined; 

  constructor(
    private activatedRoute: ActivatedRoute,
    private equipoService: EquipoService,
    private langileakService: LangileakService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.grupoId = this.activatedRoute.snapshot.paramMap.get('kodea')!;
    this.cargarGrupo();
    this.cargarTrabajadores();
  }

  cargarGrupo() {
    // Obtener el grupo a editar
    this.equipoService.grupos$.subscribe((grupos) => {
      const grupo = grupos.find((g) => g.kodea === this.grupoId);
      if (grupo) {
        this.equipo = { ...grupo }; // Asignar los datos del grupo a 'equipo'
      }
    });
  }

  cargarTrabajadores() {
    // Obtener los trabajadores disponibles
    this.langileakService.getAllLangileak().subscribe((trabajadores) => {
      this.trabajadores = trabajadores;
    });
  }

  editarGrupo() {
    console.log('Grupo a editar:', this.equipo);
    console.log('Trabajadores seleccionados:', this.equipo.langileak);

    // Verificar si hay trabajadores seleccionados
    if (!this.equipo.langileak || this.equipo.langileak.length === 0) {
      console.error('No se han seleccionado trabajadores.');
      this.alertController
        .create({
          header: 'Error',
          message: 'Debes seleccionar al menos un trabajador.',
          buttons: ['OK'],
        })
        .then((alert) => alert.present());
      return;
    }

    // Actualizar el grupo con los trabajadores seleccionados
    this.equipoService.actualizarGrupo(this.equipo).subscribe({
      next: (grupoActualizado) => {
        console.log('Datos enviados al backend:', this.equipo);
        console.log('Grupo actualizado:', grupoActualizado);
    
        // Actualizar los trabajadores asignados al grupo (esto se hace en paralelo)
        this.actualizarTrabajadores();
    
        // Mostrar la alerta de éxito
        this.alertController
          .create({
            header: '¡Éxito!',
            message: 'El grupo ha sido actualizado correctamente.',
            buttons: ['OK'],
          })
          .then((alert) => {
            alert.present();
            // Recargar la página después de que el usuario haga clic en OK
            alert.onDidDismiss().then(() => {
              window.location.reload();
            });
          });
      },
      error: (err: any) => {
        console.error('Error al actualizar el grupo:', err);
    
        this.alertController
          .create({
            header: 'Error',
            message: 'Hubo un error al actualizar el grupo.',
            buttons: ['OK'],
          })
          .then((alert) => alert.present());
      },
    });    
  }

  actualizarTrabajadores() {
    for (let trabajador of this.equipo.langileak) {
      trabajador.kodea = this.equipo.kodea; 
      console.log("Trabajador antes de actualizar:", trabajador);
      
      this.langileakService.actualizarLangile(trabajador).subscribe({
        next: (trabajadorActualizado) => {
          console.log('Trabajador actualizado:', trabajadorActualizado);
        },
        error: (err) => {
          console.error('Error al actualizar el trabajador:', err);
          console.log('Datos del equipo que se envían:', this.equipo);
        },
      });
    }
  }  
}
