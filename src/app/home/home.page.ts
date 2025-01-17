import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public name: string = '';
  public password: string = '';
  errorMessage: string = ''; 

  // Variables para almacenar los textos traducidos
  title!: string;
  welcomeMessage!:  string;
  nameLabel!:  string;
  passwordLabel!:  string;
  submitLabel!:  string;
  errorInvalidCredentials!:  string;
  errorGeneric!:  string;

  constructor(
    private router: Router,
    private userService: UserService,  
    private translateService: TranslateService
  ) {
    // Establecer el idioma predeterminado
    this.translateService.setDefaultLang('es');
    this.translateService.use('es'); // Cambiar idioma predeterminado (puedes configurar según sea necesario)
  }

  ngOnInit() {
    // Obtener las traducciones al inicializar el componente
    this.translateService.get([
      'LOGIN.TITLE', 'LOGIN.WELCOME', 'LOGIN.NAME', 'LOGIN.PASSWORD', 'LOGIN.SUBMIT',
      'LOGIN.ERROR.INVALID_CREDENTIALS', 'LOGIN.ERROR.GENERIC_ERROR'
    ]).subscribe((translations) => {
      this.title = translations['LOGIN.TITLE'];
      this.welcomeMessage = translations['LOGIN.WELCOME'];
      this.nameLabel = translations['LOGIN.NAME'];
      this.passwordLabel = translations['LOGIN.PASSWORD'];
      this.submitLabel = translations['LOGIN.SUBMIT'];
      this.errorInvalidCredentials = translations['LOGIN.ERROR.INVALID_CREDENTIALS'];
      this.errorGeneric = translations['LOGIN.ERROR.GENERIC_ERROR'];
    });
  }

  // Método de inicio de sesión
  login() {
    this.userService.login(this.name, this.password).subscribe(
      (isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(['/menu']); // Redirige al menú si la autenticación es exitosa
        } else {
          // Asigna el mensaje de error traducido
          this.errorMessage = this.errorInvalidCredentials;
        }
      },
      (error) => {
        console.error('Error en el login:', error);
        // Asigna el mensaje de error genérico traducido
        this.errorMessage = this.errorGeneric;
      }
    );
  }

  // Método para cambiar el idioma dinámicamente
  changeLanguage(lang: string) {
    this.translateService.use(lang);  // Cambia el idioma
    this.ngOnInit();  // Re-carga las traducciones para reflejar el cambio de idioma
  }
}
