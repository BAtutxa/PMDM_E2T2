import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaService } from '../services/cita.service';

@Component({
  selector: 'app-confirmar-cita',
  templateUrl: './confirmar-cita.page.html',
  styleUrls: ['./confirmar-cita.page.scss'],
})
export class ConfirmarCitaPage implements OnInit {
  citaData: any = {};
  camposVacios: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private citaService: CitaService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.citaData = { ...params };

      // Aseguramos que las horas estén en el formato correcto (hh:mm:ss)
      if (this.citaData.hora && this.citaData.hora.match(/^\d{1,2}:\d{2}$/)) {
        this.citaData.hora += ':00';
      }
      if (this.citaData.horaFin && this.citaData.horaFin.match(/^\d{1,2}:\d{2}$/)) {
        this.citaData.horaFin += ':00';
      }

      console.log('Datos recibidos y formateados en ngOnInit:', this.citaData);
    });
  }

  confirmar() {
    this.camposVacios = [];

    if (!this.citaData.eslekua) this.camposVacios.push('Eserlekua');
    if (!this.citaData.langilea) this.camposVacios.push('ID Langilea');
    if (!this.citaData.fecha) this.camposVacios.push('Fecha');
    if (!this.citaData.hora) this.camposVacios.push('Hora de inicio');
    if (!this.citaData.horaFin) this.camposVacios.push('Hora de fin');
    if (!this.citaData.nombre) this.camposVacios.push('Nombre');
    if (!this.citaData.telefono) this.camposVacios.push('Teléfono');
    if (!this.citaData.deskribapena) this.camposVacios.push('Descripción');
    if (!this.citaData.etxekoa) this.camposVacios.push('Etxekoa');
    if (!this.citaData.prezioa) this.camposVacios.push('Precio total');

    console.log('Datos verificados para confirmación:', this.citaData);

    if (this.camposVacios.length > 0) {
      alert(
        'Los siguientes campos no están completos: ' +
          this.camposVacios.join(', ')
      );
      console.error('Campos faltantes:', this.camposVacios);
      return;
    }
    const citaAdaptada = {
      eserlekua: this.citaData.eslekua,
      id_langilea: this.citaData.langilea,
      data: this.citaData.fecha,
      hasiera_ordua: this.citaData.hora,
      amaiera_ordua: this.citaData.horaFin,
      hasiera_ordua_erreala: null,
      amaiera_ordua_erreala: null,
      izena: this.citaData.nombre,
      telefonoa: this.citaData.telefono,
      deskribapena: this.citaData.deskribapena,
      etxekoa: this.citaData.etxekoa,
      prezio_totala: this.citaData.prezioa,
      dataSimple: {
        sortze_data: this.citaData.fechaCreacion || null,
        eguneratze_data: this.citaData.fechaActualizacion || null,
        ezabatze_data: null,
      },
    };

    console.log(
      'JSON preparado para enviar:',
      JSON.stringify(citaAdaptada, null, 2)
    );

    this.citaService.createCita(citaAdaptada).subscribe(
      (response) => {
        console.log('Cita guardada con éxito:', response);
        this.router.navigate(['/agradecimiento']);
      },
      (error) => {
        console.error('Error al guardar la cita:', error);
        alert(
          `Error al guardar la cita: ${
            error.error.message || 'Inténtelo de nuevo.'
          }`
        );
      }
    );
  }

  descartar() {
    this.router.navigate(['/citas']);
  }
}
