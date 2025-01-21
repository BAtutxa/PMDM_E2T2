import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
})
export class CitasPage implements OnInit {
  citaForm: FormGroup;
  fechaSeleccionada: string = ''; // Variable para almacenar la fecha seleccionada

  constructor(
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) {
    this.citaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      hora: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?:[01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$'),
        ],
      ], // Validación para hora (ej: 14:30:00)
      eslekua: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Campo obligatorio, solo números
      deskribapena: ['', [Validators.required]], // Campo obligatorio, texto
      etxekoa: ['', [Validators.required]], // Campo obligatorio con las opciones 'K' o 'E'
      prezioa: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{1,2})?$')],
      ], // Campo obligatorio, precio con formato decimal
      langilea: ['', [Validators.required]], // Campo obligatorio
      horaFin: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?:[01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$'),
        ],
      ], // Campo obligatorio para la hora final
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.fechaSeleccionada = params['fecha'] || 'Fecha no seleccionada'; // Asigna la fecha o un mensaje por defecto
      console.log('Fecha recibida:', this.fechaSeleccionada); // Verifica la fecha recibida
    });
  }

  async confirmarCita() {
    if (this.citaForm.valid) {
      const datos = this.citaForm.value;

      // Redirigir a la página 'confirmar-cita' y pasar los datos como parámetros
      this.navCtrl.navigateForward(['/confirmar-cita'], {
        queryParams: {
          nombre: datos.nombre,
          telefono: datos.telefono,
          hora: datos.hora,
          fecha: this.fechaSeleccionada,
          eslekua: datos.eslekua,
          deskribapena: datos.deskribapena,
          etxekoa: datos.etxekoa,
          prezioa: datos.prezioa,
          langilea: datos.langilea,
          horaFin: datos.horaFin,  // Asegúrate de agregar 'horaFin' aquí
        },
      });
      
    } else {
      let errorMessage = 'Por favor, rellena todos los campos correctamente.';

      // Verifica qué campo tiene error
      if (this.citaForm.get('nombre')?.invalid) {
        errorMessage = 'El campo "Nombre" es obligatorio.';
      } else if (this.citaForm.get('telefono')?.invalid) {
        errorMessage = 'Por favor, ingresa un número de teléfono válido.';
      } else if (this.citaForm.get('hora')?.invalid) {
        errorMessage = 'Por favor, ingresa una hora válida (ejemplo: 14:30).';
      }

      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: errorMessage,
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  descartarCita() {
    this.citaForm.reset();
  }
}
