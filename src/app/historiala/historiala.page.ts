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

    cambiarAClientes(event: Event) {
      this.historialService.setEsHistorial(true);  
      this.router.navigate(['/clientes']).then(() => {
          window.location.reload(); // Recarga la página
      });
      this.menuCtrl.open(); // Abre el menú si es necesario
  }

  cambiarACategorias(event: Event) {
      this.historialService.setEsHistorial(true);  
      this.router.navigate(['/categorias']).then(() => {
          window.location.reload(); // Recarga la página
      });
      this.menuCtrl.open();
  }

}
