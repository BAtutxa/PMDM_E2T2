import { Component, HostListener, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaService } from '../services/cita.service';

@Component({
  selector: 'app-citas-del-dia',
  templateUrl: './citas-del-dia.page.html',
  styleUrls: ['./citas-del-dia.page.scss'],
})
export class CitasDelDiaPage implements OnInit, AfterViewInit {
  citas: any[] = [];
  fechaSeleccionada: string | null = null;
  ordenAscendente: boolean = true;
  mobilaDa: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private citaService: CitaService
  ) {}

  // Detectar cambios en el tamaño de la pantalla
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobilaDa = window.innerWidth <= 768;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.fechaSeleccionada = params['fecha'] || null;
      if (this.fechaSeleccionada) {
        this.obtenerCitasPorFecha(this.fechaSeleccionada);
      }
    });
  }

  // Asegurar que se ejecuta después de renderizar la vista
  ngAfterViewInit() {
    setTimeout(() => {
      this.onResize();
    }, 100); // Pequeño retraso para evitar errores de detección
  }

  addCita(citaNueva: any) {
    this.citas.push(citaNueva);
    this.citas.sort((a, b) => a.hasiera_ordua < b.hasiera_ordua ? -1 : 1);
  }

  obtenerCitasPorFecha(fecha: string) {
    this.citaService.getCitasPorFecha(fecha).subscribe(
      (data) => {
        this.citas = data;
        this.ordenarCitasPorAsiento();
      },
      (error) => {
        console.error('Error al obtener las citas:', error);
        this.citas = [];
      }
    );
  }

  ordenarCitasPorAsiento() {
    this.citas.sort((a, b) => {
      return this.ordenAscendente ? a.eserlekua - b.eserlekua : b.eserlekua - a.eserlekua;
    });
  }

  cambiarOrden() {
    this.ordenAscendente = !this.ordenAscendente;
    this.ordenarCitasPorAsiento();
  }

  irACitas() {
    if (this.fechaSeleccionada) {
      this.router.navigate(['/citas'], { queryParams: { fecha: this.fechaSeleccionada } });
    }
  }
}
