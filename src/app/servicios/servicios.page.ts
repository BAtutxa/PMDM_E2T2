import { Component, OnInit } from '@angular/core';
import { Zerbitzuak } from './../interfaces/IZerbitzuak';
import { ZerbitzuakService } from '../services/zerbitzuak.service';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.page.html',
  styleUrls: ['./servicios.page.scss'],
})
export class ServiciosPage implements OnInit {
  zerbitzuak: Zerbitzuak[] = [];  // Usamos el modelo Zerbitzuak
  nuevoServicio: Zerbitzuak = {   // Inicializamos el nuevo servicio con el modelo
    izena: '',
    etxeko_prezioa: 0,
    kanpoko_prezioa: 0,
    id: null
  };

  panelNuevoServicio = false;    // Variable que controla si el panel está abierto

  constructor(
    private zerbitzuakService: ZerbitzuakService,
    private modalController: ModalController,
    private alertController: AlertController   // Inyectamos el AlertController
  ) {}

  ngOnInit() {
    this.cargarZerbitzuak();
  }

  async eliminarServicio(id: number | null) {
    if (id !== null) {
      const alert = await this.alertController.create({
        header: 'Confirmar Eliminación',
        message: '¿Estás seguro de que deseas eliminar este servicio?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Eliminación cancelada');
            }
          },
          {
            text: 'Eliminar',
            handler: () => {
              // Si el usuario confirma, proceder con la eliminación
              this.zerbitzuakService.deleteZerbitzuak(id).subscribe(
                (response) => {
                  console.log('Servicio eliminado con éxito:', response);
                  this.cargarZerbitzuak();  // Recargar los servicios después de la eliminación
                },
                (error) => {
                  console.error('Error eliminando servicio:', error);
                }
              );
            }
          }
        ]
      });

      await alert.present();
    } else {
      console.error('ID del servicio no válido para eliminar.');
    }
  }

  cargarZerbitzuak() {
    this.zerbitzuakService.getZerbitzuak().subscribe(
      (data) => {
        this.zerbitzuak = data;
      },
      (error) => {
        console.error('Error cargando servicios:', error);
      }
    );
  }

  guardarServicio() {
    if (this.nuevoServicio.id) {
      // Si hay ID, actualizar el servicio
      this.zerbitzuakService.updateZerbitzuak(this.nuevoServicio).subscribe(
        (response) => {
          console.log('Servicio actualizado con éxito:', response);
          this.cargarZerbitzuak();
          this.cerrarPanelNuevoServicio();
        },
        (error) => {
          console.error('Error actualizando servicio:', error);
        }
      );
    } else {
      // Si no hay ID, crear un nuevo servicio
      this.zerbitzuakService.saveZerbitzuak(this.nuevoServicio).subscribe(
        (response) => {
          console.log('Servicio guardado con éxito:', response);
          this.cargarZerbitzuak();
          this.cerrarPanelNuevoServicio();
        },
        (error) => {
          console.error('Error guardando servicio:', error);
        }
      );
    }
  }

  abrirPanelNuevoServicio(servicio: Zerbitzuak | null = null) {
    this.panelNuevoServicio = true;

    if (servicio) {
      this.nuevoServicio = { ...servicio }; // Rellenar los campos con los datos del servicio a editar
    } else {
      this.nuevoServicio = { izena: '', etxeko_prezioa: 0, kanpoko_prezioa: 0, id: null }; // Limpiar los datos
    }
  }

  cerrarPanelNuevoServicio() {
    this.panelNuevoServicio = false;
    this.nuevoServicio = { izena: '', etxeko_prezioa: 0, kanpoko_prezioa: 0, id: null }; // Limpiar los datos
  }

  editarServicio(servicio: Zerbitzuak) {
    console.log('Editando servicio:', servicio);
    this.nuevoServicio = { ...servicio }; // Rellenar el formulario con los datos del servicio a editar
    this.abrirPanelNuevoServicio(servicio); // Abrir el panel de edición
  }
}
