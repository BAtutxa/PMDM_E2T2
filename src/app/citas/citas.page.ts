import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
})
export class CitasPage {
  citaForm: FormGroup;

  constructor(private fb: FormBuilder, private alertCtrl: AlertController) {
    this.citaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      servicio: ['', [Validators.required]],
      hora: ['', [Validators.required, Validators.pattern('^(?:[01]?[0-9]|2[0-3]):([0-5]?[0-9])$')]],  // Validación para hora (ej: 14:30)
    });
  }

  async confirmarCita() {
    if (this.citaForm.valid) {
      const datos = this.citaForm.value;

      // Log para depurar valores
      console.log('Datos del formulario:', datos);

      const alert = await this.alertCtrl.create({
        header: 'Cita Confirmada',
        message: `Nombre: ${datos.nombre}<br>Apellidos: ${datos.apellidos}<br>Teléfono: ${datos.telefono}<br>Servicio: ${datos.servicio}<br>Hora: ${datos.hora}`,
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      let errorMessage = 'Por favor, rellena todos los campos correctamente.';

      // Verifica qué campo tiene error
      if (this.citaForm.get('nombre')?.invalid) {
        errorMessage = 'El campo "Nombre" es obligatorio.';
      } else if (this.citaForm.get('apellidos')?.invalid) {
        errorMessage = 'El campo "Apellidos" es obligatorio.';
      } else if (this.citaForm.get('telefono')?.invalid) {
        errorMessage = 'Por favor, ingresa un número de teléfono válido.';
      } else if (this.citaForm.get('servicio')?.invalid) {
        errorMessage = 'Por favor, selecciona un servicio.';
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
