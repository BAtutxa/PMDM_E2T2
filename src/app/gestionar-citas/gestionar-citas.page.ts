import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestionar-citas',
  templateUrl: './gestionar-citas.page.html',
  styleUrls: ['./gestionar-citas.page.scss'],
})
export class GestionarCitasPage implements OnInit {

  citas: any[] = [];
  citaSeleccionada: any = null;

  constructor(private http: HttpClient, private router: Router) {}

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

  // Método para mostrar los detalles de una cita
  mostrarDetalles(cita: any) {
    this.citaSeleccionada = cita;
  }
}
