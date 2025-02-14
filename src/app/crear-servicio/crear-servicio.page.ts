import { Component} from '@angular/core';
import { ZerbitzuakService } from '../services/zerbitzuak.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

export interface IZerbitzuak{
  id: number |null
  izena: string
  etxeko_prezioa: number | null
  kanpoko_prezioa: number |null
  data: {
    sortze_data: Date | null; 
    eguneratze_data: Date | null;
    ezabatze_data: Date | null;
  };
}

@Component({
  selector: 'app-crear-servicio',
  templateUrl: './crear-servicio.page.html',
  styleUrls: ['../crear-ficha/crear-ficha.page.scss'],
})
export class CrearServicioPage{

  constructor( private translateService: TranslateService, private zerbitzuakService: ZerbitzuakService, private router: Router) { }

  servicio:IZerbitzuak = {
    id: null,
    izena: "",
    etxeko_prezioa: null,
    kanpoko_prezioa: null,
    data:{
      sortze_data: new Date,
      eguneratze_data: new Date,
      ezabatze_data:  null,
    },
  }

  ngOnInit() {
    this.translateService.setDefaultLang('es');
    this.translateService.use('eu');
  }

  guardarServicio() {
    this.translateService.get(['CREAR_SERVICIO.CAMPOS_OBLIGATORIOS', 'CREAR_SERVICIO.SERVICIO_CREADO']).subscribe(translations => {
      if (!this.servicio.izena || !this.servicio.etxeko_prezioa || !this.servicio.kanpoko_prezioa) {
        console.error(translations['CREAR_SERVICIO.CAMPOS_OBLIGATORIOS']);
        return;
      }
  
      console.log('Servicio a guardar:', this.servicio);
      
      this.zerbitzuakService.saveZerbitzuak(this.servicio).subscribe({
        next: (response: IZerbitzuak) => {
          this.servicio.id = 0;
          alert(translations['CREAR_SERVICIO.SERVICIO_CREADO']);
          this.router.navigate(['/servicios']);
        },
        error: (error: any) => {
          console.error('Error al crear el servicio:', error);
        },
      });
    });
  }
  
}
