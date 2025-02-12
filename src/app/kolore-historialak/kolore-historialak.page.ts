import { Component, OnInit } from '@angular/core';
import { KoloreHistorialakService } from '../services/koloreHistorialak.service';
import { IKoloreHistorialak } from '../interfaces/IKoloreHistorialak';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-kolore-historialak',
  templateUrl: './kolore-historialak.page.html',
  styleUrls: ['./kolore-historialak.page.scss']
})
export class KoloreHistorialakPage implements OnInit {

  historial: IKoloreHistorialak[] = [];

  constructor(
    private koloreHistorialakService: KoloreHistorialakService,
    private alertController: AlertController
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
    // Aquí podrías abrir un formulario o un modal para editar el item.
    console.log('Editar item:', item);
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
}
