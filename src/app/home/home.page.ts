import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';  

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public name: string = '';
  public password: string = '';
  errorMessage: string = ''; 

  constructor(private router: Router, private userService: UserService) {}  // Inyectar el servicio

  login() {
    if (
      (this.password === 'admin' && this.name === 'Jon Ibarra') ||
      (this.password === 'user' && this.name === 'Oier García')
    ) {
      // Guardar las credenciales usando el servicio
      this.userService.setIzenaEtaPasahitza(this.name, this.password);
      this.router.navigate(['/menu']); 
    } else {
      this.errorMessage = 'Correo o contraseña incorrectos.';
    }
  }
}
