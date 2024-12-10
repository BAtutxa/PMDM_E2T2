import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  agertuHome: boolean = true;
  agertuBueltatu: boolean = true;

  constructor(private router: Router, private ubikazioa: Location) {}

  // Método para ir a la página Home o Menu
  homebueltatu() {
    const url = this.router.url;

    if (url !== '/menu') {
      this.router.navigate(['/menu']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  // Método para mostrar el botón de Home cuando no estamos en la página Home ni en Calendario
  homebotoiaAgertu() {
    const url = this.router.url;
    this.agertuHome = url !== '/home' && url !== '/calendario';  // El botón de Home aparece si no estamos ni en /home ni en /calendario
  }

  // Método para mostrar el botón de Volver cuando no estamos en la página Calendario
  bueltatubotoiaAgertu() {
    const url = this.router.url;
    this.agertuBueltatu = url !== '/calendario';  // El botón de Volver aparece si no estamos en /calendario
  }

  // Método para navegar hacia atrás
  bueltatu() {
    this.ubikazioa.back();
  }

  ngOnInit() {
    this.homebotoiaAgertu();
    this.bueltatubotoiaAgertu();  // Asegurarse de que el estado del botón de volver se actualiza al cargar

    // Suscribirse a los cambios en las rutas
    this.router.events.subscribe(() => {
      this.homebotoiaAgertu();  // Actualiza visibilidad del botón de home
      this.bueltatubotoiaAgertu();  // Actualiza visibilidad del botón de volver
    });
  }
}
