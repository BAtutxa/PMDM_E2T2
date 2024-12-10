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
      hora: ['', [Validators.required]],
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
      const alert = await this.alertCtrl.create({
        header: 'Error',
        message: 'Por favor, rellena todos los campos correctamente.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  

  descartarCita() {
    this.citaForm.reset();
  }
}
