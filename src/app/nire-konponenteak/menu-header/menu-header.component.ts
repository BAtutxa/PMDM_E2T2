import { Component, OnInit } from '@angular/core';
import { EsHistorialService } from 'src/app/services/EsHistorial.service';

@Component({
  selector: 'app-menu-header',
  templateUrl: './menu-header.component.html',
  styleUrls: ['./menu-header.component.scss'],
})
export class MenuHeaderComponent  implements OnInit {

  constructor(historialService:EsHistorialService) { }

  ngOnInit() {}

}
