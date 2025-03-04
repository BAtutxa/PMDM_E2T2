import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { EsHistorialService } from '../services/EsHistorial.service';  // Asegúrate de importar correctamente el servicio
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-historiala',
  templateUrl: './historiala.page.html',
  styleUrls: ['../administracion/administracion.page.scss'],
})
export class HistorialaPage{

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private historialService: EsHistorialService
  ) { }

    cambiarAClientes() {
      this.historialService.setEsHistorial(true);  
      this.router.navigate(['/clientes']).then(() => {
          window.location.reload(); // Recarga la página
      });
      this.menuCtrl.open();
      this.router.navigate(['/clientes'], { queryParams: { desdeHistorial: 'true' } });
  }

  cambiarACategorias() {
      this.historialService.setEsHistorial(true);  
      this.router.navigate(['/categorias']).then(() => {
          window.location.reload(); // Recarga la página
      });
      this.menuCtrl.open();
      this.router.navigate(['/categorias'], { queryParams: { desdeHistorial: 'true' } });
  }

  cambiarAProductos(){
    this.historialService.setEsHistorial(true);  
    this.router.navigate(['/productos']).then(() => {
        window.location.reload(); // Recarga la página
    });
    this.menuCtrl.open();
    this.router.navigate(['/productos'], { queryParams: { desdeHistorial: 'true' } });
  }

  cambiarAGrupos(){
    this.historialService.setEsHistorial(true);  
    this.router.navigate(['/grupos']).then(() => {
        window.location.reload(); // Recarga la página
    });
    this.menuCtrl.open();
    this.router.navigate(['/grupos'], { queryParams: { desdeHistorial: 'true' } });
  }

  irAGestionarcitas(){
    this.historialService.setEsHistorial(true);  
    this.router.navigate(['/gestionar-citas']).then(() => {
        window.location.reload(); // Recarga la página
    });
    this.menuCtrl.open();
    this.router.navigate(['/gestionar-citas'], { queryParams: { desdeHistorial: 'true' } });
  }

  irAMateriales(){
    this.historialService.setEsHistorial(true);  
    this.router.navigate(['/materiales']).then(() => {
        window.location.reload(); // Recarga la página
    });
    this.menuCtrl.open();
    this.router.navigate(['/materiales'], { queryParams: { desdeHistorial: 'true' } });
  }

  irAMaterialMaileguak(){
    this.historialService.setEsHistorial(true);  
    this.router.navigate(['/material-maileguak']).then(() => {
        window.location.reload(); // Recarga la página
    });
    this.menuCtrl.open();
    this.router.navigate(['/material-maileguak'], { queryParams: { desdeHistorial: 'true' } });
  }

  irATickets(){
    this.historialService.setEsHistorial(true);  
    this.router.navigate(['/tickets']).then(() => {
        window.location.reload(); // Recarga la página
    });
    this.menuCtrl.open();
    this.router.navigate(['/tickets'], { queryParams: { desdeHistorial: 'true' } });
  }

  irAServicios(){
    this.historialService.setEsHistorial(true);  
    this.router.navigate(['/servicios']).then(() => {
        window.location.reload(); // Recarga la página
    });
    this.menuCtrl.open();
    this.router.navigate(['/servicios'], { queryParams: { desdeHistorial: 'true' } });
  }

  irAKolore(){
    this.historialService.setEsHistorial(true);  
    this.router.navigate(['/kolore-historialak']).then(() => {
        window.location.reload(); // Recarga la página
    });
    this.menuCtrl.open();
    this.router.navigate(['/kolore-historialak'], { queryParams: { desdeHistorial: 'true' } });
  }

  irAMugimenduak(){
    this.historialService.setEsHistorial(true);  
    this.router.navigate(['/produktu-mugimenduak']).then(() => {
        window.location.reload(); // Recarga la página
    });
    this.menuCtrl.open();
    this.router.navigate(['/produktu-mugimenduak'], { queryParams: { desdeHistorial: 'true' } });
  }
  
}
