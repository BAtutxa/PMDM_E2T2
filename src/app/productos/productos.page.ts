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
  // Variables para el control de la vista
  editandoProducto: boolean = false;
  productoConInformacionSeleccionada: boolean = false; // Controla si el modal está abierto
  productoSeleccionado: any = {}; // Datos del producto seleccionado
  productos: any[] = []; // Lista de todos los productos
  productosFiltrados: any[] = []; // Lista de productos filtrados
  mobilaDa: Boolean = false; // Para saber si estamos en vista móvil
  ordenActual: { columna: string, ascendente: boolean } = { columna: '', ascendente: true }; // Control de ordenación

  constructor(private alertController: AlertController, private productoService: ProductoService) {}

  ngOnInit() {
    this.mobilbista();
    this.cargarProductos();
  }

  // Escucha los cambios de tamaño de la ventana para adaptar la interfaz
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobilbista();
  }

  // Determina si estamos en vista móvil
  mobilbista() {
    this.mobilaDa = window.innerWidth <= 768;
  }

  // Carga los productos desde el servicio
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
      this.productosFiltrados = [...this.productos]; // Si no hay texto, mostramos todos los productos
    } else {
      this.productosFiltrados = this.productos.filter((producto) => {
        const coincideIzena = producto.izena && producto.izena.toLowerCase().includes(texto);
        const coincideMarka = producto.marka && producto.marka.toLowerCase().includes(texto);
        const coincideId = producto.id && producto.id.toString().includes(texto); // Búsqueda por ID
        const coincideIdKategoria = producto.id_kategoria && producto.id_kategoria.toString().includes(texto);
  
        // Comparar fechas (si existen en el formato adecuado)
        const coincideFecha = producto.fecha && this.compararFechas(producto.fecha, texto);
  
        return coincideIzena || coincideMarka || coincideId || coincideIdKategoria || coincideFecha;
      });
    }
  }
  
  compararFechas(fecha: string, texto: string): boolean {
    // Convertir la fecha a minúsculas para comparación
    const fechaNormalizada = fecha.toLowerCase();
    return fechaNormalizada.includes(texto);
  }
  

  // Muestra los detalles de un producto en el modal
  verDetalles(producto: any) {
    console.log('Producto seleccionado:', producto); // Verificar si el producto es el correcto
    this.productoSeleccionado = { ...producto };
    this.productoConInformacionSeleccionada = true; // Abre el modal
  }

  // Cierra el modal y restablece el estado del modal
  cerrarModal() {
    this.productoConInformacionSeleccionada = false;
  }

  // Inicia la edición de un producto
  editarProducto(producto: any) {
    this.editandoProducto = true;
    this.productoSeleccionado = { ...producto };
  }

  // Confirma la edición del producto
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

  // Cancela la edición de un producto
  cancelarEdicion() {
    this.editandoProducto = false;
  }

  // Ordena los productos por la columna seleccionada
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

  // Devuelve la clase CSS para el orden
  getOrdenClass(columna: string): string {
    if (this.ordenActual.columna === columna) {
      return this.ordenActual.ascendente ? 'orden-asc' : 'orden-desc';
    }
    return '';
  }
}