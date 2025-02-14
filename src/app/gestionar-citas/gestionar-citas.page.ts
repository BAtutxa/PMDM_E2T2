import { Component, HostListener, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CitaService } from '../services/cita.service';
import { jsPDF } from "jspdf";
import { ITrabajador } from "../interfaces/ITrabajador";
import { LangileakService } from '../services/Langileak.service';
import { TicketService } from '../services/ticket.service';
import { ITicket } from '../interfaces/ITicket';
import { IZerbitzuak } from '../interfaces/IZerbitzuak';
import { ZerbitzuakService } from '../services/zerbitzuak.service';
import { AlertController } from '@ionic/angular';
import { firstValueFrom, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { EsHistorialService } from '../services/EsHistorial.service';

@Component({
  selector: 'app-gestionar-citas',
  templateUrl: './gestionar-citas.page.html',
  styleUrls: ['./gestionar-citas.page.scss'],
})
export class GestionarCitasPage implements OnInit {

  citas: any[] = [];
  citaSeleccionada: any = null;
  modalAbierto = false;
  trabajadores: ITrabajador[] = [];
  listaServicios: IZerbitzuak[] = [];
  mobilaDa: boolean = false; 
  servicioSeleccionado: number | null = null;  // Variable para almacenar el servicio seleccionado
  esHistorial: boolean = false;
  
  constructor(
    private http: HttpClient,
    private citaService: CitaService,
    private langileakService: LangileakService,
    private ticketService : TicketService,
    private serviciosService : ZerbitzuakService,
    private alertController : AlertController,
    private router : Router,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private historialService: EsHistorialService
  ) {}

  // Detectar cambios en el tamaño de la pantalla
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.mobilaDa = window.innerWidth <= 768;  // Establecer mobilaDa como true si el ancho es menor a 768px
  }

  ngOnInit() {
    this.onResize();
     // Leer el parámetro "desdeHistorial" de la URL
     this.route.queryParams.subscribe(params => {
      this.esHistorial = params['desdeHistorial'] === 'true';
      this.historialService.setEsHistorial(this.esHistorial);
      console.log("Historial:", this.esHistorial);
    });
    if(this.esHistorial){
      this.obtenerCitasEliminadas();
    }else{
      this.obtenerCitas();
    }
    
    // Obtener los servicios disponibles
    this.serviciosService.getZerbitzuak().subscribe(data => {
      console.log("Servicios obtenidos:", data);
      this.listaServicios = data;
    });
  }

  servicioChange(event: any) {
    this.servicioSeleccionado = event.detail.value;  // Asignamos el valor del servicio seleccionado
  }

  get etxekoa() {
    return this.citaSeleccionada.etxekoa === 'E' ? 'Bai' : 'No';
  }

  set etxekoa(value: string) {
    this.citaSeleccionada.etxekoa = value === 'Bai' ? 'E' : 'No';
  }

  obtenerCitas() {
    this.http.get<any[]>('http://localhost:8080/hitzorduak/hitzorduakGuztiak').subscribe(
      (data) => {
        this.citas = data;
        console.log('Citas obtenidas:', this.citas);
      },
      (error) => {
        console.error('Error al obtener las citas:', error);
      }
    );
  }

  obtenerCitasEliminadas() {
    this.http.get<any[]>('http://localhost:8080/hitzorduak/ezabatuak').subscribe(
      (data) => {
        this.citas = data;
        console.log('Citas obtenidas:', this.citas);
      },
      (error) => {
        console.error('Error al obtener las citas:', error);
      }
    );
  }

  abrirModal(cita: any) {
    this.citaSeleccionada = { ...cita };  // Hacer una copia de la cita para editarla
    this.modalAbierto = true;
  }

  cerrarModal(recargarDatos: boolean = false) {
    this.modalAbierto = false;
    this.cdRef.detectChanges(); // Forzar la detección de cambios
  
    if (recargarDatos) {
      if (this.esHistorial) {
        this.obtenerCitasEliminadas(); // Recargar citas eliminadas si estamos en el historial
      } else {
        this.obtenerCitas(); // Recargar citas activas
      }
    }
  }

  // Método para confirmar los cambios (actualizar la cita)
  confirmarCambios() {
    console.log('Confirmando cambios para la cita:', this.citaSeleccionada);
  
    // Convertir la fecha a un objeto Date y sumar un día
    let fecha = new Date(this.citaSeleccionada.data);
    fecha.setDate(fecha.getDate() + 1); // Sumar 1 día
  
    // Convertir la fecha de nuevo a formato ISO string (sin la parte de la hora)
    this.citaSeleccionada.data = fecha.toISOString().split('T')[0];  // Solo la fecha (YYYY-MM-DD)
  
    // Llamar al servicio para actualizar la cita
    this.citaService.updateCita(this.citaSeleccionada).subscribe(
      (response) => {
        console.log('Cita actualizada exitosamente:', response);
        this.cerrarModal(true); // Cerrar el modal y recargar los datos
      },
      (error) => {
        console.error('Error al actualizar la cita:', error);
      }
    );
  }

  cancelarCambios() {
  console.log('Eliminando cita:', this.citaSeleccionada);

  // Aquí podrías mostrar un diálogo de confirmación al usuario antes de eliminar
  if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
    // Llamar al servicio para eliminar la cita
    this.citaService.deleteCita(this.citaSeleccionada.id).subscribe(
      (response) => {
        console.log('Cita eliminada exitosamente:', response);
        this.cerrarModal(true); // Cerrar el modal y recargar los datos
      },
      (error) => {
        console.error('Error al eliminar la cita:', error);
      }
    );
  } else {
    console.log('Cancelación de la eliminación de la cita');
  }
}

  obtenerTrabajadorPorId(id: number | null): string {
    if (id === null) {
      console.error("id_Langilea es nulo");
      return 'Trabajador no encontrado';
    }
  
    // Buscar el trabajador en la lista de trabajadores
    const trabajador = this.trabajadores.find((trab: ITrabajador) => trab.id === id);
  
    // Si no se encuentra el trabajador, loguea el error
    if (!trabajador) {
      console.error(`Trabajador con id ${id} no encontrado`);
      return 'Trabajador no encontrado';
    }
  
    // Devolver el nombre completo del trabajador
    return `${trabajador.izena} ${trabajador.abizenak}`;
  }

  async mostrarAlerta(message: string) {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  getServicioById(id: number): Observable<IZerbitzuak> {
    return this.http.get<IZerbitzuak>(`http://localhost:8080/zerbitzuak/${id}`);
  }
  
  imprimirTicket() {
    let listaCitas: any[] = [];
  
    // Cargar las citas después de obtener los servicios
    this.http.get<any[]>('http://localhost:8080/hitzorduak/hitzorduakGuztiak').subscribe(
      (data) => {
        listaCitas = data;
        console.log('Citas obtenidas:', listaCitas);
  
        // Buscar la cita seleccionada
        const citaSeleccionada = listaCitas.find(cita => cita.id === this.citaSeleccionada.id);
        console.log("Cita a enviar:", JSON.stringify(citaSeleccionada, null, 2));
  
        if (!citaSeleccionada) {
          console.error("Cita seleccionada no encontrada en la lista de citas.");
          return;
        }
  
        // Verificar si el servicio está seleccionado
        if (!this.servicioSeleccionado) {
          this.mostrarAlerta('Por favor, selecciona un servicio antes de generar el ticket.');
          return;
        }
  
        // Verificar si todos los campos requeridos tienen valores válidos
        if (!citaSeleccionada.id_langilea || !citaSeleccionada.izena || !citaSeleccionada.telefonoa) {
          this.mostrarAlerta('Todos los campos de la cita deben ser completados antes de generar el ticket.');
          return;
        }
  
        // Obtener el servicio asociado a la cita
        this.getServicioById(this.servicioSeleccionado).subscribe(
          (servicio) => {
            console.log("Servicio obtenido:", servicio);
  
            // Obtener el trabajador asociado a la cita
            this.langileakService.getLangileak().subscribe(
              (trabajadores: ITrabajador[]) => {
                console.log("Trabajadores obtenidos:", trabajadores);
                this.trabajadores = trabajadores;
  
                // Buscar el nombre del trabajador
                const trabajadorNombre = this.obtenerTrabajadorPorId(citaSeleccionada.id_langilea);
                if (trabajadorNombre === 'Trabajador no encontrado') {
                  console.error("No se pudo obtener el nombre del trabajador.");
                  return;
                }
  
                // Crear el nuevo ticket
                const nuevoTicket: ITicket = {
                  id: null,
                  zerbitzuak: {
                    id: servicio.id,
                    izena: servicio.izena,
                    etxeko_prezioa: servicio.etxeko_prezioa,
                    kanpoko_prezioa: servicio.kanpoko_prezioa,
                    data: servicio.data
                  },
                  hitzorduak: {
                    id: citaSeleccionada.id,
                    eserlekua: citaSeleccionada.eserlekua,
                    id_langilea: citaSeleccionada.id_langilea,
                    data: citaSeleccionada.data,
                    hasiera_ordua: citaSeleccionada.hasiera_ordua,
                    amaiera_ordua: citaSeleccionada.amaiera_ordua,
                    hasiera_ordua_erreala: null,
                    amaiera_ordua_erreala: null,
                    izena: citaSeleccionada.izena,
                    telefonoa: citaSeleccionada.telefonoa,
                    deskribapena: citaSeleccionada.deskribapena,
                    etxekoa: citaSeleccionada.etxekoa,
                    prezio_totala: citaSeleccionada.prezio_totala,
                    dataSimple: {
                      sortze_data: new Date(),
                      eguneratze_data: new Date(),
                      ezabatze_data: null
                    }
                  },
                  data: {
                    sortze_data: new Date(),
                    eguneratze_data: new Date(),
                    ezabatze_data: null
                  },
                  prezioa: citaSeleccionada.prezio_totala
                };
  
                console.log('Nuevo ticket:', nuevoTicket);
  
                // Crear PDF
                const doc = new jsPDF();
  
                // Cargar y agregar la imagen al PDF
                const img = new Image();
                img.src = 'assets/Images/IMP_Logotipoa.png';
  
                img.onload = () => {
                  // Agregar la imagen al PDF
                  doc.addImage(img, 'PNG', 10, 10, 50, 50); // Ajusta las coordenadas y el tamaño según sea necesario
  
                  // Agregar el texto al PDF
                  doc.text(`Ticket de Cita`, 10, 70);
                  doc.text(`Nombre: ${nuevoTicket.hitzorduak.izena}`, 10, 80);
                  doc.text(`Telefono: ${nuevoTicket.hitzorduak.telefonoa}`, 10, 90);
                  doc.text(`Servicio: ${nuevoTicket.zerbitzuak.izena}`, 10, 100);
                  doc.text(`Trabajador: ${trabajadorNombre}`, 10, 110);
                  doc.text(`Fecha: ${nuevoTicket.hitzorduak.data}`, 10, 120);
                  doc.text(`Hora: ${nuevoTicket.hitzorduak.hasiera_ordua} - ${nuevoTicket.hitzorduak.amaiera_ordua}`, 10, 130);
  
                  // Guardar el PDF
                  doc.save('ticket-cita.pdf');
  
                  // Guardar el ticket en el servidor
                  this.ticketService.crearTicket(nuevoTicket).subscribe(
                    (response: any) => {
                      console.log("Ticket guardado correctamente");
                      this.cerrarModal();
                      this.router.navigate(['/tickets']).then(() => {
                        window.location.reload(); // Recarga la página solo después de llegar a /tickets
                      });
                    },
                    (error) => {
                      console.error("Error al guardar el ticket:", error);
                    }
                  );
                };
              },
              (error) => {
                console.error('Error al obtener los trabajadores:', error);
              }
            );
          },
          (error) => {
            console.error('Error al obtener el servicio:', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener las citas:', error);
      }
    );
  }

  async Borrar() {
    if (!this.citaSeleccionada) {
      console.error('No se ha seleccionado ninguna cita para eliminar.');
      return;
    }
  
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar esta cita permanentemente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              const response = await firstValueFrom(this.citaService.deleteCitaPermanently(this.citaSeleccionada.id));
              console.log('Respuesta del servidor:', response);
  
              // Mostrar un mensaje de éxito
              const successAlert = await this.alertController.create({
                header: 'Éxito',
                message: 'La cita ha sido eliminada permanentemente.',
                buttons: ['OK'],
              });
              await successAlert.present();
  
              // Cerrar el modal y recargar los datos
              this.cerrarModal(true);
            } catch (error) {
              console.error('Error al eliminar la cita:', error);
  
              // Mostrar un mensaje de error
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'No se pudo eliminar la cita. Inténtalo de nuevo.',
                buttons: ['OK'],
              });
              await errorAlert.present();
            }
          },
        },
      ],
    });
  
    await alert.present();
  }

  Restaurar() {
    if (!this.citaSeleccionada) {
      console.error('No se ha seleccionado ninguna cita para restaurar.');
      return;
    }
  
    console.log('Restaurando cita:', this.citaSeleccionada);
  
    // Establecer ezabatze_data en null
    this.citaSeleccionada.ezabatze_data = null;
  
    // Convertir la fecha a un objeto Date y sumar un día (si es necesario)
    let fecha = new Date(this.citaSeleccionada.data);
    fecha.setDate(fecha.getDate() + 1); // Sumar 1 día
  
    // Convertir la fecha de nuevo a formato ISO string (sin la parte de la hora)
    this.citaSeleccionada.data = fecha.toISOString().split('T')[0];  // Solo la fecha (YYYY-MM-DD)
  
    // Llamar al servicio para actualizar la cita
    this.citaService.updateCita(this.citaSeleccionada).subscribe(
      (response) => {
        console.log('Cita restaurada exitosamente:', response);
  
        // Mostrar un mensaje de éxito
        this.mostrarAlerta('La cita ha sido restaurada correctamente.');
  
        // Cerrar el modal y recargar los datos
        this.cerrarModal(true);
      },
      (error) => {
        console.error('Error al restaurar la cita:', error);
  
        // Mostrar un mensaje de error
        this.mostrarAlerta('No se pudo restaurar la cita. Inténtalo de nuevo.');
      }
    );
  }
}  