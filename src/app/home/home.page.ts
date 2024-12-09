import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; // Variable para el mensaje de error

  constructor(private navCtrl: NavController) {}

  login() {
    if (
      (this.password === 'admin' && this.email === 'admin@gmail.com') ||
      (this.password === 'user' && this.email === 'user@gmail.com')
    ) {
      this.navCtrl.navigateForward('/menu');
    } else if (
      (this.password !== 'user' && this.email === 'user@gmail.com') ||
      (this.password !== 'admin' && this.email === 'admin@gmail.com')
    ) {
      this.errorMessage = 'Contraseña incorrecta.';
    } else {
      this.errorMessage = 'Correo o contraseña incorrectos.';
    }
  }
}
