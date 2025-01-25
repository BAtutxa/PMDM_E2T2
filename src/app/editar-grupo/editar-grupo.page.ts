import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoService } from './../services/equipos.service';
import { IEquipos } from './../interfaces/IEquipos';
import { LangileakService } from '../services/Langileak.service';
import { ITrabajador } from '../interfaces/ITrabajador';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-editar-grupo',
  templateUrl: './editar-grupo.page.html',
  styleUrls: ['./editar-grupo.page.scss'],
})
export class EditarGrupoPage implements OnInit {
  ficha: IEquipos = {
    langileak: [],
    kodea: '',
    izena: '',
    data: {
      sortze_data: null,
      eguneratze_data: null,
      ezabatze_data: null
    },
  };  // Inicialización de la propiedad ficha
  trabajadores: ITrabajador[] = []; // Lista de trabajadores disponibles
  grupoId: string | undefined; // ID del grupo desde la URL

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
      const grupo = grupos.find(g => g.kodea === this.grupoId);
      if (grupo) {
        this.ficha = { ...grupo }; // Asignar los datos del grupo a 'ficha'
      }
    });
  }

  cargarTrabajadores() {
    // Obtener los trabajadores
    this.langileakService.getAllLangileak().subscribe((trabajadores) => {
      this.trabajadores = trabajadores;
    });
  }

  editarGrupo() {
    console.log('Grupo a editar:', this.ficha);
    console.log('Trabajadores seleccionados:', this.ficha.langileak);
  
    // Verificar si hay trabajadores seleccionados
    if (!this.ficha.langileak || this.ficha.langileak.length === 0) {
      console.error('No se han seleccionado trabajadores.');
      this.alertController.create({
        header: 'Error',
        message: 'Debes seleccionar al menos un trabajador.',
        buttons: ['OK'],
      }).then(alert => alert.present());
      return;
    }
  
    // Enviar la información completa al backend
    this.equipoService.actualizarGrupo(this.ficha).subscribe({
      next: (grupoActualizado) => {
        console.log('Grupo actualizado:', grupoActualizado);
  
        this.alertController.create({
          header: '¡Éxito!',
          message: 'El grupo ha sido actualizado correctamente.',
          buttons: ['OK'],
        }).then(alert => alert.present());
      },
      error: (err) => {
        console.error('Error al actualizar el grupo:', err);
  
        this.alertController.create({
          header: 'Error',
          message: 'Hubo un error al actualizar el grupo.',
          buttons: ['OK'],
        }).then(alert => alert.present());
      },
    });
  }  
}
