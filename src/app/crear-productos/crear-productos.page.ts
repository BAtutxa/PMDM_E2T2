import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../services/productos.service';
import { KategoriaService } from '../services/Kategoria.Service';
import { IKategoria } from '../interfaces/IKategoria';
import { Router } from '@angular/router';

export interface IEProduktuak {
  id: number | null;
  izena: string;
  deskribapena: string | null;
  kategoriak: {
    id: number | null;
    izena: string;
    data: {
      sortze_data: Date | null; 
      eguneratze_data: Date | null;
      ezabatze_data: Date | null;
    };
  };
  marka: string;
  stock: number | null;
  stock_alerta: number | null;
  data: {
    sortze_data: Date | null; 
    eguneratze_data: Date | null;
    ezabatze_data: Date | null;
  };
}

@Component({
  selector: 'app-crear-productos',
  templateUrl: './crear-productos.page.html',
  styleUrls: ['../crear-ficha/crear-ficha.page.scss'],
})
export class CrearProductosPage implements OnInit {
  producto: IEProduktuak = {
    id: null,
    izena: '',
    marka: '',
    deskribapena: null,
    stock: null,
    stock_alerta: null,
    kategoriak: {
      id: null,
      izena: '',
      data: {
        sortze_data: new Date(),
        eguneratze_data: new Date(),
        ezabatze_data: null
      },
    },
    data: {
      sortze_data: new Date(),
      eguneratze_data: new Date(),
      ezabatze_data: null
    },
  };

  categorias: IKategoria[] = []; // Guardará las categorías cargadas desde el backend

  constructor(private productoService: ProductoService, private router: Router, private kategoriaService :KategoriaService) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.kategoriaService.getCategorias().subscribe({
      next: (categorias: IKategoria[]) => {
        this.categorias = categorias;
      },
      error: (error: any) => {
        console.error('Error al obtener categorías:', error);
      }
    });
  }

  guardarProducto() {
    if (!this.producto.izena || !this.producto.marka || !this.producto.kategoriak.id || !this.producto.stock || !this.producto.stock_alerta) {
      console.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    this.productoService.crearProducto(this.producto).subscribe({
      next: (response: IEProduktuak) => {
        alert("Tu producto ha sido creado.");
        this.router.navigate(['/productos']);
      },
      error: (error: any) => {
        console.error('Error al crear el producto:', error);
      },
    });
  }
}
