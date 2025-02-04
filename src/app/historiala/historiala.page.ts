import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EsHistorialService } from '../services/EsHistorial.service';  // Asegúrate de importar correctamente el servicio

@Component({
  selector: 'app-historiala',
  templateUrl: './historiala.page.html',
  styleUrls: ['../administracion/administracion.page.scss'],
})
export class HistorialaPage implements OnInit {

  constructor(
    private router: Router,
    private historialService: EsHistorialService
  ) { }

  ngOnInit() {
  }

  cambiarAClientes() {
    this.historialService.setEsHistorial(true);  
    this.router.navigate(['/clientes']); 
  }

}
