import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ProductoService } from '../services/productos.service';
import { firstValueFrom } from 'rxjs';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content: IonContent | undefined;

  editandoProducto: boolean = false;
  productoConInformacionSeleccionada: boolean = false;
  productoSeleccionado: any = {};
  productoSeleccionadoAnterior: any = null; // Variable para almacenar el producto seleccionado previamente
  productos: any[] = [];
  productosFiltrados: any[] = [];
  mobilaDa: Boolean = false;
  ordenActual: { columna: string, ascendente: boolean } = { columna: '', ascendente: true };
  productosPorPagina = 10;
  paginaActual = 1;

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
      this.productosFiltrados = [...this.productos];
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1) {
      this.paginaActual = 1;
    } else if (pagina > Math.ceil(this.productosFiltrados.length / this.productosPorPagina)) {
      this.paginaActual = Math.ceil(this.productosFiltrados.length / this.productosPorPagina);
    } else {
      this.paginaActual = pagina;
    }
  }

  // Mueve la vista al primer producto
  moverVistaAlPrimerProducto() {
    if (this.content) {
      // Desplazar la vista a la posición del primer producto
      this.content.scrollToTop(500); // Ajusta el tiempo si es necesario
    }
  }

  verDetalles(producto: any) {
    console.log('Producto seleccionado:', producto);
    this.productoSeleccionado = { ...producto };
    this.productoConInformacionSeleccionada = true;
  }

  cerrarModal() {
    this.productoConInformacionSeleccionada = false;
  }

  editarProducto(producto: any) {
    this.productoSeleccionadoAnterior = { ...this.productoSeleccionado }; // Guardar el producto seleccionado previamente
    this.editandoProducto = true;
    this.productoSeleccionado = { ...producto };

    // Mover la vista al primer producto
    this.moverVistaAlPrimerProducto();
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
            const now = new Date().toISOString();
            this.productoSeleccionado.data = this.productoSeleccionado.data || {};
            this.productoSeleccionado.data.eguneratze_data = now;

            try {
              await firstValueFrom(this.productoService.actualizarProducto(this.productoSeleccionado));
              const index = this.productos.findIndex(producto => producto.id === this.productoSeleccionado.id);
              if (index !== -1) {
                this.productos[index] = { ...this.productoSeleccionado };
                this.aplicarFiltro({ target: { value: '' } });
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
  // Restaurar el producto seleccionado previamente
  this.productoSeleccionado = { ...this.productoSeleccionadoAnterior };
  this.editandoProducto = false;

  // Si no estamos en vista móvil, volvemos a mostrar el producto seleccionado
  if (this.content && this.productoSeleccionado.id) {
    const productoIndex = this.productos.findIndex(p => p.id === this.productoSeleccionado.id);
    if (productoIndex !== -1) {
      // Mover la vista al producto seleccionado previamente
      const productoElemento = document.getElementById(`producto-${this.productoSeleccionado.id}`);
      if (productoElemento) {
        productoElemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
}


  aplicarFiltro(event: any) {
    const texto = event.target.value.toLowerCase();
    
    if (texto.trim() === '') {
      this.productosFiltrados = [...this.productos];
    } else {
      this.productosFiltrados = this.productos.filter((producto) => {
        const coincideIzena = producto.izena && producto.izena.toLowerCase().includes(texto);
        const coincideMarka = producto.marka && producto.marka.toLowerCase().includes(texto);
        const coincideId = producto.id && producto.id.toString().includes(texto);
        const coincideIdKategoria = producto.id_kategoria && producto.id_kategoria.toString().includes(texto);
        const coincideFecha = producto.fecha && this.compararFechas(producto.fecha, texto);
  
        return coincideIzena || coincideMarka || coincideId || coincideIdKategoria || coincideFecha;
      });
    }
  }
  
  compararFechas(fecha: string, texto: string): boolean {
    const fechaNormalizada = fecha.toLowerCase();
    return fechaNormalizada.includes(texto);
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

      if (columna === 'sortze_data' || columna === 'eguneratze_data') {
        valorA = valorA ? new Date(valorA) : null;
        valorB = valorB ? new Date(valorB) : null;
      }

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
