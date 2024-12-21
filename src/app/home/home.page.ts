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

  constructor(
    private router: Router,
    private userService: UserService,  
  ) {}

  login() {
    this.userService.login(this.name, this.password).subscribe(
      (isAuthenticated) => {
        console.log('Autenticación:', isAuthenticated);
        if (isAuthenticated) {
          this.router.navigate(['/menu']);  // Si la autenticación es exitosa, redirigir
        } else {
          this.errorMessage = 'Ez dago ondo ondo zure pasahitza edo erabiltzaile.';  // Mostrar error si el login falla
        }
      },
      (error) => {
        console.error('Error en el login:', error);
        this.errorMessage = 'Errore bat egon da autentifikazioan.';  // Manejo de errores
      }
    );
  }
}
