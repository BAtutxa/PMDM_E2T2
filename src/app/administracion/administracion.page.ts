import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';  // Importar el servicio

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.page.html',
  styleUrls: ['./administracion.page.scss'],
})
export class AdministracionPage implements OnInit {

  public name: string = '';  
  public password: string = '';  

  constructor(
    private alertController: AlertController,
    private router: Router,
    private userService: UserService  // Inyectar el servicio
  ) {}

  ngOnInit() {
    // Obtener las credenciales desde el servicio
    const datuak = this.userService.getIzenaEtaPasahitza();
    this.name = datuak.name;
    this.password = datuak.password;
    this.mirarPrivilegios();
  }

  async mirarPrivilegios() {
    if (this.name !== 'Jon Ibarra' || this.password !== 'admin') {
      await this.denegarAcceso();
      this.router.navigate(['/menu']);  // Redirigir si no tiene acceso
    }
  }

  async denegarAcceso() {
    const alert = await this.alertController.create({
      header: 'Acceso Denegado',
      message: 'Solo los profesores pueden entrar.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
