import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { CitaService } from '../services/cita.service';  // Asegúrate de importar el servicio de citas

@Component({
  selector: 'app-gestionar-citas',
  templateUrl: './gestionar-citas.page.html',
  styleUrls: ['./gestionar-citas.page.scss'],
})
export class GestionarCitasPage implements OnInit {

  citas: any[] = [];
  citaSeleccionada: any = null;
  modalAbierto = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalController: ModalController,
    private citaService: CitaService  // Inyectar el servicio de citas
  ) {}

  ngOnInit() {
    this.obtenerCitas();
  }

  obtenerCitas() {
    this.http.get<any[]>('http://localhost:8080/hitzorduak/hitzorduakGuztiak').subscribe(
      (data) => {
        this.citas = data;
        console.log('Citas obtenidas:', this.citas);
      },
      (error) => {
        console.error('Error al obtener las citas:', error);
      }
    );
  }

  abrirModal(cita: any) {
    this.citaSeleccionada = { ...cita }; // Hacer una copia de la cita para editarla
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  // Método para confirmar los cambios (actualizar la cita)
  confirmarCambios() {
    console.log('Confirmando cambios para la cita:', this.citaSeleccionada);

    // Convertir la fecha a un objeto Date y sumar un día
    let fecha = new Date(this.citaSeleccionada.data);
    fecha.setDate(fecha.getDate() + 1); // Sumar 1 día

    // Convertir la fecha de nuevo a formato ISO string (sin la parte de la hora)
    this.citaSeleccionada.data = fecha.toISOString().split('T')[0];  // Solo la fecha (YYYY-MM-DD)

    // Llamar al servicio para actualizar la cita
    this.citaService.updateCita(this.citaSeleccionada).subscribe(
      (response) => {
        console.log('Cita actualizada exitosamente:', response);
        this.obtenerCitas(); // Volver a obtener las citas actualizadas
        this.cerrarModal(); // Cerrar el modal después de la actualización
      },
      (error) => {
        console.error('Error al actualizar la cita:', error);
      }
    );
  }


  cancelarCambios() {
    console.log('Eliminando cita:', this.citaSeleccionada);

    // Llamar al servicio para eliminar la cita
    this.citaService.deleteCita(this.citaSeleccionada.id).subscribe(
      (response) => {
        console.log('Cita eliminada exitosamente:', response);
        // Eliminar la cita de la lista en la interfaz
        this.citas = this.citas.filter(cita => cita.id !== this.citaSeleccionada.id);
        this.cerrarModal(); // Cerrar el modal después de la eliminación
      },
      (error) => {
        console.error('Error al eliminar la cita:', error);
      }
    );
  }
}
