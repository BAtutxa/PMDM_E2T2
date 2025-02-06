import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaService } from '../services/cita.service';

@Component({
  selector: 'app-citas-del-dia',
  templateUrl: './citas-del-dia.page.html',
  styleUrls: ['./citas-del-dia.page.scss'],
})
export class CitasDelDiaPage implements OnInit {
  citas: any[] = [];
  fechaSeleccionada: string | null = null;
  ordenAscendente: boolean = true; // Definir si el orden es ascendente o descendente


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private citaService: CitaService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.fechaSeleccionada = params['fecha'] || null;
      if (this.fechaSeleccionada) {
        this.obtenerCitasPorFecha(this.fechaSeleccionada);
      }
    });
  }
  
  addCita(citaNueva: any) {
    // Añadir la nueva cita al array de citas
    this.citas.push(citaNueva);
  
    // Ordenar las citas por la hora de inicio (si es necesario)
    this.citas.sort((a, b) => a.hasiera_ordua < b.hasiera_ordua ? -1 : 1);
  }
  

  obtenerCitasPorFecha(fecha: string) {
    this.citaService.getCitasPorFecha(fecha).subscribe(
      (data) => {
        this.citas = data;
        this.ordenarCitasPorAsiento();  // Llamar a la función de ordenar cuando se obtienen las citas
      },
      (error) => {
        console.error('Error al obtener las citas:', error);
        this.citas = [];
      }
    );
  }

  // Función para ordenar las citas por número de asiento
  ordenarCitasPorAsiento() {
    this.citas.sort((a, b) => {
      if (this.ordenAscendente) {
        return a.eserlekua - b.eserlekua; // Ascendente
      } else {
        return b.eserlekua - a.eserlekua; // Descendente
      }
    });
  }

  // Función para cambiar el orden ascendente/descendente
  cambiarOrden() {
    this.ordenAscendente = !this.ordenAscendente;  // Cambiar el estado de orden
    this.ordenarCitasPorAsiento();  // Aplicar el nuevo orden
  }

  irACitas() {
    if (this.fechaSeleccionada) {
      this.router.navigate(['/citas'], { queryParams: { fecha: this.fechaSeleccionada } });
    }
  }
}
