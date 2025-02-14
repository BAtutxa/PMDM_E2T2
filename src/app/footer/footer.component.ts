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

  bueltatubotoiaAgertu() {
    const url = this.router.url;
  
    this.agertuBueltatu = url.includes('?desdeHistorial=true') || (
      url === '/productos' || url === '/grupos' || url === '/crear-ficha' || url === '/informes' || url === '/stock' || url === '/materiales'
      || url.startsWith('/citas-del-dia') || url.startsWith('/citas') || url === '/categorias' || url.startsWith('/crear') || url === '/historiala'
      || url === '/material-maileguak' || url === '/produktu-mugimenduak' || url === '/langile' || url === '/txandak' || url === '/editar-grupo' 
      || url === '/ordutegi' || url === '/kolore-historialak' || url === '/kolore-historialak-ezabatuta'
    );
  }
  
  

  bueltatu() {
    this.ubikazioa.back();
  }

  logout() {
    this.router.navigate(['/home']);  
  }

  logoutAgertu() {
    const url = this.router.url;
    this.logOutAgertu = url === '';  
  }

  ngOnInit() {

    this.bueltatubotoiaAgertu();
    this.logoutAgertu();  

    this.router.events.subscribe(() => {

      this.bueltatubotoiaAgertu();
      this.logoutAgertu();  
    });
  }
}
