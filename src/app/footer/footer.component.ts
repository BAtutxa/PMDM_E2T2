import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit {
  agertu: boolean = true;

  constructor(private router: Router, private ubikazioa: Location) {}

  homebueltatu() {
    const url = this.router.url;

    if (url != '/menu') {
      this.router.navigate(['/menu']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  homebotoiaAgertu() {
    const url = this.router.url;
    this.agertu = url !== '/home';
  }

  ngOnInit() {
    this.homebotoiaAgertu();
    this.router.events.subscribe(() => {
      this.homebotoiaAgertu();
    });
  }
  bueltatu() {
    const url = this.router.url;
    this.ubikazioa.back();
  }
}
