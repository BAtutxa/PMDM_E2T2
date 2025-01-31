import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { TranslateService } from '@ngx-translate/core';
import {HizkuntzaService} from '../services/Hizkuntza.Service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public name: string = '';
  public password: string = '';
  errorMessage: string = ''; 
  pasahitzaIkusi: boolean = false;

  //hizkuntza
  title!: string;
  welcomeMessage!:  string;
  nameLabel!:  string;
  passwordLabel!:  string;
  submitLabel!:  string;
  errorInvalidCredentials!:  string;
  errorGeneric!:  string;
  euskaraz : boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,  
    private translateService: TranslateService,
    private hizkuntzaService: HizkuntzaService
  ) {
    this.translateService.setDefaultLang(this.hizkuntzaService.getHizkuntza());
    this.translateService.use(this.hizkuntzaService.getHizkuntza()); 
  }

  ngOnInit() {
  
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

  togglePasswordVisibility() {
    this.pasahitzaIkusi = !this.pasahitzaIkusi;
  }


  // Método de inicio de sesión
  login() {
    this.userService.login(this.name, this.password).subscribe(
      (isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(['/calendario']); // Redirige al menú si la autenticación es exitosa
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
  changeLanguage(language: string) {
    this.hizkuntzaService.setHizkuntza(language);
    localStorage.setItem('language', language); // Guardar el idioma seleccionado
  }
}
