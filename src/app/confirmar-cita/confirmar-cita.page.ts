import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaService } from '../services/cita.service';  // Asegúrate de importar el servicio

@Component({
  selector: 'app-confirmar-cita',
  templateUrl: './confirmar-cita.page.html',
  styleUrls: ['./confirmar-cita.page.scss'],
})
export class ConfirmarCitaPage implements OnInit {
  citaData: any = {}; // Aquí se guardarán los datos recibidos
  camposVacios: string[] = []; // Aquí guardaremos los nombres de los campos vacíos

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private citaService: CitaService  // Inyectamos el servicio
  ) { }

  ngOnInit() {
    // Obtenemos los parámetros pasados en la URL para el componente
    this.route.queryParams.subscribe(params => {
      this.citaData = params;
      console.log('Datos recibidos en ngOnInit:', this.citaData); // Verifica los datos que llegan en la URL
    });
  }

  // Función para confirmar y guardar la cita
  confirmar() {
    // Reseteamos la lista de campos vacíos
    this.camposVacios = [];

    // Comprobamos si alguno de los campos importantes está vacío
    if (!this.citaData.eslekua) this.camposVacios.push('Eserlekua');
    if (!this.citaData.fecha) this.camposVacios.push('Fecha');
    if (!this.citaData.hora) this.camposVacios.push('Hora de inicio');
    if (!this.citaData.horaFin) this.camposVacios.push('Hora de fin');
    if (!this.citaData.nombre) this.camposVacios.push('Nombre');
    if (!this.citaData.telefono) this.camposVacios.push('Teléfono');
    if (!this.citaData.deskribapena) this.camposVacios.push('Descripción');
    if (!this.citaData.etxekoa) this.camposVacios.push('Etxekoa');
    if (!this.citaData.prezioa) this.camposVacios.push('Precio total');

    // No verificamos 'fechaCreacion' y 'fechaActualizacion' si no son campos obligatorios

    // Mostrar los datos recibidos para depuración
    console.log('Datos verificados para confirmación:', this.citaData);

    // Si hay campos vacíos, mostramos un mensaje de error con los campos faltantes
    if (this.camposVacios.length > 0) {
      alert('Los siguientes campos no están completos: ' + this.camposVacios.join(', '));
      console.error('Campos faltantes:', this.camposVacios);
      return; // Detiene la ejecución si hay campos vacíos
    }

    // Crear el objeto para enviar, ahora solo usando los datos del formulario
    const citaAdaptada = {
      eserlekua: this.citaData.eserlekua,  // Cambiado para coincidir
      data: this.citaData.fecha,           // Cambiado para coincidir
      hasiera_ordua: this.citaData.hora,   // Cambiado para coincidir
      amaiera_ordua: this.citaData.horaFin, // Cambiado para coincidir
      izena: this.citaData.nombre,         // Cambiado para coincidir
      telefonoa: this.citaData.telefono,
      deskribapena: this.citaData.deskribapena,
      etxekoa: this.citaData.etxekoa,
      prezio_totala: this.citaData.prezioa,
      dataSimple: {
        sortze_data: this.citaData.fechaCreacion || null,
        eguneratze_data: this.citaData.fechaActualizacion || null,
        ezabatze_data: this.citaData.dataSimple?.ezabatze_data || null,
      }
    };    
    

    console.log('Datos enviados al backend:', citaAdaptada);

    // Llamamos al servicio para guardar la cita
    this.citaService.createCita(citaAdaptada).subscribe(
      response => {
        console.log('Cita guardada con éxito:', response);
        this.router.navigate(['/agradecimiento']);  // Redirige a la página de agradecimiento
      },
      error => {
        console.error('Error al guardar la cita:', error);
        alert('Ha ocurrido un error al guardar la cita. Por favor, inténtelo de nuevo.');
      }
    );
  }

  // Función para descartar la cita
  descartar() {
    this.router.navigate(['/citas']);  // Redirige a la página de citas
  }
}
