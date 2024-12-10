import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  constructor(){}
  mobilaDa:Boolean = false;
  productos = [
    { id: 1, nombre: 'Shampoo', tipo: 'Higiene', marca: 'Edurne Senosiain', stock: 100 },
    { id: 2, nombre: 'Acondicionador', tipo: 'Higiene', marca: 'Natura Siberica', stock: 50 },
    { id: 3, nombre: 'Secador', tipo: 'Herramienta', marca: 'GHD Helios', stock: 20 },
    { id: 4, nombre: 'Tijeras', tipo: 'Herramienta', marca: 'Filarmónica', stock: 30 },
    { id: 5, nombre: 'Gel', tipo: 'Higiene', marca: 'Magno Classic', stock: 75 }
  ];

  ngOnInit() {
    this.mobilbista(); 
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobilbista(); 
  }
  mobilbista() {
    this.mobilaDa = window.innerWidth <= 768; 
  }
}
