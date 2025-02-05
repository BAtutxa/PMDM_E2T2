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
    this.agertuBueltatu = (url == '/historiala' || url == '/productos' || url == '/grupos' || url == '/crear-ficha' || url =='/informes' || url == '/stock' || url == '/materiales');
  }
  

  bueltatu() {
    this.ubikazioa.back();
  }

  logout() {
    this.router.navigate(['/home']);  
  }

  logoutAgertu() {
    const url = this.router.url;
    this.logOutAgertu = url === '/calendario';  
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
