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
    const datuak = this.userService.getIzenaEtaPasahitza();
    this.name = datuak.name;
    this.password = datuak.password;
    this.mirarPrivilegios();
  }

  async mirarPrivilegios() {
    // Hacemos la solicitud para obtener la información del usuario
    this.userService.getUserByUsername(this.name).subscribe(
      async (response) => {
        // Verificamos el valor de 'rola'
        if (response && response.rola === 'IR') {
          // El usuario puede acceder, no hacemos nada
        } else {
          // El usuario no puede acceder, denegamos el acceso
          await this.denegarAcceso();
          this.router.navigate(['/menu']);  // Redirigir al menú
        }
      },
      async (error) => {
        console.error('Error al obtener los datos del usuario', error);
        await this.denegarAcceso();
        this.router.navigate(['/menu']);  // Redirigir al menú en caso de error
      }
    );
  }

  // Función para mostrar la alerta de "Acceso Denegado"
  async denegarAcceso() {
    const alert = await this.alertController.create({
      header: 'Acceso Denegado',
      message: 'Solo los profesores con privilegios adecuados pueden entrar.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
