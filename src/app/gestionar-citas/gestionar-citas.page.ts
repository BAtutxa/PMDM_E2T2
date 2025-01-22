import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-gestionar-citas',
  templateUrl: './gestionar-citas.page.html',
  styleUrls: ['./gestionar-citas.page.scss'],
})
export class GestionarCitasPage implements OnInit {

  citas: any[] = [];
  citaSeleccionada: any = null;
  modalAbierto = false; // Controlar si el modal está abierto o cerrado

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private modalController: ModalController
  ) {}

  ngOnInit() {
    // Obtener todas las citas desde la API
    this.obtenerCitas();
  }

  // Método para obtener las citas de la API
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

  // Método para abrir el modal con los detalles de la cita seleccionada
  abrirModal(cita: any) {
    this.citaSeleccionada = { ...cita }; // Hacer una copia de la cita para editarla
    this.modalAbierto = true;
  }

  // Método para cerrar el modal
  cerrarModal() {
    this.modalAbierto = false;
  }

  // Método para confirmar los cambios (por ahora solo cierra el modal)
  confirmarCambios() {
    console.log('Cita confirmada:', this.citaSeleccionada);
    this.cerrarModal();
  }

  // Método para cancelar los cambios y cerrar el modal
  cancelarCambios() {
    console.log('Cambios cancelados');
    this.cerrarModal();
  }
}
