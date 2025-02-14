import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../services/productos.service';
import { KategoriaService } from '../services/Kategoria.Service';
import { IKategoria } from '../interfaces/IKategoria';
import { IEProduktuak } from '../interfaces/IEProduktuak';

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

  categorias: IKategoria[] = [];  
  productos: IEProduktuak[] = [];  // Almacena la lista reactiva de productos

  constructor(
    private productoService: ProductoService,
    private kategoriaService: KategoriaService
  ) {}

  ngOnInit() {
    this.cargarCategorias();
    this.suscribirseAProductos(); // ✅ Se suscribe a cambios en la lista de productos
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

  suscribirseAProductos() {
    this.productoService.productos$.subscribe({
      next: (productos: IEProduktuak[]) => {
        this.productos = productos;  // ✅ Se actualiza la lista local cuando cambia el servicio
      },
      error: (error: any) => {
        console.error('Error al suscribirse a productos:', error);
      }
    });
  }

  guardarProducto() {
    if (!this.producto.izena || !this.producto.marka || !this.producto.kategoriak.id || !this.producto.stock || !this.producto.stock_alerta) {
      console.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    this.productoService.crearProducto(this.producto).subscribe({
      next: (nuevoProducto: IEProduktuak) => {
        alert("Tu producto ha sido creado.");
        this.producto = {  // ✅ Resetea el formulario tras la creación
          id: null, izena: '', marka: '', deskribapena: null, stock: null, stock_alerta: null,
          kategoriak: { id: null, izena: '', data: { sortze_data: new Date(), eguneratze_data: new Date(), ezabatze_data: null } },
          data: { sortze_data: new Date(), eguneratze_data: new Date(), ezabatze_data: null }
        };
        window.location.reload();
      },
      error: (error: any) => {
        console.error('Error al crear el producto:', error);
      },
    });
  }
}
