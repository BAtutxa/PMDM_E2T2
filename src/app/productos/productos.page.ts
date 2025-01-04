import { Component, HostListener, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ProductoService } from '../services/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  editandoProducto: boolean = false;
  productoConInformacionSeleccionada: boolean = false;  // Variable para controlar el modal
  productoSeleccionado: any = {};
  productos: any[] = [];
  mobilaDa: Boolean = false;

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

  cargarProductos() {
    this.productoService.getProductos().subscribe(
      (data) => {
        this.productos = data;
      },
      (error) => {
        console.error('Error al cargar productos:', error);
      }
    );
  }

  // Función para ver los detalles del producto
  verDetalles(producto: any) {
    this.productoSeleccionado = { ...producto };  // Copiar el producto seleccionado
    this.productoConInformacionSeleccionada = true;  // Abrir el modal
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
          handler: () => {
            const now = new Date().toISOString(); // Obtiene la fecha y hora en formato ISO
            this.productoSeleccionado.data = this.productoSeleccionado.data || {};
            this.productoSeleccionado.data.eguneratze_data = now;
  
            this.productoService.actualizarProducto(this.productoSeleccionado).subscribe(
              () => {
                const index = this.productos.findIndex(producto => producto.id === this.productoSeleccionado.id);
                if (index !== -1) {
                  this.productos[index] = { ...this.productoSeleccionado };
                }
                this.editandoProducto = false;
              },
              (error) => {
                console.error('Error al actualizar producto:', error);
              }
            );
          },
        },
      ],
    });
  
    await alert.present();
  }

  cancelarEdicion() {
    this.editandoProducto = false;
  }
}
