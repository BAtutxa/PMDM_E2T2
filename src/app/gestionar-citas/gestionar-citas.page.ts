import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CitaService } from '../services/cita.service';
import { jsPDF } from "jspdf";
import { ITrabajador } from "../interfaces/ITrabajador";
import { LangileakService } from '../services/Langileak.service'; 

@Component({
  selector: 'app-gestionar-citas',
  templateUrl: './gestionar-citas.page.html',
  styleUrls: ['./gestionar-citas.page.scss'],
})
export class GestionarCitasPage implements OnInit {

  citas: any[] = [];
  citaSeleccionada: any = null;
  modalAbierto = false;
  trabajadores: ITrabajador [] = [];

  constructor(
    private http: HttpClient,
    private citaService: CitaService,
    private langileakService: LangileakService,
  ) {}

  ngOnInit() {
    this.obtenerCitas();
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

  abrirModal(cita: any) {
    this.citaSeleccionada = { ...cita }; // Hacer una copia de la cita para editarla
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
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
        this.obtenerCitas(); // Volver a obtener las citas actualizadas
        this.cerrarModal(); // Cerrar el modal después de la actualización
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
          // Eliminar la cita de la lista en la interfaz
          this.citas = this.citas.filter(cita => cita.id !== this.citaSeleccionada.id);
          this.cerrarModal(); // Cerrar el modal después de la eliminación
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
  

  imprimirTicket() {
    let listaCitas: any[] = [];
    
    this.http.get<any[]>('http://localhost:8080/hitzorduak/hitzorduakGuztiak').subscribe(
      (data) => {
        listaCitas = data;
        console.log('Citas obtenidas:', listaCitas);
      },
      (error) => {
        console.error('Error al obtener las citas:', error);
      }
    );

    this.langileakService.getLangileak().subscribe(
      (trabajadores: ITrabajador[]) => {
        console.log("Trabajadores obtenidos:", trabajadores); 
    
        this.trabajadores = trabajadores; 
        console.log("Cita id langile:" + this.citaSeleccionada.id_langilea);
        const citaSeleccionada = listaCitas.find(cita => cita.id === this.citaSeleccionada.id);
    
        if (citaSeleccionada) {
          this.citaSeleccionada.id_langilea = citaSeleccionada.id_langilea;
        } else {
          console.error("Cita seleccionada no encontrada en la lista de citas.");
          return;
        }
    
        const trabajadorNombre = this.obtenerTrabajadorPorId(this.citaSeleccionada.id_langilea);
    
        if (trabajadorNombre === 'Trabajador no encontrado') {
          console.error("No se pudo obtener el nombre del trabajador.");
          return;
        }
    
        const doc = new jsPDF();
    
        doc.setProperties({
          title: 'Ticket',
          subject: 'Ticket FP San Jorge',
          author: 'FP San Jorge',
        });
    
        const logoUrl = '../assets/Images/IMP_Logotipoa.png'; 
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
    
        const logoWidth = 60;  
        const logoHeight = 60; 
        const xPos = pageWidth - logoWidth - 10; 
        const yPos = 30;  
        doc.addImage(logoUrl, 'PNG', xPos, yPos, logoWidth, logoHeight); 
  
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20); 
        doc.setTextColor(0, 102, 204);  
        doc.text("TICKET FP SAN JORGE", 20, 30); 
    
        const direccion = "Dirección: Pajares Kalea, 34, 48980 Santurtzi, Bizkaia";
        const telefono = "Teléfono: 944 00 49 30";
        
        doc.setFontSize(12);  
        doc.setTextColor(169, 169, 169);  
        doc.text(direccion, 20, 40);  
        doc.text(telefono, 20, 50);  
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);  
        doc.setTextColor(0, 0, 0);  
    
        const ticketData = [
          `Hora: ${citaSeleccionada.hasiera_ordua} - ${citaSeleccionada.amaiera_ordua}`,
          `Descripción: ${citaSeleccionada.deskribapena || 'No hay descripción'}`,
          `Precio total: ${citaSeleccionada.prezio_totala}€`,
          `Trabajador: ${trabajadorNombre}`
        ];
        
        let yPosition = 60; 
        const lineHeight = 8;
    
        ticketData.forEach((item, index) => {
          doc.text(`- ${item}`, 20, yPosition); 
          yPosition += lineHeight; 
        });
    
        doc.save(`Ticket de ${citaSeleccionada.izena}.pdf`);
      },
      (error) => {
        console.error("Error al obtener los trabajadores:", error);
      }
    );
  }    
}
