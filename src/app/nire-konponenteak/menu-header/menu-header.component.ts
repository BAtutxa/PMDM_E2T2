import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ModoOscuroService } from 'src/app/services/ModoOscuro.service';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.scss'],
})
export class MenuHeaderComponent implements OnInit {
  esProfe: Boolean = false;
  modoOscuro: Boolean = false;

  constructor(
    private userService: UserService,
    private modoOscuroService: ModoOscuroService
  ) {}

  ngOnInit() {
    this.mirarPrivilegios();
    this.cargarModoPreferido();  // Cargar el modo preferido al iniciar
  }

  mirarPrivilegios() {
    const rol = this.userService.getRola().rola;
    if (rol === 'IR') {
      this.esProfe = true;
    } else {
      this.esProfe = false;
    }
  }

  // Cargar el modo preferido desde el servicio
  cargarModoPreferido() {
    this.modoOscuro = this.modoOscuroService.getModoOscuro();
    if (this.modoOscuro) {
      this.activarModoOscuro();
    }
  }

  // Activar el modo oscuro en el body y el ion-content
  activarModoOscuro() {
    document.body.classList.add('dark');
    const ionContent = document.querySelector('ion-content');
    if (ionContent) {
      ionContent.classList.add('dark'); // Aplicar el estilo oscuro en el ion-content
    }
  }

  // Desactivar el modo oscuro en el body y el ion-content
  desactivarModoOscuro() {
    document.body.classList.remove('dark');
    const ionContent = document.querySelector('ion-content');
    if (ionContent) {
      ionContent.classList.remove('dark'); // Eliminar el estilo oscuro en el ion-content
    }
  }

  // Cambiar el modo oscuro
  ponerModoOscuro() {
    this.modoOscuro = !this.modoOscuro;
    if (this.modoOscuro) {
      this.activarModoOscuro();
    } else {
      this.desactivarModoOscuro();
    }
    this.modoOscuroService.setModoOscuro(this.modoOscuro);  // Guarda el estado en localStorage
  }
}
