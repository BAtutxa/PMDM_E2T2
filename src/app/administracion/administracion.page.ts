import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';  

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
    private userService: UserService  
  ) {}

  ngOnInit() {
    const datuak = this.userService.getIzenaEtaPasahitza();
    this.name = datuak.name;
    this.password = datuak.password;
    this.mirarPrivilegios();
  }

  async mirarPrivilegios() {
    this.userService.getUserByUsername(this.name).subscribe(
      async (response) => {
        if (response && response.rola === 'IR') {
        } else {
          await this.denegarAcceso();
          this.router.navigate(['/menu']);  
        }
      },
      async (error) => {
        console.error('Error al obtener los datos del usuario', error);
        await this.denegarAcceso();
        this.router.navigate(['/menu']);  
      }
    );
  }

  async denegarAcceso() {
    const alert = await this.alertController.create({
      header: 'Sarbidea ukatuta',
      message: 'Pribilegio egokiak dituzten irakasleak bakarrik sar daitezke.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
