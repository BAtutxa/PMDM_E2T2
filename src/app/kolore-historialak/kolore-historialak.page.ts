import { Component, OnInit } from '@angular/core';
import { KoloreHistorialakService } from '../services/koloreHistorialak.service';
import { IKoloreHistorialak } from '../interfaces/IKoloreHistorialak';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kolore-historialak',
  templateUrl: './kolore-historialak.page.html',
  styleUrls: ['./kolore-historialak.page.scss']
})
export class KoloreHistorialakPage implements OnInit {

  historial: IKoloreHistorialak[] = [];
  selectedHistorial: IKoloreHistorialak | null = null; // Variable para el historial seleccionado
  newHistorial: IKoloreHistorialak = this.getEmptyHistorial(); // Inicializar un historial vacío para crear
  showCreateForm: boolean = false; // Variable para controlar la visibilidad del formulario de creación

  constructor(
    private koloreHistorialakService: KoloreHistorialakService,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadHistorial();
  }

  // Cargar historial no eliminado
  loadHistorial(): void {
    this.koloreHistorialakService.getKoloreHistorialak().subscribe(
      (data) => {
        this.historial = data;
      },
      (error) => {
        console.error('Error al cargar el historial', error);
      }
    );
  }

  // Función para editar el historial
  editHistorial(item: IKoloreHistorialak): void {
    this.selectedHistorial = { ...item }; // Crear una copia para editar
  }

  // Función para guardar los cambios
  saveChanges(): void {
    if (this.selectedHistorial) {
      this.koloreHistorialakService.updateKoloreHistorialak(this.selectedHistorial).subscribe(
        (updatedItem) => {
          console.log('Historial actualizado con éxito', updatedItem);
          this.selectedHistorial = null; // Resetear el formulario
          this.loadHistorial(); // Recargar el historial después de la actualización
        },
        (error) => {
          console.error('Error al actualizar historial', error);
        }
      );
    }
  }

  // Función para cancelar la edición
  cancelEdit(): void {
    this.selectedHistorial = null; // Cancelar y resetear el formulario
  }

  // Función para eliminar el historial
  deleteHistorial(id: number): void {
    this.koloreHistorialakService.deleteKoloreHistorialak(id).subscribe(
      () => {
        console.log('Historial eliminado con éxito');
        this.loadHistorial(); // Recargar el historial después de la eliminación
      },
      (error) => {
        console.error('Error al eliminar historial', error);
      }
    );
  }

  // Función para crear un nuevo historial
  createHistorial(): void {
    this.koloreHistorialakService.createKoloreHistorialak(this.newHistorial).subscribe(
      (createdItem) => {
        console.log('Nuevo historial creado con éxito', createdItem);
        this.newHistorial = this.getEmptyHistorial(); // Resetear el formulario
        this.loadHistorial(); // Recargar el historial después de la creación
        this.showCreateForm = false; // Ocultar el formulario de creación
      },
      (error) => {
        console.error('Error al crear historial', error);
      }
    );
  }

  // Función para resetear los valores del nuevo historial
  getEmptyHistorial(): IKoloreHistorialak {
    return {
      id: 0,
      bezero: 0,
      produktu_id: 0,
      data: null,
      kantitatea: 0,
      bolumena: null,
      oharrak: null,
      dataSimple: {
        sortze_data: null,
        eguneratze_data: null,
        ezabatze_data: null
      }
    };
  }

  // Función para cancelar la creación del nuevo historial
  cancelCreate(): void {
    this.showCreateForm = false; // Ocultar el formulario de creación
    this.newHistorial = this.getEmptyHistorial(); // Limpiar los datos del formulario
  }

    // Nueva función para redirigir a la página 'kolore-historialak-ezabatuta'
    goToEzabatuta(): void {
      this.router.navigate(['/kolore-historialak-ezabatuta']);  // Navegar a la página
    }
}
