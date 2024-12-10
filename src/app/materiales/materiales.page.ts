import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.page.html',
  styleUrls: ['./materiales.page.scss'],
})
export class MaterialesPage implements OnInit {
  mobilaDa: boolean = false;

  materiales = [
    { id: 1, nombre: 'Shampoo', tipo: 'Higiene', marca: 'Edurne Senosiain', stock: 100 },
    { id: 2, nombre: 'Acondicionador', tipo: 'Higiene', marca: 'Natura Siberica', stock: 50 },
    { id: 3, nombre: 'Secador', tipo: 'Herramienta', marca: 'GHD Helios', stock: 20 },
    { id: 4, nombre: 'Tijeras', tipo: 'Herramienta', marca: 'Filarmónica', stock: 30 },
    { id: 5, nombre: 'Gel', tipo: 'Higiene', marca: 'Magno Classic', stock: 75 }
  ];

  constructor() {}

  ngOnInit() {
    this.mobilbista(); // Comprueba si es móvil al cargar
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobilbista(); 
  }

  mobilbista() {
    this.mobilaDa = window.innerWidth <= 768; // Determina si el ancho de la pantalla es menor o igual a 768px
  }
}
