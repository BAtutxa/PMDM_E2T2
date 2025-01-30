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
  logOutAgertu: boolean = false;

  constructor(private router: Router, private ubikazioa: Location) {}

  // Método para mostrar el botón de Volver cuando no estamos en la página Calendario
  bueltatubotoiaAgertu() {
    const url = this.router.url;
    this.agertuBueltatu = url == '/productos';
  }

  // Método para navegar hacia atrás
  bueltatu() {
    this.ubikazioa.back();
  }

  // Método de logout
  logout() {
    this.router.navigate(['/home']);  
  }

  // Método para mostrar el botón de Log Out solo en la página Home
  logoutAgertu() {
    const url = this.router.url;
    this.logOutAgertu = url === '/calendario';  
  }

  ngOnInit() {

    this.bueltatubotoiaAgertu();
    this.logoutAgertu();  // Asegúrate de llamar a logoutAgertu al inicializar el componente

    this.router.events.subscribe(() => {

      this.bueltatubotoiaAgertu();
      this.logoutAgertu();  // Llamar siempre que cambie la ruta
    });
  }
}
