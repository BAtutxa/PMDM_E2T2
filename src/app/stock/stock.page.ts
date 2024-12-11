import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss'],
})
export class StockPage implements OnInit {
  mobilaDa: boolean = false;
  editandoMaterial: boolean = false;  // Para controlar si estamos editando
  materialSeleccionado: any = {};  // Para almacenar el material seleccionado

  materiales = [
    { id: 1, nombre: 'Shampoo', tipo: 'Higiene', marca: 'Edurne Senosiain', stock: 100 },
    { id: 2, nombre: 'Acondicionador', tipo: 'Higiene', marca: 'Natura Siberica', stock: 50 },
    { id: 3, nombre: 'Secador', tipo: 'Herramienta', marca: 'GHD Helios', stock: 20 },
    { id: 4, nombre: 'Tijeras', tipo: 'Herramienta', marca: 'Filarmónica', stock: 30 },
    { id: 5, nombre: 'Gel', tipo: 'Higiene', marca: 'Magno Classic', stock: 75 }
  ];

  constructor(private alertController: AlertController) {}

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

  editarMaterial(material: any) {
    this.editandoMaterial = true;  // Activamos el modo de edición
    this.materialSeleccionado = { ...material };  // Copiamos los datos del material seleccionado
  }

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
              this.materialSeleccionado[campo] = data.nuevoValor;
            }
          },
        },
      ],
    });

    await alert.present();
  }

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
            const index = this.materiales.findIndex(material => material.id === this.materialSeleccionado.id);
            if (index !== -1) {
              this.materiales[index] = { ...this.materialSeleccionado };
            }
            this.editandoMaterial = false; 
          },
        },
      ],
    });

    await alert.present();
  }

  cancelarEdicion() {
    this.editandoMaterial = false;  
  }

  // Método para añadir un producto
  async produktuGehitu() {
    const nuevoProducto: any = {}; // Creamos un objeto para el nuevo producto
  
    // Pedimos el ID
    const idAlert = await this.alertController.create({
      header: 'Añadir Producto',
      inputs: [
        {
          name: 'id',
          type: 'number',
          placeholder: 'ID del producto',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Si se cancela, no añadimos el producto
            return false;
          }
        },
        {
          text: 'Confirmar',
          handler: (data) => {
            if (data.id) {
              nuevoProducto.id = data.id; // Asignamos el ID al producto
            }
          },
        },
      ],
    });
    await idAlert.present();
  
    // Verificamos si el usuario cerró el pop-up, si lo hizo, cancelamos el proceso
    const idResult = await idAlert.onDidDismiss();
    if (idResult.role === 'cancel') return;
  
    // Después pedimos el nombre
    const nombreAlert = await this.alertController.create({
      header: 'Añadir Producto',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del producto',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Si se cancela, no añadimos el producto
            return false;
          }
        },
        {
          text: 'Confirmar',
          handler: (data) => {
            if (data.nombre) {
              nuevoProducto.nombre = data.nombre; // Asignamos el nombre
            }
          },
        },
      ],
    });
    await nombreAlert.present();
  
    const nombreResult = await nombreAlert.onDidDismiss();
    if (nombreResult.role === 'cancel') return;
  
    // Pedimos el tipo
    const tipoAlert = await this.alertController.create({
      header: 'Añadir Producto',
      inputs: [
        {
          name: 'tipo',
          type: 'text',
          placeholder: 'Tipo del producto',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Si se cancela, no añadimos el producto
            return false;
          }
        },
        {
          text: 'Confirmar',
          handler: (data) => {
            if (data.tipo) {
              nuevoProducto.tipo = data.tipo; // Asignamos el tipo
            }
          },
        },
      ],
    });
    await tipoAlert.present();
  
    const tipoResult = await tipoAlert.onDidDismiss();
    if (tipoResult.role === 'cancel') return;
  
    // Pedimos la marca
    const marcaAlert = await this.alertController.create({
      header: 'Añadir Producto',
      inputs: [
        {
          name: 'marca',
          type: 'text',
          placeholder: 'Marca del producto',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Si se cancela, no añadimos el producto
            return false;
          }
        },
        {
          text: 'Confirmar',
          handler: (data) => {
            if (data.marca) {
              nuevoProducto.marca = data.marca; // Asignamos la marca
            }
          },
        },
      ],
    });
    await marcaAlert.present();
  
    const marcaResult = await marcaAlert.onDidDismiss();
    if (marcaResult.role === 'cancel') return;
  
    // Finalmente pedimos el stock
    const stockAlert = await this.alertController.create({
      header: 'Añadir Producto',
      inputs: [
        {
          name: 'stock',
          type: 'number',
          placeholder: 'Stock del producto',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            // Si se cancela, no añadimos el producto
            return false;
          }
        },
        {
          text: 'Confirmar',
          handler: (data) => {
            if (data.stock) {
              nuevoProducto.stock = data.stock; // Asignamos el stock
            }
          },
        },
      ],
    });
    await stockAlert.present();
  
    const stockResult = await stockAlert.onDidDismiss();
    if (stockResult.role === 'cancel') return;
    this.materiales.push(nuevoProducto); 
  }  
}
