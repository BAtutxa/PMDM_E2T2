import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EsHistorialService } from '../services/EsHistorial.service';  // Asegúrate de importar correctamente el servicio
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-historiala',
  templateUrl: './historiala.page.html',
  styleUrls: ['../administracion/administracion.page.scss'],
})
export class HistorialaPage implements OnInit {

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private historialService: EsHistorialService
  ) { }

  ngOnInit() {
  }

  cambiarAClientes(event: Event) {
    event.stopPropagation(); // Previene que el menú se cierre
    this.historialService.setEsHistorial(true);  
    this.router.navigate(['/clientes']); 
    this.menuCtrl.open(); // Abre el menú si es necesario
  }

}
