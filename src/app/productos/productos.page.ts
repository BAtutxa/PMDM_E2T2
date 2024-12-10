import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  productos = [
    { id: 1, nombre: 'Shampoo', tipo: 'Higiene', marca: 'Marca A', stock: 100 },
    { id: 2, nombre: 'Acondicionador', tipo: 'Higiene', marca: 'Marca B', stock: 50 },
    { id: 3, nombre: 'Secador', tipo: 'Herramienta', marca: 'Marca C', stock: 20 },
    { id: 4, nombre: 'Tijeras', tipo: 'Herramienta', marca: 'Marca D', stock: 30 },
    { id: 5, nombre: 'Gel', tipo: 'Higiene', marca: 'Marca E', stock: 75 }
  ];

  ngOnInit() {
    console.log(this.productos); // Verifica si los datos están presentes
  }
}
