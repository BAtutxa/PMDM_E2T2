import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Para obtener los parámetros de la URL
import { HttpClient } from '@angular/common/http'; // Para realizar las solicitudes HTTP
import { CitaService } from '../services/cita.service'; // Asegúrate de importar el servicio de citas

@Component({
  selector: 'app-citas-del-dia',
  templateUrl: './citas-del-dia.page.html',
  styleUrls: ['./citas-del-dia.page.scss'],
})
export class CitasDelDiaPage implements OnInit {
  citas: any[] = [];  // Almacena las citas obtenidas de la API
  fechaSeleccionada: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private citaService: CitaService // Inyectamos el servicio de citas
  ) {}

  ngOnInit() {
    // Obtener la fecha seleccionada de los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.fechaSeleccionada = params['fecha'] || null;
      if (this.fechaSeleccionada) {
        this.obtenerCitasPorFecha(this.fechaSeleccionada); // Llamamos a la función para obtener las citas de esa fecha
      }
    });
  }

  // Método para obtener las citas de la API
  obtenerCitasPorFecha(fecha: string) {
    this.citaService.getCitasPorFecha(fecha).subscribe(
      (data) => {
        this.citas = data;
        console.log('Citas obtenidas:', this.citas);
      },
      (error) => {
        console.error('Error al obtener las citas:', error);
        this.citas = []; // Si hay error, aseguramos que el array de citas esté vacío
      }
    );
  }

  // Filtra las citas por el número de 'eserlekua' (columna) y las ordena por 'hasiera_ordua'
  getCitasPorEserlekuaOrdenadas(eserlekua: number) {
    return this.citas
      .filter(cita => cita.eserlekua === eserlekua)  // Filtra por columna (eserlekua)
      .sort((a, b) => {
        // Ordena las citas por la hora de inicio 'hasiera_ordua' (de más temprano a más tarde)
        const horaA = a.hasiera_ordua;
        const horaB = b.hasiera_ordua;
        return horaA < horaB ? -1 : horaA > horaB ? 1 : 0;
      });
  }
}
