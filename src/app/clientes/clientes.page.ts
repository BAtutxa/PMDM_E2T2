import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {

  // Lista de pedidos con datos de ejemplo
  pedidos = [
    { id: 1, nombreCliente: 'Juan Pérez', servicio: 'Peinado', hora: '10:00', precio: 20.5, comentarios: 'Peinado.' },
    { id: 2, nombreCliente: 'María López', servicio: 'Corte', hora: '10:00', precio: 15.0, comentarios: 'Corte.' },
    { id: 3, nombreCliente: 'Carlos García', servicio: 'Tinte', hora: '10:00', precio: 30.0, comentarios: 'Tinte.' },
    { id: 4, nombreCliente: 'Alejandro Rivas', servicio: 'Peinado', hora: '10:00', precio: 20.5, comentarios: 'Peinado.' },
    { id: 5, nombreCliente: 'María Pérez', servicio: 'Peinado', hora: '10:00', precio: 15.0, comentarios: 'Peinado.' },
    { id: 6, nombreCliente: 'Carlos López', servicio: 'Corte', hora: '10:00', precio: 30.0, comentarios: 'Corte.' }
  ];

  // Ficha del cliente actual
  fichaCliente: any = null;

  // Control de visibilidad del modal
  isModalOpen: boolean = false;

  constructor() {}

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
  crearCliente() {
    console.log('Crear nuevo cliente');
    // Aquí podrías abrir un formulario para crear un cliente
  }

  // Función para borrar un cliente
  borrarCliente() {
    if (this.fichaCliente) {
      const index = this.pedidos.findIndex(pedido => pedido.id === this.fichaCliente.id);
      if (index > -1) {
        this.pedidos.splice(index, 1); // Eliminar el pedido
        this.closeFicha(); // Cerrar el modal
        console.log('Cliente borrado');
      }
    }
  }

  // Función para editar un cliente
  editarCliente() {
    if (this.fichaCliente) {
      console.log('Editar cliente', this.fichaCliente);
      // Aquí podrías abrir un formulario de edición
    }
  }
}
