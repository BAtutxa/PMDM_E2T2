import { Component, HostListener, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  editandoProducto: boolean = false; 
  productoSeleccionado: any = {}; 

  productos = [
    { id: 1, nombre: '"Shampoo"', tipo: 'Higienea', marca: 'Edurne Senosiain', stock: 100 },
    { id: 2, nombre: 'Ile-egokitzailea', tipo: 'Higienea', marca: 'Natura Sibérica', stock: 50 },
    { id: 3, nombre: 'Lehorgailua', tipo: 'Herreminta', marca: 'GHD Helios', stock: 20 },
    { id: 4, nombre: 'Artaziak', tipo: 'Herreminta', marca: 'Filarmónica', stock: 30 },
    { id: 5, nombre: 'Krema', tipo: 'Higienea', marca: 'Magno Classic', stock: 75 }
  ];

  constructor(private alertController: AlertController) {}
  mobilaDa: Boolean = false;

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

  // Método para cambiar a modo edición
  editarMaterial(material: any) {
    this.editandoProducto = true;  // Activamos el modo de edición
    this.productoSeleccionado = { ...material };  // Copiamos los datos del material seleccionado
  }

  // Método para solicitar la edición de un campo
  async editarCampo(campo: string) {
    const alert = await this.alertController.create({
      header: `Editar ${campo}`,
      inputs: [
        {
          name: 'nuevoValor',
          type: 'text',
          placeholder: `Nuevo valor para ${campo}`,
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: (data) => {
            if (data.nuevoValor) {
              this.productoSeleccionado[campo] = data.nuevoValor;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  // Método para confirmar la edición
  async confirmarEdicion() {
    const alert = await this.alertController.create({
      header: '¿Estás seguro?',
      message: '¿Quieres guardar los cambios realizados?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            // Guardamos los cambios realizados
            const index = this.productos.findIndex(producto => producto.id === this.productoSeleccionado.id);
            if (index !== -1) {
              this.productos[index] = { ...this.productoSeleccionado };
            }
            this.editandoProducto = false;  // Salimos del modo de edición
          },
        },
      ],
    });

    await alert.present();
  }

  // Método para cancelar la edición
  cancelarEdicion() {
    this.editandoProducto = false;  // Salimos del modo de edición sin guardar los cambios
  }

  // Método para pedir stock
  async pedirStock() {
    const alert = await this.alertController.create({
      header: 'Consulta enviada',
      message: 'Su consulta sobre el stock ha sido enviada.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
