import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {

  // Lista de pedidos con datos de ejemplo
  pedidos = [
    { id: 1, nombreCliente: 'Juan Pérez', servicio: 'Ile orrazketa.', hora: '10:00', precio: 20.5, comentarios: 'Ile orrazketa.' },
    { id: 2, nombreCliente: 'María López', servicio: 'Mozketa', hora: '10:00', precio: 15.0, comentarios: 'Mozketa.' },
    { id: 3, nombreCliente: 'Carlos García', servicio: 'Ile orrazketa', hora: '10:00', precio: 30.0, comentarios: 'Ile orrazketa.' },
    { id: 4, nombreCliente: 'Alejandro Rivas', servicio: 'Ile orrazketa.', hora: '10:00', precio: 20.5, comentarios: 'Ile orrazketa.' },
    { id: 5, nombreCliente: 'María Pérez', servicio: 'Mozketa', hora: '10:00', precio: 15.0, comentarios: 'Mozketa.' },
    { id: 6, nombreCliente: 'Carlos López', servicio: 'Ile orrazketa.', hora: '10:00', precio: 30.0, comentarios: 'Ile orrazketa.' }
  ];

  // Ficha del cliente actual
  fichaCliente: any = null;

  // Control de visibilidad del modal
  isModalOpen: boolean = false;

  constructor(private alertController: AlertController) {}

  ngOnInit() {}

  // Función para abrir la ficha del cliente
  openFichaCliente(pedido: any) {
    this.fichaCliente = pedido;
    this.isModalOpen = true; // Abrir el modal
  }

  // Función para cerrar el modal
  closeFicha() {
    this.isModalOpen = false; // Cerrar el modal
    this.fichaCliente = null; // Limpiar la ficha del cliente
  }

  // Función para crear un nuevo cliente
  async crearCliente() {
    const nuevoCliente: any = {}; // Creamos un objeto para el nuevo cliente

    // Pedimos el ID
    const idAlert = await this.alertController.create({
      header: 'Añadir cliente',
      inputs: [
        {
          name: 'id',
          type: 'number',
          placeholder: 'ID del cliente',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Siguiente',
          handler: (data) => {
            if (data.id) {
              nuevoCliente.id = data.id; // Asignamos el ID al cliente
            }
          },
        },
      ],
    });
    await idAlert.present();

    const idResult = await idAlert.onDidDismiss();
    if (!nuevoCliente.id) return; // Verificamos si se ingresó un ID

    // Pedimos el nombre del cliente
    const nombreAlert = await this.alertController.create({
      header: 'Añadir cliente',
      inputs: [
        {
          name: 'nombreCliente',
          type: 'text',
          placeholder: 'Nombre del cliente',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Siguiente',
          handler: (data) => {
            if (data.nombreCliente) {
              nuevoCliente.nombreCliente = data.nombreCliente; // Asignamos el nombre del cliente
            }
          },
        },
      ],
    });
    await nombreAlert.present();

    const nombreResult = await nombreAlert.onDidDismiss();
    if (!nuevoCliente.nombreCliente) return; // Verificamos si se ingresó un nombre

    // Pedimos el servicio
    const servicioAlert = await this.alertController.create({
      header: 'Añadir cliente',
      inputs: [
        {
          name: 'servicio',
          type: 'text',
          placeholder: 'Servicio solicitado',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Siguiente',
          handler: (data) => {
            if (data.servicio) {
              nuevoCliente.servicio = data.servicio; // Asignamos el servicio
            }
          },
        },
      ],
    });
    await servicioAlert.present();

    const servicioResult = await servicioAlert.onDidDismiss();
    if (!nuevoCliente.servicio) return; // Verificamos si se ingresó un servicio

    // Pedimos la hora
    const horaAlert = await this.alertController.create({
      header: 'Añadir cliente',
      inputs: [
        {
          name: 'hora',
          type: 'time',
          placeholder: 'Hora del servicio',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Siguiente',
          handler: (data) => {
            if (data.hora) {
              nuevoCliente.hora = data.hora; // Asignamos la hora
            }
          },
        },
      ],
    });
    await horaAlert.present();

    const horaResult = await horaAlert.onDidDismiss();
    if (!nuevoCliente.hora) return; // Verificamos si se ingresó una hora

    // Pedimos el precio
    const precioAlert = await this.alertController.create({
      header: 'Añadir cliente',
      inputs: [
        {
          name: 'precio',
          type: 'number',
          placeholder: 'Precio del servicio',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Siguiente',
          handler: (data) => {
            if (data.precio) {
              nuevoCliente.precio = data.precio; // Asignamos el precio
            }
          },
        },
      ],
    });
    await precioAlert.present();

    const precioResult = await precioAlert.onDidDismiss();
    if (!nuevoCliente.precio) return; // Verificamos si se ingresó un precio

    // Pedimos los comentarios
    const comentariosAlert = await this.alertController.create({
      header: 'Añadir cliente',
      inputs: [
        {
          name: 'comentarios',
          type: 'text',
          placeholder: 'Comentarios adicionales',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Finalizar',
          handler: (data) => {
            if (data.comentarios) {
              nuevoCliente.comentarios = data.comentarios; // Asignamos los comentarios
            }
          },
        },
      ],
    });
    await comentariosAlert.present();

    const comentariosResult = await comentariosAlert.onDidDismiss();
    if (!nuevoCliente.comentarios) return; // Verificamos si se ingresaron comentarios

    // Añadimos el nuevo cliente a la lista de pedidos
    this.pedidos.push(nuevoCliente);
  }

  async borrarCliente() {
    // Crear un pop-up para pedir el ID del cliente a eliminar
    const alert = await this.alertController.create({
      header: 'Bezero kendu',
      inputs: [
        {
          name: 'id',
          type: 'number',
          placeholder: 'Bezero id ipini',
        },
      ],
      buttons: [
        {
          text: 'Kantzelatu',
          role: 'cancel',
          handler: () => {
            console.log('Eliminación cancelada');
          },
        },
        {
          text: 'Ezabatu',
          handler: (data) => {
            // Validar el ID introducido
            if (!data.id) {
              console.error('Bezero id hori ez da existitzen');
              return;
            }
  
            // Buscar el cliente por ID
            const index = this.pedidos.findIndex(pedido => pedido.id === parseInt(data.id, 10));
  
            if (index > -1) {
              // Eliminar el cliente
              const clienteEliminado = this.pedidos.splice(index, 1);
              console.log(`Cliente con ID ${data.id} eliminado:`, clienteEliminado);
            } else {
              // Mostrar un mensaje si no se encuentra el cliente
              this.mostrarMensaje('Bezeroa ez da aurkitu', `Ez dago id hori duen bezerorik: ${data.id}.`);
            }
          },
        },
      ],
    });
  
    await alert.present();
  }
  
  // Método para mostrar un mensaje informativo
  async mostrarMensaje(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
  
    await alert.present();
  }
  

  async editarCliente() {
    const idAlert = await this.alertController.create({
      header: 'Editar Cliente',
      inputs: [
        {
          name: 'id',
          type: 'number',
          placeholder: 'ID del cliente',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Edición cancelada.');
            return false; // Retorna un valor explícito
          },
        },
        {
          text: 'Siguiente',
          handler: (data) => {
            if (!data.id) {
              console.error('Debe ingresar un ID válido.');
              return false; // Retorna un valor explícito
            }
            const cliente = this.pedidos.find((pedido) => pedido.id === parseInt(data.id, 10));
            if (!cliente) {
              this.mostrarMensaje('Error', `No se encontró ningún cliente con ID: ${data.id}`);
              return false; // Retorna un valor explícito
            }
            this.editarDatosCliente(cliente); // Asegúrate de manejar lo que esta función retorna
            return true; // Retorna un valor explícito
          },
        },
      ],
    });
  
    await idAlert.present();
    return; // Retorna un valor explícito al final
  }
  
  
  async editarDatosCliente(cliente: any) {
    const alert = await this.alertController.create({
      header: 'Editar Datos del Cliente',
      inputs: [
        {
          name: 'nombreCliente',
          type: 'text',
          placeholder: 'Nombre del cliente',
          value: cliente.nombreCliente || '',
        },
        {
          name: 'servicio',
          type: 'text',
          placeholder: 'Servicio solicitado',
          value: cliente.servicio || '',
        },
        {
          name: 'hora',
          type: 'time',
          placeholder: 'Hora del servicio',
          value: cliente.hora || '',
        },
        {
          name: 'precio',
          type: 'number',
          placeholder: 'Precio del servicio',
          value: cliente.precio || '',
        },
        {
          name: 'comentarios',
          type: 'text',
          placeholder: 'Comentarios adicionales',
          value: cliente.comentarios || '',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Edición cancelada.');
            return false; // Retorna un valor explícito
          },
        },
        {
          text: 'Guardar',
          handler: (data) => {
            if (!data.nombreCliente || !data.servicio || !data.hora || !data.precio || !data.comentarios) {
              console.error('Todos los campos deben estar completos.');
              this.mostrarMensaje('Error', 'Todos los campos son obligatorios.');
              return false; // Retorna un valor explícito
            }
  
            // Actualizar los datos
            cliente.nombreCliente = data.nombreCliente;
            cliente.servicio = data.servicio;
            cliente.hora = data.hora;
            cliente.precio = parseFloat(data.precio);
            cliente.comentarios = data.comentarios;
  
            console.log(`Cliente con ID ${cliente.id} actualizado:`, cliente);
            this.mostrarMensaje('Éxito', 'Los datos del cliente se actualizaron correctamente.');
            return true; // Retorna un valor explícito
          },
        },
      ],
    });
  
    await alert.present();
    return; // Retorna un valor explícito al final
  }
  
  
  // Método para mostrar un mensaje informativo
  async mostrarMensajeDeEditar(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
  
    await alert.present();
  }
}  
