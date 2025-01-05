import { Component, HostListener, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ProductoService } from '../services/productos.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  editandoProducto: boolean = false;
  productoConInformacionSeleccionada: boolean = false; // Variable para controlar el modal
  productoSeleccionado: any = {};
  productos: any[] = [];
  productosFiltrados: any[] = []; // Lista para productos filtrados
  mobilaDa: Boolean = false;
  ordenActual: { columna: string, ascendente: boolean } = { columna: '', ascendente: true };

  constructor(private alertController: AlertController, private productoService: ProductoService) {}

  ngOnInit() {
    this.mobilbista();
    this.cargarProductos();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobilbista();
  }

  mobilbista() {
    this.mobilaDa = window.innerWidth <= 768;
  }

  async cargarProductos() {
    try {
      const data = await firstValueFrom(this.productoService.getProductos());
      this.productos = data;
      this.productosFiltrados = [...this.productos]; // Inicializamos la lista filtrada con todos los productos
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  aplicarFiltro(event: any) {
    const texto = event.target.value.toLowerCase(); 
    if (texto.trim() === '') {
      this.productosFiltrados = [...this.productos]; // Si el texto está vacío, mostramos todos los productos
    } else {
      this.productosFiltrados = this.productos.filter((producto) =>
        (producto.izena && producto.izena.toLowerCase().includes(texto)) ||
        (producto.marka && producto.marka.toLowerCase().includes(texto)) ||
        (producto.id_kategoria && producto.id_kategoria.toString().includes(texto))
      );
    }
  }

  verDetalles(producto: any) {
    this.productoSeleccionado = { ...producto }; // Copiar el producto seleccionado
    this.productoConInformacionSeleccionada = true; // Abrir el modal
  }

  editarProducto(producto: any) {
    this.editandoProducto = true;
    this.productoSeleccionado = { ...producto };
  }

  async confirmarEdicion() {
    const alert = await this.alertController.create({
      header: '¿Estás seguro?',
      message: 'Se actualizarán los valores del producto.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: async () => {
            const now = new Date().toISOString(); // Obtiene la fecha y hora en formato ISO
            this.productoSeleccionado.data = this.productoSeleccionado.data || {};
            this.productoSeleccionado.data.eguneratze_data = now;

            try {
              await firstValueFrom(this.productoService.actualizarProducto(this.productoSeleccionado));
              const index = this.productos.findIndex(producto => producto.id === this.productoSeleccionado.id);
              if (index !== -1) {
                this.productos[index] = { ...this.productoSeleccionado };
                this.aplicarFiltro({ target: { value: '' } }); // Refrescamos la lista filtrada
              }
              this.editandoProducto = false;
            } catch (error) {
              console.error('Error al actualizar producto:', error);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  cancelarEdicion() {
    this.editandoProducto = false;
  }

  ordenarPor(columna: string) {
    if (this.ordenActual.columna === columna) {
      this.ordenActual.ascendente = !this.ordenActual.ascendente;
    } else {
      this.ordenActual.columna = columna;
      this.ordenActual.ascendente = true;
    }
  
    this.productosFiltrados.sort((a, b) => {
      let valorA = a[columna];
      let valorB = b[columna];
  
      // Convertir fechas a objetos Date si la columna es de tipo fecha
      if (columna === 'sortze_data' || columna === 'eguneratze_data') {
        valorA = valorA ? new Date(valorA) : null;
        valorB = valorB ? new Date(valorB) : null;
      }
  
      // Comparar los valores
      if (valorA < valorB || valorA === null) {
        return this.ordenActual.ascendente ? -1 : 1;
      } else if (valorA > valorB || valorB === null) {
        return this.ordenActual.ascendente ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
  

  getOrdenClass(columna: string): string {
    if (this.ordenActual.columna === columna) {
      return this.ordenActual.ascendente ? 'orden-asc' : 'orden-desc';
    }
    return '';
  }
}