// Esta página está rota.
import { Component, OnInit } from '@angular/core';
import { KoloreHistorialakService } from '../services/koloreHistorialak.service';// Asegúrate de importar el servicio correspondiente
import { IKoloreHistorialak } from '../interfaces/IKoloreHistorialak'; // Asegúrate de tener la interfaz

@Component({
  selector: 'app-kolore-historialak-ezabatuta',
  templateUrl: './kolore-historialak-ezabatuta.page.html',
  styleUrls: ['./kolore-historialak-ezabatuta.page.scss'],
})
export class KoloreHistorialakEzabatutaPage implements OnInit {
  
  // Variable para almacenar los historiales eliminados
  historialEzabatuta: IKoloreHistorialak[] = [];

  constructor(private koloreHistorialakService: KoloreHistorialakService) {}

  ngOnInit() {
    this.loadHistorialEzabatuta(); // Cargar los historiales eliminados
  }

  // Método para cargar los historiales eliminados
  loadHistorialEzabatuta(): void {
    this.koloreHistorialakService.getKoloreHistorialakEzabatuta().subscribe(
      (data) => {
        this.historialEzabatuta = data;
      },
      (error) => {
        console.error('Error al cargar los historiales eliminados', error);
      }
    );
  }

  // Método para recuperar un historial
  recoverHistorial(id: number): void {
    // Primero, encontramos el historial con el ID
    const historial = this.historialEzabatuta.find(h => h.id === id);
    
    if (historial) {
      // Setear ezabatze_data a null para recuperar el historial
      historial.dataSimple.ezabatze_data = null;

      // Llamar al servicio para actualizar el historial
      this.koloreHistorialakService.updateKoloreHistorialak(historial).subscribe(
        () => {
          this.loadHistorialEzabatuta(); // Recargar los historiales eliminados
        },
        (error) => {
          console.error('Error al recuperar el historial', error);
        }
      );
    } else {
      console.error('Historial no encontrado');
    }
  }

  // Método para eliminar un historial definitivamente (hard delete)
  hardDeleteHistorial(id: number): void {
    this.koloreHistorialakService.hardDeleteKoloreHistorialak(id).subscribe(
      (response) => {
        console.log('Historial eliminado definitivamente', response);
        this.loadHistorialEzabatuta(); // Recargar la lista
      },
      (error) => {
        console.error('Error al eliminar el historial permanentemente', error);
      }
    );
  }
}
